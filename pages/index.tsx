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

import { getUserAvailableTokens } from '../helpers/getUserAvailableTokens';
import InfoBar from '../components/InfoBar';
import Newsletter from '../components/Newsletter/Newsletter';
import { getFarmedAmount } from '../helpers/getFarmedAmount';
import { useConfig } from '../contexts/Config';
import getStakingAbi from '../helpers/getStakingAbi';

declare global {
  interface Window {
    ethereum: any;
  }
}

const initialAppState = {
  topPools: [],
  latestPools: [],
  topPositions: [],
  tokenLockedTotal: [0, 0],
  tokenUsd: [0, 0],
  tokenUserTotal: ['0', '0'],
  distribution: [],
  totalRewardsFarmed: [0, 0]
};

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
  const { token1, token2, staking, network, ga_tracking_id, site } = useConfig();

  useEffect(() => {
    initialiseAnalytics(ga_tracking_id);
    ReactGA.pageview('/index');
    getGeneralData();
    setLoading(false);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    async function getUserTokenAmount() {
      const availableTokens1 = await getUserAvailableTokens(walletId, token1.address, network.web3_provider_url);
      const availableTokens2 = await getUserAvailableTokens(walletId, token2.address, network.web3_provider_url);
      setAppState(prevState => ({...prevState, tokenUserTotal: [availableTokens1, availableTokens2]}))
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
    const stakingAbi = getStakingAbi();
    const stakingContract = new ethers.Contract(staking.address, stakingAbi, signer);
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
      const token1PriceUsd = await getTokenPrice(token1.coingecko_coin_ticker);
      const token2PriceUsd = await getTokenPrice(token2.coingecko_coin_ticker);

      // calculate data for different columns
      let allCreators: any = {};
      let topPositions: any = {};
      let totalLocked = [0,0];
      let totalRewardsFarmed = [0, 0];
      let tokentype = 0; //TODO fix

      console.log(stakedData);
      stakedData.forEach(event => {
        allCreators[event.poolHandle] = {
          ...event,
          amount: allCreators[event.poolHandle]?.amount + event.amount || event.amount
        };
        topPositions[event.sender] = {
          ...event,
          amount: topPositions[event.poolHandle]?.amount + event.amount || event.amount
        }

        if(tokentype == 0) {
          totalLocked[0] += event.amount;
          totalRewardsFarmed[0] += getFarmedAmount(event.amount, event.date, staking.apy)
        }
        else {
          totalLocked[1] += event.amount;
          totalRewardsFarmed[1] += getFarmedAmount(event.amount, event.date, staking.apy)
        }
        // prefill plan and unlockTime for farmed calculations

      });
      // sort by high to low
      allCreators = Object.values(allCreators);
      allCreators.sort((a: { amount: number; }, b: { amount: number; }) => (b.amount - a.amount));
      topPositions = Object.values(topPositions);
      topPositions.sort((a: { amount: number; }, b: { amount: number; }) => (b.amount - a.amount));

      const latestPools = stakedData.sort((a, b) => { return b.date.getTime() - a.date.getTime() });
      // set state
      setAppState((prevState) => ({
        ...prevState,
        topPools: allCreators,
        latestPools: latestPools,
        topPositions: topPositions,
        tokenUsd: [token1PriceUsd, token2PriceUsd],
        tokenLockedTotal: totalLocked,
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
      let totalRewardsFarmed = [0,0];
      stakedData.forEach(event => {
        totalRewardsFarmed[0] += getFarmedAmount(event.amount, event.date, staking.apy)
      });
      setAppState((prevState) => ({
        ...prevState,
        totalRewardsFarmed: totalRewardsFarmed

      }));
    }, reloadInterval);
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
        {site.show_tvl_bar && (
          <InfoBar tokenUsd={appState.tokenUsd}
                   tokenLockedTotal={appState.tokenLockedTotal}
          />
        )}
        <Header disconnectWallet={resetAccount}/>
        {walletLoaded && (
          <Stakes openModal={openStakeModal}
                  contract={contractData}
                  tokenUsd={appState.tokenUsd}
                  tokenUserTotal={appState.tokenUserTotal}
                  refreshData={refreshData}
          />
        )}
        <Overview tokenLockedTotal={appState.tokenLockedTotal}
                  tokenUsd={appState.tokenUsd}
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
