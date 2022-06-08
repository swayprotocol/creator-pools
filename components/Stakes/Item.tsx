import React, { FC, useState } from 'react';
import styles from './Item.module.scss';
import { getSocialIcon } from '../../helpers/getSocialIcon';
import {IChannel, ModalData, ModalType} from '../../shared/interfaces';
import ItemPositions from './Positions';
import { getWalletShorthand } from '../../helpers/getWalletShorthand';
import { useConfig } from '../../contexts/Config';

type StakedItem = {
  openModal: (modalData: ModalData) => any,
  channel: IChannel,
  tokenUsd: number[],
  tokenUserTotal: string[],
  contract: any,
  maxApyPlan: number[]
}

const StakedItem: FC<StakedItem> = (props: StakedItem) => {
  const [isExpanded, setExpanded] = useState(false);
  const { token1 } = useConfig();

  const openStakeModal = (type: ModalType, amount: string) => {
    props.openModal({
      type: type,
      channel: props.channel,
      amount: amount
    })
  }
  return (
      <div className={`${styles.itemWrapper} ${isExpanded ? styles.itemWrapperActive : ''}`}>
        <div className={styles.item} onClick={() => setExpanded((prevState => !prevState))}>
          <div className={styles.itemIcon}>▶</div>
          <div className={styles.tableItem}>
            <div className="d-flex">
              <div className={styles.icon}>{getSocialIcon(props.channel.social)}</div>
              <strong>
                {getWalletShorthand(props.channel.poolHandle)}
              </strong>
            </div>
          </div>
          <div className={styles.tableItem}>
            <strong>{(props.channel.token0.totalAmount + props.channel.token1.totalAmount).toLocaleString('en-US', { maximumFractionDigits: 0 })}</strong>
          </div>
          <div className={styles.tableItem}>
            <strong>{(props.channel.token0.walletTotalAmount + props.channel.token1.walletTotalAmount).toLocaleString('en-US', { maximumFractionDigits: 0 })}</strong>
            <div>{(props.channel.token0.totalAmount * props.tokenUsd[0] + props.channel.token1.totalAmount * props.tokenUsd[1]).toLocaleString('en-US', { maximumFractionDigits: 0 })} USD</div>
          </div>
          <div className={styles.tableItem}>
            {(props.channel.token0.averageAPY).toLocaleString('en-US', { maximumFractionDigits: 1 })}%
          </div>
          <div className={styles.tableItem}>
            <button className="btn btn-secondary" onClick={() => openStakeModal(ModalType.UNSTAKE, '')}>
              Unstake
            </button>

          </div>
          <div className={styles.tableItem}>
            <strong>{(props.channel.token0.walletFarmed + props.channel.token1.walletFarmed).toLocaleString('en-US', { maximumFractionDigits: 2 })} {token1.ticker}</strong>
          </div>
        </div>

        {isExpanded && (
            <ItemPositions openModal={props.openModal}
                           stakes={props.channel.stakes}
                           tokenUsd={props.tokenUsd}
                           tokenUserTotal={props.tokenUserTotal}
                           channel={props.channel}
                           contract={props.contract}
                           maxApyPlan={props.maxApyPlan}
            />
        )}
      </div>
  )
};

export default StakedItem;