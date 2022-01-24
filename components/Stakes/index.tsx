import React, { FC, useEffect, useState } from 'react';
import styles from './index.module.scss';
import { getWalletShorthand } from '../../helpers/getWalletShorthand';
import Item from './Item';
import { Channel, ChannelPosition, ModalData, ModalType, Plan, StakedEventSocialType } from '../../shared/interfaces';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

type StakesType = {
  openModal: (modalData: ModalData) => any,
  contract: any,
  swayUsd: number,
  swayUserTotal: number,
  refreshData: number,
  plans: Plan[]
}

const initialChannels: Channel[] = [];

const Stakes: FC<StakesType> = (props: StakesType) => {
  const [channels, setChannels] = useState(initialChannels);

  const { account } = useWeb3React<Web3Provider>();

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.contract, props.refreshData, account]);

  useEffect(() => {
    if (props.plans.length) {
      calculateAPY();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.plans]);

  async function loadData() {
    const activeChannels: any[] = await props.contract.getUserQueue(account);
    const allPoolHandles = activeChannels.map(channel => channel.poolHandle).filter(name => !!name);
    let poolsData: any[] = [];
    if (allPoolHandles.length) {
      // @ts-ignore
      const uniquePoolHandles = [...new Set(allPoolHandles)];
      poolsData = await props.contract.getMultiplePools(uniquePoolHandles);
      poolsData = poolsData.map((pool, i) => ({ ...pool, poolHandle: uniquePoolHandles[i] }));
    }

    formatData(activeChannels, poolsData);
  }

  function formatData(activeChannels: any[], poolsData: any[]) {
    const formatChannels: ChannelPosition[] = activeChannels.map((channel) => {
      const socialIcon = channel.poolHandle.split('-')[0] === 'ig' ? StakedEventSocialType.IG : StakedEventSocialType.TT;
      const stakedAtDate = new Date(+ethers.utils.formatUnits(channel.stakedAt, 0) * 1000);
      const unlockTimeDate = new Date(+ethers.utils.formatUnits(channel.unlockTime, 0) * 1000);
      const amount = +ethers.utils.formatEther(channel.amount);
      return {
        amount: amount,
        indexInPool: +ethers.utils.formatUnits(channel.indexInPool, 0),
        planId: channel.planId,
        plan: { apy: 0 } as Plan,
        poolHandle: channel.poolHandle,
        social: socialIcon,
        stakedAt: stakedAtDate,
        unlockTime: unlockTimeDate,
        farmed: 0
      };
    });

    let channels: Channel[] = {} as Channel[];
    formatChannels.forEach((position: ChannelPosition) => {
      if (!position.poolHandle) return; // claimed positions return poolHandle: '', let's filter them out
      const poolDataId = poolsData.findIndex(pool => pool.poolHandle === position.poolHandle);
      channels[position.poolHandle] = {
        userTotalAmount: channels[position.poolHandle]?.userTotalAmount + position.amount || position.amount,
        poolHandle: position.poolHandle.split('-')[1],
        social: position.social,
        totalFarmed: 0,
        positions: [...channels[position.poolHandle]?.positions || [], position],
        averageAPR: 0,
        // data from poolsData
        creator: poolsData[poolDataId]?.creator || '',
        members: +ethers.utils.formatUnits(poolsData[poolDataId]?.members || 1, 0),
        numberOfStakes: +ethers.utils.formatUnits(poolsData[poolDataId]?.numberOfStakes || 1, 0),
        totalAmount: +ethers.utils.formatEther(poolsData[poolDataId]?.totalAmount || 0)
      };
    });

    channels = Object.values(channels);
    setChannels(channels);
  }

  function calculateAPY() {
    let updatedChannels = channels.map(channel => ({
      ...channel,
      positions: channel.positions.map(position => ({
        ...position,
        plan: getPlanById(position.planId),
        farmed: getFarmedAmount(position.amount, position.stakedAt, position.unlockTime, position.planId)
      })),
      averageAPR: calculateAverageAPR(channel.positions)
    }));

    updatedChannels = updatedChannels.map(channel => ({
      ...channel,
      totalFarmed: channel.positions.map(position => position.farmed).reduce((a, b) => a + b, 0),
    }));

    setChannels(updatedChannels);
  }

  const getFarmedAmount = (amount: number, stakedAt: Date, unlockTime: Date, planId: number): number => {
    const plan = getPlanById(planId);
    // use new Date() until the staking is over
    const maxDate = +unlockTime < +new Date() ? unlockTime : new Date();
    return ((+maxDate - +stakedAt) / 1000 / 3600 / 24 / 365 * plan.apy / 100) * amount;
  }

  const getPlanById = (id: number): Plan => {
    return props.plans.find(plan => plan.planId === id);
  }

  const calculateAverageAPR = (positions: ChannelPosition[]): number => {
    // avgApr = (stake1size * apr1 + stake2size * apr2) / (stake1size + stake2size);
    const averageAPR = positions.map(position => (position.amount * getPlanById(position.planId).apy)).reduce((a, b) => a + b, 0) /
      positions.map(position => position.amount).reduce((a, b) => a + b, 0);

    return Math.round(averageAPR * 100) / 100;
  }

  return (
    <section className="stakes-section mb-4">
      <div className="container">

        <div className="row mb-4">
          <div className={styles.top}>
            <div className={styles.titleWrapper}>
              <h2 className="mb-0">Active stakes</h2>
              <div className={styles.networkItem}>
                <div className={`${styles.networkItemStatus} ${styles.active}`}/>
                <div className={styles.networkItemName}>
                  connected to {getWalletShorthand(account)}
                </div>
              </div>
            </div>
            <div className={styles.connectWrapper}>
              <div className={styles.swayAvailable}>
                <img src="assets/favicon.png" alt="Sway" height="20" width="20"/>
                <span>{props.swayUserTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <button className="btn" onClick={() => props.openModal({ type: ModalType.STAKE })}>
                Stake
              </button>
            </div>
          </div>
        </div>

        <div className="row">
          <div className={styles.activeStakes}>
            <div className={styles.table}>
              <div className={styles.tableHead}>
                <div className={styles.tableItem}>
                  <div className={styles.mainText}>
                    Channel/ID
                  </div>
                </div>
                <div className={styles.tableItem}>
                  <div className={styles.mainText}>
                    Total staked
                  </div>
                </div>
                <div className={styles.tableItem}>
                  <div className={styles.mainText}>
                    Your stake
                  </div>
                </div>
                <div className={styles.tableItem}>
                  <div className={styles.mainText}>
                    APR
                  </div>
                </div>
                <div className={styles.tableItem}>
                  <div className={styles.mainText}>
                    Locked
                  </div>
                </div>
                <div className={styles.tableItem}>
                  <div className={styles.mainText}>
                    Farmed
                  </div>
                </div>
              </div>
              {channels.length ? channels.map((channelItem, i) => (
                <Item key={i}
                      openModal={props.openModal}
                      channel={channelItem}
                      swayUsd={props.swayUsd}
                      swayUserTotal={props.swayUserTotal}
                />
              )) : (
                <div className={styles.inactive}>
                  <p className="mb-2">No active positions yet. <a className="btn-link" onClick={() => props.openModal({ type: ModalType.STAKE })}>Click here</a> to get started.</p>
                  <p className="mb-4">You will need SWAY to get started. <a target="_blank" rel="noopener noreferrer" href="https://quickswap.exchange/#/swap?outputCurrency=0x262b8aa7542004f023b0eb02bc6b96350a02b728">Get it now</a>.</p>
                  <p className="mb-0">Don’t know where to stake? Stake with <a className="btn-link" onClick={() => props.openModal({ type: ModalType.STAKE, channel: { poolHandle: 'cloutdotart'} })}>cloutdotart</a>.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stakes;
