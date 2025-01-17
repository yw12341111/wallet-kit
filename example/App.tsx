import React from 'react';
import { B2ModalProvider } from '../src';
import { WagmiConfig, WindowProvider, configureChains, createConfig } from 'wagmi';
// import { b2test } from '@b2network/b2-wallet-connector';
import { publicProvider } from "wagmi/providers/public";
import { MetaMaskConnector } from "@wagmi/core/connectors/metaMask";
import { InjectedConnector } from "@wagmi/core/connectors/injected";
import { B2BtcProvider } from '../src/btcWallet';
import Example from './Example';
import { b2TestHaven } from '../src/utils/chain';
import { UnisatConnector } from '../src/btcWallet/connectors/Unisat';
import { XverseConnector } from '../src/btcWallet/connectors/Xverse';
import { OkxConnector } from '../src/btcWallet/connectors/Okx';

const { chains, publicClient } = configureChains(
  [b2TestHaven],
  [publicProvider()]
);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new InjectedConnector({
      chains,
      options: {
        name: 'OKX Wallet',
        getProvider: () => {
          if (typeof window !== "undefined") { 
            return window.okxwallet as WindowProvider
          }
        }
      }
    })
  ],
  publicClient,
});

function App() {
  return (
    <WagmiConfig config={wagmiConfig}>
      <B2BtcProvider connectors={[new OkxConnector(),new UnisatConnector()]}>
        <B2ModalProvider isAutoConnect={true}>
          <Example />
        </B2ModalProvider>
      </B2BtcProvider>
    </WagmiConfig>
  );
}

export default App;
