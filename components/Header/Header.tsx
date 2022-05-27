import React from 'react';
import styles from './Header.module.scss';
import { getWalletShorthand } from '../../helpers/getWalletShorthand';
import { AbstractConnector } from '@web3-react/abstract-connector';
import { injected } from '../../shared/constants';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import useDarkMode from '../../helpers/useDarkMode';
import { useConfig } from '../../contexts/Config';

type HeaderProps = {
  disconnectWallet: () => any
}

const Header = (props: HeaderProps) => {
  const { activate, deactivate, account, active } = useWeb3React<Web3Provider>();
  const [colorTheme, setTheme] = useDarkMode();
  const { site, theme } = useConfig();

  const tryActivation = async (connector: AbstractConnector) => {
    return await activate(connector, undefined, true)
      .then(() => true)
      .catch(async (err) => {
        if (err instanceof UnsupportedChainIdError) {
          try {
            // prompt user to switch to polygon network
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0x89' }],
            });
            return true;
          } catch (e: any) {
            if (e.code === 4902) {
              try {
                // if no polygon network, prompt user to add it
                await window.ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [{
                    chainId: '0x89', //0x89 or 137
                    chainName: 'Polygon Mainnet',
                    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
                    rpcUrls: ['https://polygon-rpc.com/'],
                    blockExplorerUrls: ['https://polygonscan.com/']
                  }]
                });
                return true;
              } catch (e) {
                return false;
              }
            }
          }
        }
        return false;
      });
  };

  async function connectWallet() {
    const isConnected = await tryActivation(injected);
    if (isConnected) {
      await activate(injected);
    }
  }

  return (
    <section className="mb-5">
      <div className="container">
        <div className="pt-5">
          <div className={"d-flex justify-content-between"}>

            <div className={"d-inline-block col-sm-8"}>
              <div className="header-title">
                <h1 className="d-inline d-flex py-3">{site.heading}</h1>
              </div>
            </div>

            <div className={"d-inline-flex col-sm-2 text-right"}>

              <div className="connect d-inline d-flex py-3">
                {!active ? (
                    <div>You need to <a className={"red-text"} id="text" onClick={connectWallet}> connect your wallet</a> to start staking.</div>
                ) : (
                    <div>Your wallet <a className={"red-text"} id="text" onClick={async () => {
                      await deactivate();
                      props.disconnectWallet();
                    }}> {getWalletShorthand(account)}</a> is connected.</div>
                    )}
              </div>
            </div>

        </div>
          <hr/>

        </div>
      </div>
    </section>
  );
};

export default Header;
