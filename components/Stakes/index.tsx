import React, { FC, useEffect, useState } from 'react';
import styles from './index.module.scss';
import { getWalletShorthand } from '../../helpers/getWalletShorthand';
import Item from './Item';
import { IChannel, ModalData, ModalType } from '../../shared/interfaces';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { useConfig } from '../../contexts/Config';
import CommonService from '../../services/Common';

type StakesType = {
  openModal: (modalData: ModalData) => any,
  contract: any,
  tokenUsd: number[],
  tokenUserTotal: string[],
  refreshData: number,
  maxApyPlan: number[]
}

const Stakes: FC<StakesType> = (props: StakesType) => {
  const [userStakes, setUserStakes] = useState<IChannel[]>([]);

  const { account } = useWeb3React<Web3Provider>();
  const { token1 } = useConfig();

  useEffect(() => {
    if (account) loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.contract, props.refreshData, account]);

  async function loadData() {
    const activePools = await CommonService.getUserActivePools(account);
    setUserStakes(activePools);
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
                {userStakes.length ? userStakes.map((channelItem, i) => (
                    <Item key={i}
                          openModal={props.openModal}
                          channel={channelItem}
                          tokenUsd={props.tokenUsd}
                          tokenUserTotal={props.tokenUserTotal}
                          contract={props.contract}
                          maxApyPlan={props.maxApyPlan}
                    />
                )) : (
                    <div className={styles.inactive}>
                      <p className="mb-2">No active positions yet. <a className="btn-link" onClick={() => props.openModal({ type: ModalType.STAKE })}>Click here</a> to get started.</p>
                      <p className="mb-4">You will need {token1?.ticker} to get started. <a target="_blank" rel="noopener noreferrer" href={token1?.exchange_url}>Get it now</a>.</p>
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