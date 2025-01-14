import { convertWalletClientToAccountSigner } from "../utils/signerAdapters"
import { WalletTypes } from "../types/types"
import { Address, createWalletClient, custom } from "viem"
import { b2TestHaven } from "../utils/chain"


const useEthCaSigner = () => {
  let injected:any
  const connect = async (wallet: WalletTypes) => {
    if (wallet === WalletTypes.WALLET_METAMASK) injected = window.ethereum
    if (wallet === WalletTypes.WALLET_OKX_EVM) injected = window.okxwallet
    const res = await injected?.request({ method: 'eth_requestAccounts' });
    return res as Address[];
  }
  const getEthCaSigner = async (wallet: WalletTypes) => {
    const accounts = await connect(wallet)
    const client = createWalletClient({
      chain: b2TestHaven,
      account: accounts[0],
      transport: custom(injected)
    })
    if (client) {
      return convertWalletClientToAccountSigner(client)
    }
  }
  return {
    getEthCaSigner
  }
}



export {
  useEthCaSigner
};