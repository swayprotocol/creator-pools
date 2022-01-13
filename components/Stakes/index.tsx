import React, { FC } from 'react';
import styles from './index.module.scss';
import { getWalletShorthand } from '../../helpers/getWalletShorthand';
import Item from './Item';
import { Channel, ChannelPosition, ModalType, StakedEventSocialType } from '../../shared/interfaces';
import { Contract, ethers } from 'ethers';

type StakesType = {
  openModal: ({ type: ModalType }) => any,
  walletId: string,
  contract: Contract,
  swayUsd: number,
}

const initialChannels: Channel[] = [];

const Stakes: FC<StakesType> = (props: StakesType) => {
  const [channels, setChannels] = React.useState(initialChannels);

  React.useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.contract]);

  async function loadData() {
    const activeChannels: any[] = await props.contract.getUserQueue(props.walletId);
    formatData(activeChannels);
  }

  function formatData(activeChannels: any[]) {
    const formatChannels: ChannelPosition[] = activeChannels.map((channel) => ({
      amount: +ethers.utils.formatEther(channel.amount),
      indexInPool: +ethers.utils.formatUnits(channel.indexInPool, 0),
      planId: channel.planId,
      poolHandle: channel.poolHandle.split('-')[1],
      social: StakedEventSocialType.IG,
      stakedAt: new Date(+ethers.utils.formatUnits(channel.stakedAt, 0) * 1000),
      unlockTime: new Date(+ethers.utils.formatUnits(channel.unlockTime, 0) * 1000),
    }));

    let channels: Channel[] = {} as Channel[];
    formatChannels.forEach(position => {
      channels[position.poolHandle] = {
        totalAmount: channels[position.poolHandle]?.amount + position.amount || position.amount,
        poolHandle: position.poolHandle,
        social: position.social,
        farmed: 20 * Math.random(),
        positions: [...channels[position.poolHandle]?.positions || [], position]
      }
    })

    channels = Object.values(channels);
    console.log(channels);
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
                  connected to {getWalletShorthand('0x538Bdc460119Bb95F8ee51E46D22Eee5e7a6cC4e')}
                </div>
              </div>
            </div>
            <div className={styles.connectWrapper}>
              <div className={styles.swayAvailable}>
                <img src="assets/favicon.png" alt="Sway" height="20" width="20"/>
                <span>1,233,444</span>
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
              {channels.map((channelItem, i) => (
                <Item key={i}
                      openModal={props.openModal}
                      channel={channelItem}
                      swayUsd={props.swayUsd}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stakes;
