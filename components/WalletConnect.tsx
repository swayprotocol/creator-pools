import { useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { injected } from '../shared/constants';
import { AbstractConnector } from '@web3-react/abstract-connector';

type WalletConnectProps = {
  appLoaded: boolean,
  loadWallet: (connector: AbstractConnector, library: Web3Provider) => any
}

export default function WalletConnect(props: WalletConnectProps) {
  const { error, library, activate, active, connector } = useWeb3React<Web3Provider>();

  // first check if connected through Metamask
  useEffect(() => {
    if (!active && !error && props.appLoaded) {
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


