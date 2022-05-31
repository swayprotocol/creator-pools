import React, { FC, useEffect, useState } from 'react';
import styles from './index.module.scss';
import { getWalletShorthand } from '../../helpers/getWalletShorthand';
import Item from './Item';
import { Channel, ChannelPosition, ModalData, ModalType } from '../../shared/interfaces';
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { getFarmedAmount } from '../../helpers/getFarmedAmount';
import { getPlanById } from '../../helpers/getPlanById';
import { getSocialType } from '../../helpers/getSocialType';
import { useConfig } from '../../contexts/Config';

type StakesType = {
  openModal: (modalData: ModalData) => any,
  contract: any,
  tokenUsd: number[],
  tokenUserTotal: string[],
  refreshData: number
}

const Stakes: FC<StakesType> = (props: StakesType) => {
  const [channels, setChannels] = useState<Channel[]>([]);

  const { account } = useWeb3React<Web3Provider>();
  const { token1, token2, staking } = useConfig();

  useEffect(() => {
    if (account) loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.contract, props.refreshData, account]);

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
      const lastTimeClaimedDate = new Date(+ethers.utils.formatUnits(channel.lastTimeClaimed, 0) * 1000);
      const amount = +ethers.utils.formatEther(channel.amount);
      return {
        amount: amount,
        indexInPool: +ethers.utils.formatUnits(channel.indexInPool, 0),
        planId: channel.planId,
        poolHandle: channel.poolHandle,
        social: getSocialType(channel.poolHandle),
        lastTimeClaimed: lastTimeClaimedDate,
        farmed: 0
      };
    });

    let channels: Channel[] = {} as Channel[];
    formatChannels.forEach((position: ChannelPosition) => {
      if (position.amount == 0) return; // claimed positions return poolHandle: '', let's filter them out
      const poolDataId = poolsData.findIndex(pool => pool.poolHandle === position.poolHandle);
      channels[position.poolHandle] = {
        userTotalAmount: channels[position.poolHandle]?.userTotalAmount + position.amount || position.amount,
        poolHandle: position.poolHandle.split('-')[1],
        social: position.social,
        totalFarmed: 0,
        positions: [...channels[position.poolHandle]?.positions || [], position],
        averageAPR: staking.apy,
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
                      Stake state
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
                          tokenUsd={props.tokenUsd}
                          tokenUserTotal={props.tokenUserTotal}
                          contract={props.contract}
                    />
                )) : (
                    <div className={styles.inactive}>
                      <p className="mb-2">No active positions yet. <a className="btn-link" onClick={() => props.openModal({ type: ModalType.STAKE })}>Click here</a> to get started.</p>
                      <p className="mb-4">You will need {token1.ticker} to get started. <a target="_blank" rel="noopener noreferrer" href={token1.exchange_url}>Get it now</a>.</p>
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