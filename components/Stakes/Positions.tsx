import React, { FC, useState } from 'react';
import Moment from 'react-moment';
import styles from './Positions.module.scss';
import { IChannel, IStake, ModalData, ModalType } from '../../shared/interfaces';

import { useConfig } from '../../contexts/Config';

type ItemPositions = {
  openModal: (modalData: ModalData) => any
  stakes: IStake[],
  tokenUsd: number[],
  tokenUserTotal: string[],
  channel: IChannel,
  contract: any,
  maxApyPlan: number[]
}

const ItemPositions: FC<ItemPositions> = (props: ItemPositions) => {
  const [amountToStake, setAmountToStake] = useState('');
  const { token1, token2 } = useConfig();

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

      {props.stakes.map((stake, i) => (
        <div className={styles.item} key={i}>
          <div className={styles.spacing}/>
          <div className={`${styles.tableItem} ${styles.textRight}`}>
            <strong>#{i + 1}</strong>
          </div>
          <div className={styles.tableItem}>
            <strong>{(stake.token === "0") ? stake.amount.toLocaleString('en-US', { maximumFractionDigits: 0 }) : stake.amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              &nbsp; {(stake.token === "0") ? token1.ticker : token2.ticker}</strong>
          </div>
          <div className={styles.tableItem}>
            {(stake.token === "0") ? props.maxApyPlan[0] : props.maxApyPlan[1]}%
          </div>
          <div className={styles.tableItem}>
            Staked
          </div>
          <div className={styles.tableItem}>
            <strong>{stake.farmed.toLocaleString('en-US', { maximumFractionDigits: 2 })} {token1.ticker}</strong>
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
            <div className="after-element" onClick={() => setAmountToStake(props.tokenUserTotal[0])}>MAX</div>
          </div>
        </div>
        <div className={styles.tableItem}>
          <button className="btn" onClick={() => openStakeModal(ModalType.ADD, amountToStake)}>
            Stake
          </button>
        </div>
        <div className={styles.tableItem}>
          {(props.channel.walletFarmed) ? (
              <button className="btn btn-secondary" onClick={() => openStakeModal(ModalType.CLAIM, props.channel.walletFarmed.toString())}>
                Claim
              </button>
          ) : (
              <a target="_blank" rel="noopener noreferrer" href={token1.exchange_url}>
                Get {token1.ticker}
              </a>
              )}
        </div>
      </div>

    </div>
  )
};

export default ItemPositions;
