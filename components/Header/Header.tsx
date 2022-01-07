import React from 'react';
import Link from 'next/link';
import Image from 'next/image'
import styles from './Header.module.scss'

const Header = () => (
  <section className={styles.headerSection}>
    <div className="container">
      <div className="border-bottom">

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
            <Link href="/">
              <Image src="/assets/logo.svg" height="40" width="140" alt="Sway Social"/>
            </Link>
          </div>
          <div className="connect">
            <button className="btn btn-primary">
              Connect
            </button>
          </div>
        </div>

      </div>
    </div>
  </section>
);

export default Header;
