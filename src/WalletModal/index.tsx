import { Connector, useAccount, useConnect } from "wagmi";
import { BtcConnectorName, InstalledMap, useBtc } from "../btcWallet";
import Modal from 'react-modal';
import { useB2Modal } from "./context";
import { WalletCollection, WalletTypes } from "../types/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import iconMetamask from '../imgs/icon_metamask.svg'
import iconOkx from '../imgs/icon_okx.svg'
import iconUnisat from '../imgs/icon_unisat.svg'
import iconType from '../imgs/icon_type.svg'
import iconBitcoin from '../imgs/icon_bitcoin.svg'
import './styles/index.less';
import { saveWalletToLocal } from "../utils/localstore";
import WalletItem from "./components/WalletItem";
import ModalHeader from "./components/ModalHeader";

// const BTCWallets = [
//   {
//     key: 'Unisat',
//     name: 'UniSat Wallet'
//   },
//   {
//     key: 'OKX',
//     name: 'OKX Wallet'
//   },
//   // {
//   //   key: 'Xverse',
//   //   logo: '/assets/xverse.svg'
//   // },
// ]

const defaultInstalledMap: Record<WalletTypes, boolean> = {
  metamask: false,
  unisat: false,
  okx_btc: false,
  okx_evm: false,
}

const SubTitle = ({ title }: { title: string }) => {
  let subIcon=null;
  if(title==='Ethereum Wallet'){
    subIcon=iconType
  }else if(title==='Bitcoin Wallet'){
    subIcon=iconBitcoin
  }else{
    return null
  }
  return (
    <div className="title">
      <img src={subIcon} alt="icon" />
        {title}
    </div>
  )
}

const WalletModal = ({ collection }: { collection: WalletCollection }) => {
  const { connectAsync, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { connect: connectBtc, setCurrentWallet, connectors: btcConnectors } = useBtc()
  const { openConnectModal, hanldeCloseConnectModal } = useB2Modal()
  const { isConnected } = useAccount()
  const [installedMap, setInstalledMap] = useState<InstalledMap>(defaultInstalledMap)

  const showEth = useMemo(() => {
    return collection === WalletCollection.ALL || collection === WalletCollection.ETH
  }, [collection])
  const showBtc = useMemo(() => {
    return collection === WalletCollection.ALL || collection === WalletCollection.BTC
  }, [collection])

  const getImageUrl = (wallet: string) => {
    if (wallet.toLocaleLowerCase().includes('okx')) return iconOkx
    if (wallet.toLocaleLowerCase().includes('unisat')) return iconUnisat
    if (wallet.toLocaleLowerCase().includes('metamask')) return iconMetamask
    return ''
  }

  const getInstalled = useCallback((wallet: string) => {
    if (wallet.toLocaleLowerCase().includes('okx')) return installedMap[WalletTypes.WALLET_OKX_EVM]
    if (wallet.toLocaleLowerCase().includes('unisat')) return installedMap[WalletTypes.WALLET_UNISAT]
    if (wallet.toLocaleLowerCase().includes('metamask')) return installedMap[WalletTypes.WALLET_METAMASK]
    return false

  }, [installedMap])

  const handleClickEthWallet = async (c: Connector) => {
    if (!isConnected) {
      const res = await connectAsync({ connector: c })
    }
    let name
    if (c.name.toLocaleLowerCase().includes('metamask')) {
      name = WalletTypes.WALLET_METAMASK
    }
    if (c.name.toLocaleLowerCase().includes('okx')) name = WalletTypes.WALLET_OKX_EVM
    setCurrentWallet(name)
    name && saveWalletToLocal(name)
    hanldeCloseConnectModal()
  }

  const connectBtcWallet = async (btcWallet: BtcConnectorName) => {
    const res = await connectBtc(btcWallet)
    if (btcWallet === 'OKX') {
      setCurrentWallet(WalletTypes.WALLET_OKX_BTC)
      saveWalletToLocal(WalletTypes.WALLET_OKX_BTC)
    }
    if (btcWallet === 'Unisat') {
      setCurrentWallet(WalletTypes.WALLET_UNISAT)
      saveWalletToLocal(WalletTypes.WALLET_UNISAT)
    }
    res && hanldeCloseConnectModal()
  }

  const getInstalledWallet = () => {
    if (typeof window === 'undefined') return;
    const installed = {
      ...installedMap
    }
    if (window.unisat) installed.unisat = true;
    if (window.ethereum) installed.metamask = true;
    if (window.okxwallet) {
      installed.okx_btc = true;
      installed.okx_evm = true
    }
    setInstalledMap(installed)
  }

  useEffect(() => {
    if (openConnectModal) {
      getInstalledWallet()
    }
  }, [openConnectModal])

  return (
    <Modal
      isOpen={openConnectModal}
      onRequestClose={hanldeCloseConnectModal}
      ariaHideApp={false}
      className="b2WalletModal"
      overlayClassName="overlay"
    >
      <ModalHeader hanldeCloseConnectModal={hanldeCloseConnectModal} />
      <div className="content">
        {
          showEth && <div>
            <SubTitle title="Ethereum Wallet" />
            {
              showEth && connectors.map(c => {
                const installed = getInstalled(c.name)
                return (
                  <div onClick={() => {
                    if (installed) {
                      handleClickEthWallet(c)
                    }
                  }} key={c.id}>
                    <WalletItem installed={installed} walletIcon={getImageUrl(c.name)} walletName={c.name} />
                  </div>
                )
              })
            }
          </div>
        }
        {
          showBtc && <div>
            <SubTitle title="Bitcoin Wallet" />
            {
              btcConnectors.sort((a, b) =>(b.name + '').localeCompare(a.name + '')).map(c => {
                const installed = getInstalled(c.name)
                return (
                  <div key={c.name}
                    onClick={() => {
                      if (installed) {
                        connectBtcWallet(c.name)
                      }
                    }}>
                    <WalletItem installed={installed} walletIcon={getImageUrl(c.name)} walletName={`${c.name} Wallet`} />
                  </div>
                )
              })
            }
          </div>
        }
      </div>
    </Modal>
  )
}

export {
  WalletModal
};
export * from './context'
