import React from 'react';
import styles from './Header.module.scss'
import { getWalletShorthand } from '../../helpers/getWalletShorthand';
import { AbstractConnector } from '@web3-react/abstract-connector';
import { injected } from '../../helpers/Connectors';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

type HeaderProps = {
  walletId: string,
  connectWallet: (connector?: AbstractConnector) => any
}

const Header = (props: HeaderProps) => {
  const { activate, deactivate } = useWeb3React<Web3Provider>();

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
            {!props.walletId ? (
              <div className="connect">
                <button className="btn" onClick={async () => {
                  await props.connectWallet(injected);
                  await activate(injected);
                }}>
                  Connect
                </button>
              </div>
            ) : (
              <div className="connect">
                <button className="btn btn-secondary" disabled={true} onClick={async () => {
                  await deactivate();
                }}>
                  {`${getWalletShorthand(props.walletId)}`}
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
