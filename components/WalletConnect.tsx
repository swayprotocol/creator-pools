import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { injected, walletconnect } from '../helpers/Connectors';
import { AbstractConnector } from '@web3-react/abstract-connector';

type WalletConnectProps = {
  userLoaded: boolean,
  loaded: boolean,
  setNewSigner: (signer) => any,
  loadUserData: (walletId: string, connector) => any,
}

export default function WalletConnect(props: WalletConnectProps) {
  const { account, error, library, activate, active, connector } = useWeb3React<Web3Provider>();

  const [tried, setTried] = useState(false);
  // first check if connected through Metamask
  useEffect(() => {
    if (!active && !error && props.loaded) {
      injected
        .isAuthorized()
        .then((isAuthorized) => {
          if (isAuthorized) {
            activateWallet(injected).then(() => setTried(true));
          } else {
            setTried(true);
          }
        })
        .catch(() => setTried(true))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.loaded]);

  // then check if connected through wallet connect
  useEffect(() => {
    if (window.localStorage.walletconnect && !active && tried && !error && props.loaded) {
      activateWallet(walletconnect);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tried]);


  // if connected through web3-react, load the library and user data
  useEffect(() => {
    if (active) {
      props.setNewSigner(library);
      // on reload, wallet might be connected, but user is not loaded, let's make sure we load the user as well
      if (!props.userLoaded) {
        props.loadUserData(account, connector);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  async function activateWallet(type: AbstractConnector) {
    await activate(type);
  }

  return null;
}


