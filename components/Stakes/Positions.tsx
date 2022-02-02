import React, { FC, useState } from 'react';
import styles from './Positions.module.scss';
import { Channel, ChannelPosition, ModalData, ModalType } from '../../shared/interfaces';
import Moment from 'react-moment';

type ItemPositions = {
  openModal: (modalData: ModalData) => any
  positions: ChannelPosition[],
  swayUsd: number,
  swayUserTotal: string,
  channel: Channel,
}

const ItemPositions: FC<ItemPositions> = (props: ItemPositions) => {
  const [amountToStake, setAmountToStake] = useState('');

  const openStakeModal = (type: ModalType, amount: string) => {
    props.openModal({
      type: type,
      channel: props.channel,
      amount: amount
    })
  }

  return (
    <div className={styles.positionWrapper}>

      <div className={styles.item}>
        <div className={styles.spacing}/>
        <div className={`${styles.tableItem} ${styles.tableHeading}`}>
          <strong>Positions</strong>
        </div>
      </div>

      {props.positions.map((position, i) => (
        <div className={styles.item} key={i}>
          <div className={styles.spacing}/>
          <div className={`${styles.tableItem} ${styles.textRight}`}>
            <strong>#{position.indexInPool + 1}</strong>
          </div>
          <div className={styles.tableItem}>
            <strong>{position.amount.toLocaleString('en-US', { maximumFractionDigits: 0 })} SWAY</strong>
          </div>
          <div className={styles.tableItem}>
            {position.plan.apy}%
          </div>
          <div className={styles.tableItem}>
            {+position.unlockTime < +new Date() ? (
              <button className="btn btn-secondary" onClick={() => openStakeModal(ModalType.UNSTAKE, '')}>
                Unstake
              </button>
            ) : (
              <Moment to={position.unlockTime} withTitle titleFormat="D MMM YYYY hh:mm:ss"/>
            )}
          </div>
          <div className={styles.tableItem}>
            <strong>{position.farmed.toLocaleString('en-US', { maximumFractionDigits: 2 })}</strong>
          </div>
        </div>
      ))}

      <div className={styles.item}>
        <div className={styles.spacing}/>
        <div className={`${styles.tableItem} ${styles.tableHeading}`}>
          <strong>Stake more</strong>
        </div>
      </div>

      <div className={styles.item}>
        <div className={styles.spacing}/>
        <div className={`${styles.tableItem} ${styles.textRight}`}>
          <strong>#{props.channel.numberOfStakes + 1}</strong>
        </div>
        <div className={`${styles.tableItem} ${styles.spacingInput}`}>
          <div className="extended-input">
            <input type="number"
                   placeholder="Amount"
                   min={1}
                   step={0.000000000000000001}
                   value={amountToStake}
                   onChange={(e) => setAmountToStake(e.target.value)}/>
            <div className="after-element" onClick={() => setAmountToStake(props.swayUserTotal)}>MAX</div>
          </div>
        </div>
        <div className={styles.tableItem}>
          <button className="btn" onClick={() => openStakeModal(ModalType.ADD, amountToStake)}>
            Stake
          </button>
        </div>
        <div className={styles.tableItem}>
          <button className="btn btn-secondary" onClick={() => openStakeModal(ModalType.CLAIM, '')}>
            Claim
          </button>
        </div>
      </div>

    </div>
  )
};

export default ItemPositions;
