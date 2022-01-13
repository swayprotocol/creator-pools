import React, { FC } from 'react';
import styles from './Item.module.scss';
import { PoolItemType, StakedEvent } from '../../shared/interfaces';
import { getWalletShorthand } from '../../helpers/getWalletShorthand';
import { getSocialIcon } from '../../helpers/getSocialIcon';

type Item = {
  index: number,
  item: StakedEvent,
  swayUsd: number,
  type: PoolItemType
}

const Item: FC<Item> = (props: Item) => (
  <div className={styles.itemWrap}>
    <div className={styles.mainWrap}>
      <div className={styles.titleWrap}>
        {(props.type === PoolItemType.TOP || props.type === PoolItemType.INDIVIDUAL) && (
          <div className={`${styles.mainText} ${styles.alt}`}>#{props.index + 1}</div>
        )}
        <div>
          {getSocialIcon(props.item.social)}
        </div>
        <div className={styles.mainText}>{props.item.poolHandle}</div>
        {/*<div className={styles.mainText}>3/4</div>*/}
      </div>
      <div>
        {(props.type === PoolItemType.LATEST || props.type === PoolItemType.INDIVIDUAL) && (
          <div className={styles.mainText}>{props.item.amount.toLocaleString('en-US', {maximumFractionDigits: 0})}</div>
        )}
        {props.type === PoolItemType.TOP && (
          <div className={styles.mainText}>${(props.item.amount * props.swayUsd).toLocaleString('en-US', {maximumFractionDigits: 0})}</div>
        )}
      </div>
    </div>

    <div className={styles.mainWrap}>
      <div>
        {/*<div className={styles.subText}>8.58% of total 13,282,221</div>*/}
        <div className={styles.subText}>{getWalletShorthand(props.item.sender)}</div>
      </div>
      <div>
        {props.type === PoolItemType.TOP && (
          <div className={styles.subText}>{props.item.amount.toLocaleString('en-US', {maximumFractionDigits: 0})} SWAY</div>
        )}
        {props.type === PoolItemType.LATEST && (
          <div className={styles.subText}>{props.item.date.toISOString().split('T')[0]}</div>
        )}
      </div>
    </div>

  </div>
);

export default Item;
