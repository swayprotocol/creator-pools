import { useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { InjectedConnector } from '@web3-react/injected-connector';
import { AbstractConnector } from '@web3-react/abstract-connector';
import { useConfig } from '../contexts/Config';

type WalletConnectProps = {
  appLoaded: boolean,
  loadWallet: (connector: AbstractConnector, library: Web3Provider) => any
}

export default function WalletConnect(props: WalletConnectProps) {
  const { error, library, activate, active, connector } = useWeb3React<Web3Provider>();
  const { network } = useConfig();

  // first check if connected through Metamask
  useEffect(() => {
    if (!active && !error && props.appLoaded) {
      const injected = new InjectedConnector({ supportedChainIds: network.supported_chain_ids });
      injected
        .isAuthorized()
        .then((isAuthorized) => {
          if (isAuthorized) {
            activateWallet(injected);
          }
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.appLoaded]);

  // if connected through web3-react, load the library
  useEffect(() => {
    if (active) {
      props.loadWallet(connector, library);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  async function activateWallet(type: AbstractConnector) {
    await activate(type);
  }

  return null;
}


