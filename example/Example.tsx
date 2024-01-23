import { useEffect } from "react"
import { useB2Modal } from "../src"
import { BtcConnectorName, useBtc } from "../src/btcWallet"
import { useB2Disconnect, useCaSigner } from "../src/hooks"
import { useBtcCaSigner } from "../src/hooks/useBtcCaSigner"
import { useCaAccount } from "../src/hooks/useCaAccount"
import { useEthCaSigner } from "../src/hooks/useEthCaSigner"
import { WalletCollection, WalletTypes } from "../src/types/types"
import { useWalletClient } from "wagmi"


const Example = () => {
  const { handleOpenConnectModal, handleSetWalletCollection } = useB2Modal()
  const { address, isConnected, walletType } = useCaAccount()
  const { currentWallet, connector,connectorName,network } = useBtc()
  const { data } = useWalletClient();
  const signer = useCaSigner({ signerType: walletType, btcConnector: connector, walletClient: data })
  console.log({ signer, walletType, data })
  const { getBtcSigner } = useBtcCaSigner()
  const { getEthCaSigner } = useEthCaSigner()
  const { disconnect } = useB2Disconnect()

  const getEvmWalletSigner = async () => {
    const s = await getEthCaSigner(WalletTypes.WALLET_METAMASK)
    const acc = await s?.getAddress()
  }
  const getBtcWalletSigner = async () => {
    const s = await getBtcSigner(BtcConnectorName.Unisat)
    s?.signMessage('hello').then(console.log)
  }
  const signHello = async () => {
    const res = await signer?.signMessage('hello')
    console.log({ res, connectorName })
  }

  return (
    <div style={{ width: '100vw', marginTop: '20px', display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
      <div onClick={() => {
        handleOpenConnectModal()
      }}>
        Login1
      </div>
      <div onClick={() => { 
        signHello()
      }}>Sign ({network})</div>
      <div onClick={getEvmWalletSigner}>get Eth Signer</div>

      <div onClick={getBtcWalletSigner}>
        get Btc Signer
      </div>

      <div onClick={() => {
        handleSetWalletCollection(WalletCollection.ETH)
      }}>only Eth</div>     <div onClick={() => {
        handleSetWalletCollection(WalletCollection.BTC)
      }}>btc</div>     <div onClick={() => {
        handleSetWalletCollection(WalletCollection.ALL)
      }}>all</div>
      <div>{address || ''}</div>
      <div>{isConnected.toString()}</div>
      <div onClick={() => {
        disconnect()
      }}>Disconnect</div>

      


    </div>
  )
}

export default Example