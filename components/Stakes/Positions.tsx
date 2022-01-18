import React, { FC } from 'react';
import styles from './Positions.module.scss';
import { Channel, ChannelPosition, ModalData, ModalType } from '../../shared/interfaces';

type ItemPositions = {
  openModal: (modalData: ModalData) => any
  positions: ChannelPosition[],
  swayUsd: number,
  swayUserTotal: number,
  channel: Channel,
}

const ItemPositions: FC<ItemPositions> = (props: ItemPositions) => {
  const [amountToStake, setAmountToStake] = React.useState('');

  const openStakeModal = () => {
    props.openModal({
      type: ModalType.ADD,
      channel: props.channel,
      amount: amountToStake
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
            <strong>#{position.indexInPool}</strong>
          </div>
          <div className={styles.tableItem}>
            <strong>{position.amount.toLocaleString('en-US', { maximumFractionDigits: 0 })} SWAY</strong>
          </div>
          <div className={styles.tableItem}>
            99%
          </div>
          <div className={styles.tableItem}>
            {/*<button className="btn btn-secondary" onClick={() => props.openModal({ type: ModalType.UNSTAKE })}>*/}
            {/*  Unstake*/}
            {/*</button>*/}
            {position.unlockTime.toISOString().split('T')[0]}
          </div>
          <div className={styles.tableItem}>
            <strong>{props.channel.farmed.toLocaleString('en-US', { maximumFractionDigits: 2 })}</strong>
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
          <strong>#{props.positions[props.positions.length - 1].indexInPool + 1}</strong>
        </div>
        <div className={`${styles.tableItem} ${styles.spacingInput}`}>
          <div className="extended-input">
            <input type="number"
                   placeholder="Amount"
                   value={amountToStake}
                   onChange={(e) => setAmountToStake(e.target.value)}/>
            <div className="after-element" onClick={() => setAmountToStake(props.swayUserTotal.toString())}>MAX</div>
          </div>
        </div>
        <div className={styles.tableItem}>
          <button className="btn" onClick={openStakeModal}>
            Stake
          </button>
        </div>
        <div className={styles.tableItem}>
          <a target="_blank" rel="noopener noreferrer" href="https://www.gate.io/trade/SWAY_USDT">
            Get SWAY
          </a>
        </div>
      </div>

    </div>
  )
};

export default ItemPositions;
