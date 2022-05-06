import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Layout from '../components/Layout';
import FAQ from '../components/FAQ/FAQ';
import Overview from '../components/Overview';
import Header from '../components/Header/Header';
import Pools from '../components/Pools';
import { getStakedData } from '../helpers/getStakedData';
import { getContract } from '../helpers/getContract';
import ReactGA from 'react-ga';
import { getTokenPrice } from '../helpers/getTokenPrice';
import Stakes from '../components/Stakes';
import Modal from '../components/Modal';
import { IChannelDistributionItem, ModalData, StakedEvent } from '../shared/interfaces';
import { Contract, ethers } from 'ethers';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import WalletConnect from '../components/WalletConnect';
import { AbstractConnector } from '@web3-react/abstract-connector';

import STAKING_ABI from '../shared/abis/staking-abi.json';
import { getUserAvailableTokens } from '../helpers/getUserAvailableTokens';
import { getPlans } from '../helpers/getPlans';
import InfoBar from '../components/InfoBar';
import Newsletter from '../components/Newsletter/Newsletter';
import { availablePlans } from '../shared/constants';
import { getFarmedAmount } from '../helpers/getFarmedAmount';
import { getMaxPlanByDate } from '../helpers/getMaxPlanByDate';
import { useConfig } from '../contexts/Config';

declare global {
  interface Window {
    ethereum: any;
  }
}

const initialAppState = {
  topPools: [],
  latestPools: [],
  topPositions: [],
  tokenLockedTotal: 0,
  tokenUsd: 0,
  tokenUserTotal: '0',
  plans: availablePlans,
  distribution: [],
  totalRewardsFarmed: 0
};

const planIds = [1, 2, 3, 4, 5, 6]; // hardcoded plans

function initialiseAnalytics(trackingId: string) {
  ReactGA.initialize(trackingId);
}

