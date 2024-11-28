import type { DataDecoded } from '@safe-global/safe-gateway-typescript-sdk'
import { _getSetupFromDataDecoded } from '../usePredictSafeAddressFromTxDetails'

const createProxyWithNonce = {
  method: 'createProxyWithNonce',
  parameters: [
    {
      name: '_singleton',
      type: 'address',
      value: '0x41675C099F32341bf84BFc5382aF534df5C7461a',
      valueDecoded: null,
    },
    {
      name: 'initializer',
      type: 'bytes',
      value:
        '0xb63e800d00000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000bd89a1ce4dde368ffab0ec35506eece0b1ffdc540000000000000000000000000000000000000000000000000000000000000140000000000000000000000000fd0732dc9e303f09fcef3a7388ad10a83459ec99000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000057c26d4d117c926a872814fa46c179691f580e840000000000000000000000000000000000000000000000000000000000000024fe51f64300000000000000000000000029fcb43b46531bca003ddc8fcb67ffe91900c76200000000000000000000000000000000000000000000000000000000',
      valueDecoded: null,
    },
    {
      name: 'saltNonce',
      type: 'uint256',
      value: '3',
      valueDecoded: null,
    },
  ],
} as unknown as DataDecoded

describe('getSetupFromDataDecoded', () => {
  it('should return undefined if no createProxyWithNonce method is found', () => {
    const dataDecoded = {
      method: 'notCreateProxyWithNonce',
    }
    expect(_getSetupFromDataDecoded(dataDecoded)).toBeUndefined()
  })

  it('should return direct createProxyWithNonce calls', () => {
    expect(_getSetupFromDataDecoded(createProxyWithNonce)).toEqual({
      singleton: '0x41675C099F32341bf84BFc5382aF534df5C7461a',
      initializer:
        '0xb63e800d00000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000bd89a1ce4dde368ffab0ec35506eece0b1ffdc540000000000000000000000000000000000000000000000000000000000000140000000000000000000000000fd0732dc9e303f09fcef3a7388ad10a83459ec99000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000057c26d4d117c926a872814fa46c179691f580e840000000000000000000000000000000000000000000000000000000000000024fe51f64300000000000000000000000029fcb43b46531bca003ddc8fcb67ffe91900c76200000000000000000000000000000000000000000000000000000000',
      saltNonce: '3',
    })
  })

  it.each([
    ['_singleton', 0],
    ['initializer', 1],
    ['saltNonce', 2],
  ])('should return undefined if %s is not a string', (_, index) => {
    const dataDecoded = JSON.parse(JSON.stringify(createProxyWithNonce)) as DataDecoded
    // @ts-expect-error value is a string
    dataDecoded.parameters[index].value = 1
    expect(_getSetupFromDataDecoded(dataDecoded)).toBeUndefined()
  })
})

it.todo('usePredictSafeAddressFromTxDetails')