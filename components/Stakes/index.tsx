import React, { FC } from 'react';
import styles from './index.module.scss';
import { getWalletShorthand } from '../../helpers/getWalletShorthand';
import Item from './Item';
import { Channel, ChannelPosition, ModalData, ModalType, StakedEventSocialType } from '../../shared/interfaces';
import { ethers } from 'ethers';

type StakesType = {
  openModal: (modalData: ModalData) => any,
  walletId: string,
  contract: any,
  swayUsd: number,
  swayUserTotal: number,
  refreshData: number
}

const initialChannels: Channel[] = [];

const Stakes: FC<StakesType> = (props: StakesType) => {
  const [channels, setChannels] = React.useState(initialChannels);

  React.useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.contract, props.refreshData]);

  async function loadData() {
    const activeChannels: any[] = await props.contract.getUserQueue(props.walletId);
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
        poolHandle: channel.poolHandle,
        social: socialIcon,
        stakedAt: stakedAtDate,
        unlockTime: unlockTimeDate,
        farmed: getFarmedAmount(amount, stakedAtDate, unlockTimeDate, channel.planId)
      };
    });

    let channels: Channel[] = {} as Channel[];
    formatChannels.forEach(position => {
      if (!position.poolHandle) return; // claimed positions return poolHandle: '', let's filter them out
      const poolDataId = poolsData.findIndex(pool => pool.poolHandle === position.poolHandle);
      channels[position.poolHandle] = {
        userTotalAmount: channels[position.poolHandle]?.userTotalAmount + position.amount || position.amount,
        poolHandle: position.poolHandle.split('-')[1],
        social: position.social,
        totalFarmed: channels[position.poolHandle]?.totalFarmed + position.farmed || position.farmed,
        positions: [...channels[position.poolHandle]?.positions || [], position],
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

  const getFarmedAmount = (amount: number, stakedAt: Date, unlockTime: Date, planId: number): number => {
    const apy: any = {
      1: 33,
      2: 66,
      3: 99
    };
    // use new Date() until the staking is over
    const maxDate = +unlockTime < +new Date() ? unlockTime : new Date();
    return ((+maxDate - +stakedAt) / 1000 / 3600 / 24 / 365 * apy[planId] / 100) * amount;
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
                  connected to {getWalletShorthand('0x538Bdc460119Bb95F8ee51E46D22Eee5e7a6cC4e')}
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
                  <p className="mb-4">No active positions yet. <a className="btn-link" onClick={() => props.openModal({ type: ModalType.STAKE })}>Click here</a> to get started.</p>
                  <p className="mb-0">You will need SWAY to get started. <a target="_blank" rel="noopener noreferrer" href="https://www.gate.io/trade/SWAY_USDT">Get it now</a>.</p>
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
