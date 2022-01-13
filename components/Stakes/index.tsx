import React, { FC } from 'react';
import styles from './index.module.scss';
import { getWalletShorthand } from '../../helpers/getWalletShorthand';
import Item from './Item';
import { ModalType } from '../../shared/interfaces';

type StakesType = {
  openModal: ({ type: ModalType }) => any,
}

const Stakes: FC<StakesType> = (props: StakesType) => (
  <section className="stakes-section mb-4">
    <div className="container">

      <div className="row mb-4">
        <div className={styles.top}>
          <div className={styles.titleWrapper}>
            <h2 className="mb-0">Active stakes</h2>
            <div className={styles.networkItem}>
              <div className={`${styles.networkItemStatus} ${styles.active}`}/>
              <div className={styles.networkItemName}>
                connected to {getWalletShorthand('0x538Bdc460119Bb95F8ee51E46D22Eee5e7a6cC4e')}
              </div>
            </div>
          </div>
          <div className={styles.connectWrapper}>
            <div className={styles.swayAvailable}>
              <img src="assets/favicon.png" alt="Sway" height="20" width="20"/>
              <span>1,233,444</span>
            </div>
            <button className="btn" onClick={() => props.openModal({ type: ModalType.STAKE })}>
              Stake
            </button>
          </div>
        </div>
      </div>

      <div className="row">
        <div className={styles.activeStakes}>
          <div className={styles.table}>
            <div className={styles.tableHead}>
              <div className={styles.tableItem}>
                <div className={styles.mainText}>
                  Channel/ID
                </div>
              </div>
              <div className={styles.tableItem}>
                <div className={styles.mainText}>
                  Total staked
                </div>
              </div>
              <div className={styles.tableItem}>
                <div className={styles.mainText}>
                  Your stake
                </div>
              </div>
              <div className={styles.tableItem}>
                <div className={styles.mainText}>
                  APR
                </div>
              </div>
              <div className={styles.tableItem}>
                <div className={styles.mainText}>
                  Locked
                </div>
              </div>
              <div className={styles.tableItem}>
                <div className={styles.mainText}>
                  Farmed
                </div>
              </div>
            </div>
            {['', '', ''].map((_, i) => (
              <Item key={i} openModal={props.openModal}/>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Stakes;
