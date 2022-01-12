import React, { FC } from 'react';
import styles from './Item.module.scss'
import { StakedEvent } from '../../shared/interfaces';
import { getWalletShorthand } from '../../helpers/getWalletShorthand';

type Item = {
  index: number,
  item: StakedEvent
}

function renderSvg() {
  return (
    <svg fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg">
      <rect height="20" rx="5" ry="5" width="20" x="2" y="2"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.5" y1="6.5" y2="6.5"/>
    </svg>
  )
}

const Item: FC<Item> = (props: Item) => (
  <div className={styles.itemWrap}>
    <div className={styles.mainWrap}>
      <div className={styles.titleWrap}>
        <div className={`${styles.mainText} ${styles.alt}`}>#{props.index + 1}</div>
        <div>
          {renderSvg()}
        </div>
        <div className={styles.mainText}>{props.item.poolHandle}</div>
        {/*<div className={styles.mainText}>3/4</div>*/}
      </div>
      <div>
        {/*<div className={styles.mainText}>$3,499,323</div>*/}
      </div>
    </div>

    <div className={styles.mainWrap}>
      <div>
        {/*<div className={styles.subText}>8.58% of total 13,282,221</div>*/}
        <div className={styles.subText}>{getWalletShorthand(props.item.sender)}</div>
      </div>
      <div>
        <div className={styles.subText}>{props.item.amount.toLocaleString('en-US', {maximumFractionDigits: 0})} SWAY</div>
        <div className={styles.subText}>{props.item.date.toISOString().split('T')[0]}</div>
      </div>
    </div>

  </div>
);

export default Item;
