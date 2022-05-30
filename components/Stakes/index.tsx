import React, { FC, useEffect, useState } from 'react';
import styles from './index.module.scss';
import { getWalletShorthand } from '../../helpers/getWalletShorthand';
import Item from './Item';
import { IChannel, IStake, ModalData, ModalType } from '../../shared/interfaces';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { useConfig } from '../../contexts/Config';
import CommonService from '../../services/Common';

type StakesType = {
  openModal: (modalData: ModalData) => any,
  contract: any,
  tokenUsd: number,
  tokenUserTotal: string,
  refreshData: number
}

const Stakes: FC<StakesType> = (props: StakesType) => {
  const [userStakes, setUserStakes] = useState<IChannel[]>([]);

  const { account } = useWeb3React<Web3Provider>();
  const { token } = useConfig();

  useEffect(() => {
    if (account) loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.contract, props.refreshData, account]);

  async function loadData() {
    const stakedData = await CommonService.getUserActiveStakes(account);
    formatStakedData(stakedData);
  }

  function formatStakedData(stakedData: IStake[]) {

    let formattedData = {} as IChannel[];

    stakedData.forEach((stake) => {
      formattedData[stake.pool.poolHandle] = {
        userTotalStaked: formattedData[stake.pool.poolHandle]?.userTotalStaked + stake.amount || stake.amount,
        poolHandle: stake.pool.poolHandle,
        social: stake.pool.social,
        userTotalEarned: 0,
        stakes: [... formattedData[stake.pool.poolHandle]?.stakes || [], stake],
        averageApy: 0,
        // data from API
        numberOfStakes: 0,
        totalAmount: 0
      };
    })

    formattedData = Object.values(formattedData);
    // set averageApy
    formattedData.map(channel => channel.averageApy = Math.round(
      channel.stakes.reduce((value, stake) => value + stake.plan.apy, 0) / channel.stakes.length)
    );

    setUserStakes(formattedData);
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
              <div className={styles.tokenAvailable}>
                <img src={token.logo} alt={token.ticker} height="20"/>
                <span>{(+props.tokenUserTotal).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
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
              {userStakes.length ? userStakes.map((channelItem, i) => (
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
                  <p className="mb-4">You will need {token.ticker} to get started. <a target="_blank" rel="noopener noreferrer" href={token.exchange_url}>Get it now</a>.</p>
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
