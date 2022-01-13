import Link from 'next/link';
import React, { FC } from 'react';
import styles from './Positions.module.scss';

type ItemPositions = {
  index?: number,
  item?: string,
  swayUsd?: number,
  type?: string
}

const ItemPositions: FC<ItemPositions> = (props: ItemPositions) => {
  return (
    <div className={styles.positionWrapper}>

      <div className={styles.item}>
        <div className={styles.spacing}/>
        <div className={`${styles.tableItem} ${styles.tableHeading}`}>
          <strong>Positions</strong>
        </div>
      </div>

      <div className={styles.item}>
        <div className={styles.spacing}/>
        <div className={`${styles.tableItem} ${styles.textRight}`}>
          <strong>#1</strong>
        </div>
        <div className={styles.tableItem}>
          <strong>2,183,293 SWAY</strong>
          <div>7,588 USD</div>
        </div>
        <div className={styles.tableItem}>
          99%
        </div>
        <div className={styles.tableItem}>
          <button className="btn btn-secondary">
            Unstake
          </button>
        </div>
        <div className={styles.tableItem}>
          <strong>3,299,291</strong>
        </div>
      </div>

      <div className={styles.item}>
        <div className={styles.spacing}/>
        <div className={`${styles.tableItem} ${styles.tableHeading}`}>
          <strong>Stake more</strong>
        </div>
      </div>

      <div className={styles.item}>
        <div className={styles.spacing}/>
        <div className={`${styles.tableItem} ${styles.textRight}`}>
          <strong>#889</strong>
        </div>
        <div className={styles.tableItem}>
          <strong>2,183,293 SWAY</strong>
          <div>7,588 USD</div>
        </div>
        <div className={styles.tableItem}>
          99%
        </div>
        <div className={styles.tableItem}>
          <button className="btn">
            Stake
          </button>
        </div>
        <div className={styles.tableItem}>
          <Link href="https://www.gate.io/trade/SWAY_USDT">
            Get SWAY
          </Link>
        </div>
      </div>

    </div>
  )
};

export default ItemPositions;
