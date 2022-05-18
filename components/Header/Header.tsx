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
        <div>

          <div className={`${styles.topSection} my-3`}>
            <div className="header-title">
              <h1 className="d-inline me-3">{site.heading}</h1>
              <span>{site.sub_heading}</span>
            </div>
            <div className="d-flex">
              {site.networks.map(network => (
                <div className={styles.networkItem} key={network.name}>
                  <div className={`${styles.networkItemStatus} ${network.active ? styles.active : ''}`}/>
                  <div className={styles.networkItemName}>{network.name}</div>
                </div>
              ))}
              {theme.hasAltTheme && (
                <div className={styles.themeButtonWrapper}>
                  <button className={styles.themeButton} onClick={() => setTheme(colorTheme)}>
                    <svg width="20" height="20" viewBox="0 0 512 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="m275.4 500.7c-135 0-244.7-109.8-244.7-244.7s109.8-244.7 244.7-244.7c8.2 0 16.4.4 24.6 1.2 7.2.7 13.5 5.2 16.5 11.7s2.4 14.2-1.6 20.2c-23 33.8-35.2 73.3-35.2 114.2 0 105 78.7 192.2 183.2 202.6 7.2.7 13.5 5.2 16.5 11.7 3.1 6.5 2.4 14.2-1.6 20.2-45.8 67.4-121.4 107.6-202.4 107.6zm-12.5-448c-106.5 6.5-191.2 95.2-191.2 203.3 0 112.3 91.4 203.7 203.7 203.7 56.4 0 109.6-23.4 147.8-63.7-46.2-11.7-88.1-36.8-120.8-72.6-41.1-45.2-63.8-103.6-63.8-164.6.1-37.1 8.4-73.2 24.3-106.1z"/>
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className={`${styles.topSection} my-1`}>
            {site.show_powered_by && (
              <div className="d-flex align-items-center">
                <h5 className="d-inline-block me-2 mb-0">Powered by</h5>
                <a href="https://swaysocial.org/" rel="noreferrer" target="_blank" title="Sway Social">
                  <img src="/assets/logo.svg" width="100" alt="Sway Social"/>
                </a>
              </div>
            )}
            <div className="connect ms-auto">
              {!active ? (
                <button className="btn" onClick={connectWallet}>
                  Connect
                </button>
              ) : (
                <button className="btn btn-secondary" onClick={async () => {
                  await deactivate();
                  props.disconnectWallet();
                }}>
                  {getWalletShorthand(account)}
                </button>
              )}
            </div>
          </div>

          <hr/>

        </div>
      </div>
    </section>
  );
};

export default Header;
