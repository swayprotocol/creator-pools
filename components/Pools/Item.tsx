import React, { FC } from 'react';
import styles from './Item.module.scss';
import { IStake, ModalData, ModalType, PoolItemType } from '../../shared/interfaces';
import { getWalletShorthand } from '../../helpers/getWalletShorthand';
import { getSocialIcon } from '../../helpers/getSocialIcon';
import Moment from 'react-moment';
import { useConfig } from '../../contexts/Config';

type Item = {
  index: number,
  item: IStake,
  tokenUsd: number,
  type: PoolItemType,
  openModal: (modalData: ModalData) => any,
}

const Item: FC<Item> = (props: Item) => {
  const { token } = useConfig();

  return (
    <div className={styles.itemWrap}>
      <div className={styles.mainWrap}>
        <div className={styles.titleWrap}>
          {(props.type === PoolItemType.TOP || props.type === PoolItemType.INDIVIDUAL) && (
            <div className={`${styles.mainText} ${styles.alt}`}>#{props.index + 1}</div>
          )}
          <div className={`${styles.innerTitleWrap} ${styles.clickable}`}
               onClick={() => props.openModal({ type: ModalType.STAKE, channel: { poolHandle: props.item.pool.poolHandle, social: props.item.pool.social } })}>
            <div className={styles.socialIcon}>
              {getSocialIcon(props.item.pool.social)}
            </div>
            <div className={styles.mainText}>
              {props.item.pool.creator.length > 30 ? getWalletShorthand(props.item.pool.poolHandle) : props.item.pool.poolHandle}
            </div>
            {/*<div className={styles.mainText}>3/4</div>*/}
          </div>
        </div>
        <div>
          {(props.type === PoolItemType.LATEST || props.type === PoolItemType.INDIVIDUAL) && (
            <div className={styles.mainText}>{props.item.amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
          )}
          {props.type === PoolItemType.TOP && (
            <div className={styles.mainText}>${(props.item.amount * props.tokenUsd).toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
          )}
        </div>
      </div>

      <div className={styles.mainWrap}>
        <div>
          {/*<div className={styles.subText}>8.58% of total 13,282,221</div>*/}
          {(props.type === PoolItemType.LATEST || props.type === PoolItemType.INDIVIDUAL) && (
            <div className={styles.subText}>{getWalletShorthand(props.item.wallet)}</div>
          )}
        </div>
        <div>
          {props.type === PoolItemType.TOP && (
            <div className={styles.subText}>{props.item.amount.toLocaleString('en-US', { maximumFractionDigits: 0 })} {token.ticker}</div>
          )}
          {props.type === PoolItemType.LATEST && (
            <div className={styles.subText}>
              <Moment date={props.item.stakedAt} fromNow></Moment>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Item;
