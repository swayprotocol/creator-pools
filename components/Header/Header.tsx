import React from 'react';
import styles from './Header.module.scss'

const Header = () => (
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

        <div className={`${styles.topSection} my-4`}>
          <div className="d-flex align-items-center">
            <h4 className="d-inline-block me-3 mb-0">Powered by</h4>
            <a href="https://swaysocial.org/" rel="noreferrer" target="_blank" title="Sway Social">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/logo.svg" height="40" width="140" alt="Sway Social"/>
            </a>
          </div>
          <div className="connect">
            <button className="btn" disabled={true}>
              Connect
            </button>
          </div>
        </div>

        <hr/>

      </div>
    </div>
  </section>
);

export default Header;
