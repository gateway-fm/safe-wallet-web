import { useCallback } from 'react'
import useOnboard, { connectWallet } from '@/hooks/wallets/useOnboard'

const useConnectWallet = () => {
  const onboard = useOnboard()
  console.log('process clicking handle')
  return useCallback(() => {
    if (!onboard) {
      return Promise.resolve(undefined)
    }

    return connectWallet(onboard)
  }, [onboard])
}

export default useConnectWallet
