import React, { FC, useState } from 'react';
import Moment from 'react-moment';
import styles from './Positions.module.scss';
import { IChannel, IStake, ModalData, ModalType } from '../../shared/interfaces';
import { useConfig } from '../../contexts/Config';

type ItemPositions = {
  openModal: (modalData: ModalData) => any
  stakes: IStake[],
  tokenUsd: number,
  tokenUserTotal: string,
  channel: IChannel,
  contract: any
}

const ItemPositions: FC<ItemPositions> = (props: ItemPositions) => {
  const [amountToStake, setAmountToStake] = useState('');
  const { token } = useConfig();

  const openStakeModal = (type: ModalType, amount: string) => {
    props.openModal({
      type: type,
      channel: props.channel,
      amount: amount
    })
  }

  const apy = (stake: IStake) => {
    if (stake.plan?.apy) return stake.plan.apy
    return props.channel.walletAverageAPY
  }

  const farmed = (stake: IStake) => {
    if (stake.farmed) return stake.farmed
    return (props.channel.walletFarmed * stake.amount) / props.channel.walletTotalAmount
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
            <strong>{stake.amount.toLocaleString('en-US', { maximumFractionDigits: 0 })} {token.ticker}</strong>
          </div>
          <div className={styles.tableItem}>
            {apy(stake).toLocaleString('en-US', { maximumFractionDigits: 1 })}%
          </div>
          <div className={styles.tableItem}>
            {+new Date(stake.stakedUntil) < +new Date() ? (
              <button className="btn btn-secondary" onClick={() => openStakeModal(ModalType.UNSTAKE, '')}>
                Unstake
              </button>
            ) : (
              <Moment to={stake.stakedUntil} withTitle titleFormat="D MMM YYYY hh:mm:ss"/>
            )}
          </div>
          <div className={styles.tableItem}>
            <strong>{farmed(stake).toLocaleString('en-US', { maximumFractionDigits: 2 })}</strong>
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
            <div className="after-element" onClick={() => setAmountToStake(props.tokenUserTotal)}>MAX</div>
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
            <a target="_blank" rel="noopener noreferrer" href={token.exchange_url}>
              Get {token.ticker}
            </a>
          )}
        </div>
      </div>

    </div>
  )
};

export default ItemPositions;
