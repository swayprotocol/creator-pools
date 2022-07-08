import React, { FC, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import Moment from 'react-moment';
import moment from 'moment';
import styles from './Positions.module.scss';
import { Channel, ChannelPosition, ModalData, ModalType } from '../../shared/interfaces';
import { setSocialPrefix } from '../../helpers/getSocialType';
import { useConfig } from '../../contexts/Config';

type ItemPositions = {
  openModal: (modalData: ModalData) => any
  positions: ChannelPosition[],
  tokenUsd: number,
  tokenUserTotal: string,
  channel: Channel,
  contract: any
}

const ItemPositions: FC<ItemPositions> = (props: ItemPositions) => {
  const [amountToStake, setAmountToStake] = useState('');
  const [reward, setReward] = useState(0);
  const [nextClaim, setNextClaim] = useState<Date>();

  const { account } = useWeb3React<Web3Provider>();
  const { token } = useConfig();

  useEffect(() => {
    const longPoolhandle = setSocialPrefix(props.channel.poolHandle, props.channel.social);
    calculateReward(longPoolhandle);
    calculateNextClaim()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const openStakeModal = (type: ModalType, amount: string) => {
    props.openModal({
      type: type,
      channel: props.channel,
      amount: amount
    })
  }

  const calculateReward = async (poolHandle) => {
    try {
      const rewardBigNumber = await props.contract.calculateReward(poolHandle,account)
      const reward = ethers.utils.formatEther(rewardBigNumber);
      setReward(parseFloat(reward));
    } catch (error) {
      console.error(error);
    }
  }

  const calculateNextClaim = async () => {
    // Claimed set to last stake date + 30 days
    const latest = props.positions.reduce((a,b) => +a.stakedAt > +b.stakedAt ? a : b)
    const unlockDate = moment(latest.stakedAt).add(30,'days').toDate()
    setNextClaim(unlockDate)
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
            <strong>{position.amount.toLocaleString('en-US', { maximumFractionDigits: 0 })} {token.ticker}</strong>
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
            <div className="after-element" onClick={() => setAmountToStake(props.tokenUserTotal)}>MAX</div>
          </div>
        </div>
        <div className={styles.tableItem}>
          <button className="btn" onClick={() => openStakeModal(ModalType.ADD, amountToStake)}>
            Stake
          </button>
        </div>
        <div className={styles.tableItem}>
          {(reward !== 0) ? (
              <button className="btn btn-secondary" onClick={() => openStakeModal(ModalType.CLAIM, reward.toString())}>
                Claim
              </button>
            ) : (
              <div className={styles.spacingTop}>
                <span>Next claim:</span> 
                <p><strong><Moment to={nextClaim} withTitle titleFormat="D MMM hh:mm:ss"/></strong></p>
              </div>
          )}
        </div>
      </div>

    </div>
  )
};

export default ItemPositions;
