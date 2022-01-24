import React from 'react';
import styles from './Header.module.scss'
import { getWalletShorthand } from '../../helpers/getWalletShorthand';
import { AbstractConnector } from '@web3-react/abstract-connector';
import { injected } from '../../shared/constants';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

type HeaderProps = {
  disconnectWallet: () => any
}

const Header = (props: HeaderProps) => {
  const { activate, deactivate, account, active } = useWeb3React<Web3Provider>();

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
                  params: [{  chainId: '0x89', //0x89 or 137
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
      })
  }

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
              <h1 className="d-inline me-3">Creator Pools</h1>
              <span>v0.1 Beta</span>
            </div>
            <div className="d-flex">
              <div className={styles.networkItem}>
                <div className={`${styles.networkItemStatus} ${styles.active}`}/>
                <div className={styles.networkItemName}>Polygon</div>
              </div>
              <div className={styles.networkItem}>
                <div className={styles.networkItemStatus}/>
                <div className={styles.networkItemName}>BSC</div>
              </div>
              <div className={styles.networkItem}>
                <div className={styles.networkItemStatus}/>
                <div className={styles.networkItemName}>Polkadot</div>
              </div>
            </div>
          </div>

          <div className={`${styles.topSection} my-1`}>
            <div className="d-flex align-items-center">
              <h5 className="d-inline-block me-2 mb-0">Powered by</h5>
              <a href="https://swaysocial.org/" rel="noreferrer" target="_blank" title="Sway Social">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/logo.svg" width="100" alt="Sway Social"/>
              </a>
            </div>
            {!active ? (
              <div className="connect">
                <button className="btn" onClick={connectWallet}>
                  Connect
                </button>
              </div>
            ) : (
              <div className="connect">
                <button className="btn btn-secondary" onClick={async () => {
                  await deactivate();
                  props.disconnectWallet();
                }}>
                  {getWalletShorthand(account)}
                </button>
              </div>
            )}
          </div>

          <hr/>

        </div>
      </div>
    </section>
  )
};

export default Header;