const Home: NextPage = () => {
  const [appState, setAppState] = useState(initialAppState);
  const [showModal, setShowModal] = useState<'STAKE' | 'NEWSLETTER' | ''>('');
  const [walletId, setWalletId] = useState('');
  const [loading, setLoading] = useState(true);
  const [contractData, setContractData] = useState<Contract>();
  const [walletLoaded, setWalletLoaded] = useState(false);
  const [modalData, setModalData] = useState<ModalData>({});
  const [dataLoadError, setDataLoadError] = useState(false);
  const [refreshData, doRefreshData] = useState(0);
  const { token, staking, network, ga_tracking_id, site } = useConfig();

  useEffect(() => {
    initialiseAnalytics(ga_tracking_id);
    ReactGA.pageview('/index');
    getGeneralData();
    setLoading(false);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    async function getUserTokenAmount() {
      const availableTokens = await getUserAvailableTokens(walletId, token.address, network.web3_provider_url);
      setAppState(prevState => ({...prevState, tokenUserTotal: availableTokens}))
    }
    if (walletId) getUserTokenAmount();
  }, [walletId, refreshData]);

  async function loadWallet(connector: AbstractConnector, library: Web3Provider) {
    connector.on('Web3ReactUpdate', (event) => {
      if (event.account) {
        setWalletId(event.account);
      }
    });
    connector.on('Web3ReactDeactivate',  (event) => {
      resetAccount();
    })

    let signer = library.getSigner();
    const stakingContract = new ethers.Contract(staking.address, STAKING_ABI, signer);
    const walletId = await connector.getAccount();

    setContractData(getContract(stakingContract));
    setWalletId(walletId);
    setWalletLoaded(true);
  }

  function getLibrary(provider: any): Web3Provider {
    const library = new Web3Provider(provider);
    library.pollingInterval = 12000;
    return library;
  }

  async function resetAccount() {
    setWalletId('');
    setWalletLoaded(false);
  }

  async function getGeneralData() {
    try {
      const stakedData = await getStakedData(staking.address, network.web3_provider_url);
      const tokenPriceUsd = await getTokenPrice(token.coingecko_coin_ticker);
      getAvailablePlans();

      // calculate data for different columns
      let allCreators: any = {};
      let topPositions: any = {};
      let totalLocked = 0;
      const distribution = staking.channels.map(channel => ({ ...channel, count: 0 }));
      let totalRewardsFarmed = 0;

      stakedData.forEach(event => {
        totalLocked += event.amount;
        allCreators[event.poolHandle] = {
          ...event,
          amount: allCreators[event.poolHandle]?.amount + event.amount || event.amount
        };
        topPositions[event.sender] = {
          ...event,
          amount: topPositions[event.poolHandle]?.amount + event.amount || event.amount
        }
        const distributionItem = distribution.find(channel => channel.prefix === event.social) as IChannelDistributionItem;
        distributionItem.count += 1;
        // prefill plan and unlockTime for farmed calculations
        event.plan = getMaxPlanByDate(event.date);
        event.unlockTime = new Date(new Date(event.date).setMonth(new Date(event.date).getMonth() + event.plan.lockMonths));
        totalRewardsFarmed += getFarmedAmount(event.amount, event.date, event.unlockTime, event.plan)
      });

      // sort by high to low
      allCreators = Object.values(allCreators);
      allCreators.sort((a: { amount: number; }, b: { amount: number; }) => (b.amount - a.amount));
      topPositions = Object.values(topPositions);
      topPositions.sort((a: { amount: number; }, b: { amount: number; }) => (b.amount - a.amount));
      distribution.sort((a: { count: number; }, b: { count: number; }) => (b.count - a.count));

      const latestPools = stakedData.sort((a, b) => { return b.date.getTime() - a.date.getTime() });
      // set state
      setAppState((prevState) => ({
        ...prevState,
        topPools: allCreators,
        latestPools: latestPools,
        topPositions: topPositions,
        tokenUsd: tokenPriceUsd,
        tokenLockedTotal: totalLocked,
        distribution: distribution,
        totalRewardsFarmed: totalRewardsFarmed
      }));
      setTotalRewardsInterval(stakedData);
    } catch (err) {
      setDataLoadError(true)
    }
  }

  function setTotalRewardsInterval(stakedData: StakedEvent[]) {
    // recalculate total farmed and update state
    const reloadInterval = 7500;
    setInterval(() => {
      let totalRewardsFarmed = 0;
      stakedData.forEach(event => {
        totalRewardsFarmed += getFarmedAmount(event.amount, event.date, event.unlockTime, event.plan)
      });
      setAppState((prevState) => ({
        ...prevState,
        totalRewardsFarmed: totalRewardsFarmed
      }));
    }, reloadInterval);
  }

  async function getAvailablePlans() {
    const plans = await getPlans(planIds, staking.address, network.web3_provider_url);

    // add a planId: 0, that doesn't expire, but it's unstakeable
    plans.push({
      planId: 0,
      apy: 0,
      availableUntil: new Date('2099-12-31'),
      lockMonths: 0,
      createdAt: new Date('1970-01-01')
    })

    setAppState((prevState) => ({
      ...prevState,
      plans: plans
    }));
  }

  function openStakeModal(modalData: ModalData) {
    setShowModal('STAKE');
    setModalData(modalData);
  }

  return (
    <Layout>
      <Web3ReactProvider getLibrary={getLibrary}>
        <WalletConnect
          appLoaded={!loading}
          loadWallet={loadWallet}
        />
        <InfoBar tokenUsd={appState.tokenUsd}
                 tokenLockedTotal={appState.tokenLockedTotal}
        />
        <Header disconnectWallet={resetAccount}/>
        {walletLoaded && (
          <Stakes openModal={openStakeModal}
                  contract={contractData}
                  tokenUsd={appState.tokenUsd}
                  tokenUserTotal={appState.tokenUserTotal}
                  refreshData={refreshData}
                  plans={appState.plans}
          />
        )}
        <Overview tokenLockedTotal={appState.tokenLockedTotal}
                  tokenUsd={appState.tokenUsd}
                  plans={appState.plans}
                  distribution={appState.distribution}
                  totalRewards={appState.totalRewardsFarmed}
                  totalStakes={appState.latestPools.length}
        />
        <Pools top={appState.topPools.slice(0, 10)}
               latest={appState.latestPools.slice(0, 10)}
               positions={appState.topPositions.slice(0, 10)}
               tokenUsd={appState.tokenUsd}
               loadError={dataLoadError}
               openModal={openStakeModal}
        />
        <FAQ/>
        {showModal === 'STAKE' && (
          <Modal modalData={modalData}
                 contract={contractData}
                 tokenUserTotal={appState.tokenUserTotal}
                 onClose={(reload) => {
                   setShowModal('');
                   setModalData({});
                   if (reload) {
                     doRefreshData((prev) => prev + 1);
                     if (site.show_newsletter) {
                       setShowModal('NEWSLETTER');
                     }
                   }
                 }}
                 plans={appState.plans}
          />
        )}
        {showModal === 'NEWSLETTER' && (
          <Newsletter onClose={() => setShowModal('')}/>
        )}
      </Web3ReactProvider>
    </Layout>
  );
};

export default Home;
