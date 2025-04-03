import {
  APPROVAL_SIGNATURE_HASH,
  INCREASE_ALLOWANCE_SIGNATURE_HASH,
} from '@/components/tx/ApprovalEditor/utils/approvals'
import { ERC20__factory } from '@/types/contracts'
import { normalizeTypedData } from '@/utils/web3'
import { type SafeTransaction } from '@safe-global/safe-core-sdk-types'
import { type EIP712TypedData } from '@safe-global/safe-gateway-typescript-sdk'
import { id } from 'ethers'
import { type SecurityResponse, type SecurityModule, SecuritySeverity } from '../types'
import { decodeMultiSendData } from '@gateway-fm/protocol-kit'

export type ApprovalModuleResponse = Approval[]

export type ApprovalModuleRequest = {
  safeTransaction: SafeTransaction
}

export type ApprovalModuleMessageRequest = {
  safeMessage: EIP712TypedData
}

export type Approval = {
  spender: any
  amount: any
  tokenAddress: string
  method: 'approve' | 'increaseAllowance' | 'Permit2'
  transactionIndex: number
}

type PermitDetails = { token: string; amount: string }

const MULTISEND_SIGNATURE_HASH = id('multiSend(bytes)').slice(0, 10)
const ERC20_INTERFACE = ERC20__factory.createInterface()

export class ApprovalModule implements SecurityModule<ApprovalModuleRequest, ApprovalModuleResponse> {
  private static scanInnerTransaction(txPartial: { to: string; data: string }, txIndex: number): Approval[] {
    if (txPartial.data.startsWith(APPROVAL_SIGNATURE_HASH)) {
      const [spender, amount] = ERC20_INTERFACE.decodeFunctionData('approve', txPartial.data)
      return [
        {
          amount,
          spender,
          tokenAddress: txPartial.to,
          method: 'approve',
          transactionIndex: txIndex,
        },
      ]
    }

    if (txPartial.data.startsWith(INCREASE_ALLOWANCE_SIGNATURE_HASH)) {
      const [spender, amount] = ERC20_INTERFACE.decodeFunctionData('increaseAllowance', txPartial.data)
      return [
        {
          amount,
          spender,
          tokenAddress: txPartial.to,
          method: 'increaseAllowance',
          transactionIndex: txIndex,
        },
      ]
    }
    return []
  }

  private static getPermitDetails(details: PermitDetails): Pick<Approval, 'amount' | 'tokenAddress'> {
    return {
      amount: BigInt(details.amount),
      tokenAddress: details.token,
    }
  }

  scanMessage(request: ApprovalModuleMessageRequest): SecurityResponse<ApprovalModuleResponse> {
    const safeMessage = request.safeMessage
    const approvalInfos: Approval[] = []
    const normalizedMessage = normalizeTypedData(safeMessage)

    if (normalizedMessage.domain.name === 'Permit2') {
      if (normalizedMessage.types['PermitSingle'] !== undefined) {
        const spender = normalizedMessage.message['spender'] as string
        const details = normalizedMessage.message['details'] as PermitDetails
        const permitInfo = ApprovalModule.getPermitDetails(details)

        approvalInfos.push({
          ...permitInfo,
          method: 'Permit2',
          spender,
          transactionIndex: 0,
        })
      } else if (normalizedMessage.types['PermitBatch'] !== undefined) {
        const spender = normalizedMessage.message['spender'] as string
        const details = normalizedMessage.message['details'] as PermitDetails[]
        details.forEach((details, idx) => {
          const permitInfo = ApprovalModule.getPermitDetails(details)

          approvalInfos.push({
            ...permitInfo,
            method: 'Permit2',
            spender,
            transactionIndex: idx,
          })
        })
      }
    }
    if (approvalInfos.length > 0) {
      return {
        severity: SecuritySeverity.NONE,
        payload: approvalInfos,
      }
    }

    return {
      severity: SecuritySeverity.NONE,
    }
  }

  scanTransaction(request: ApprovalModuleRequest): SecurityResponse<ApprovalModuleResponse> {
    const safeTransaction = request.safeTransaction

    const approvalInfos: Approval[] = []
    const safeTxData = safeTransaction.data.data
    if (safeTxData.startsWith(MULTISEND_SIGNATURE_HASH)) {
      const innerTxs = decodeMultiSendData(safeTxData)
      approvalInfos.push(...innerTxs.flatMap((tx, index) => ApprovalModule.scanInnerTransaction(tx, index)))
    } else {
      approvalInfos.push(...ApprovalModule.scanInnerTransaction({ to: safeTransaction.data.to, data: safeTxData }, 0))
    }

    if (approvalInfos.length > 0) {
      return {
        severity: SecuritySeverity.NONE,
        payload: approvalInfos,
      }
    }

    return {
      severity: SecuritySeverity.NONE,
    }
  }
}
