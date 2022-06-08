import React, { FC } from 'react';
import styles from './Item.module.scss';
import { IStake, ModalData, ModalType, PoolItemType } from '../../shared/interfaces';
import { getWalletShorthand } from '../../helpers/getWalletShorthand';
import { getSocialIcon } from '../../helpers/getSocialIcon';
import { useConfig } from '../../contexts/Config';

type Item = {
  index: number,
  item: IStake,
  tokenUsd: number[],
  type: PoolItemType,
  openModal: (modalData: ModalData) => any,
}

const Item: FC<Item> = (props: Item) => {
  const { token1, token2 } = useConfig();
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
            {(props.type === PoolItemType.TOP ) && (
                <div className={styles.mainText}>${(props.item.token == "0") ? (props.item.amount * props.tokenUsd[0]).toLocaleString('en-US', { maximumFractionDigits: 0 }) :
                    ((props.item.tokens[0].totalAmount * props.tokenUsd[0]) + (props.item.tokens[1].totalAmount * props.tokenUsd[1])).toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
            )}
            {(props.type === PoolItemType.LATEST || props.type === PoolItemType.INDIVIDUAL) && (
                <div className={styles.mainText}>${(props.item.token == "0") ? (props.item.amount * props.tokenUsd[0]).toLocaleString('en-US', { maximumFractionDigits: 0 }) :
                    (props.item.amount * props.tokenUsd[1]).toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
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
            {(props.type === PoolItemType.LATEST || props.type === PoolItemType.INDIVIDUAL) && (
                <div className={styles.subText}>{(props.item.token === "0") ? props.item.amount.toLocaleString('en-US', { maximumFractionDigits: 0 }) : props.item.amount.toLocaleString('en-US', { maximumFractionDigits: 0 })} {(props.item.token === "0") ? token1.ticker : token2.ticker}</div>
            )}
            {(props.type === PoolItemType.TOP ) && (
                <div className={styles.subText}>{props.item.tokens[0].totalAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })} { token1.ticker}</div>
            )}
            {(props.type === PoolItemType.TOP ) && (
                <div className={styles.subText}>{props.item.tokens[1].totalAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })} { token2.ticker}</div>            )}
          </div>
        </div>
      </div>
  );
};

export default Item;