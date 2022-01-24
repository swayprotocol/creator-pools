import React from 'react';
import type { NextPage } from 'next';
import Layout from '../components/Layout';
import FAQ from '../components/FAQ/FAQ';
import Overview from '../components/Overview';
import Header from '../components/Header/Header';
import Pools from '../components/Pools';
import { getStakedData } from '../helpers/getStakedData';
import { getContract } from '../helpers/getContract';
import ReactGA from 'react-ga';
import { getSwayPrice } from '../helpers/getSwayPrice';
import Stakes from '../components/Stakes';
import Modal from '../components/Modal';
import { ModalData } from '../shared/interfaces';
import { ethers, Contract } from 'ethers';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import WalletConnect from '../components/WalletConnect';
import { AbstractConnector } from '@web3-react/abstract-connector';

import STAKING_ABI from '../shared/abis/staking-abi.json';
import { getUserAvailableTokens } from '../helpers/getUserAvailableTokens';
import { getPlans } from '../helpers/getPlans';
import InfoBar from '../components/InfoBar';
import Newsletter from '../components/Newsletter/Newsletter';

declare global {
    interface Window {
        ethereum: any;
    }
}

const initialAppState = {
  topPools: [],
  latestPools: [],
  topPositions: [],
  swayLockedTotal: 0,
  swayUsd: 0,
  swayUserTotal: 0,
  plans: []
};

const planIds = [1, 2, 3, 4, 5, 6]; // hardcoded plans

function initialiseAnalytics() {
  const TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID;
  ReactGA.initialize(TRACKING_ID);
}

const Home: NextPage = () => {
  const [appState, setAppState] = React.useState(initialAppState);
  const [showModal, setShowModal] = React.useState<'STAKE' | 'NEWSLETTER' | ''>('');
  const [walletId, setWalletId] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [contractData, setContractData] = React.useState<Contract>();
  const [walletLoaded, setWalletLoaded] = React.useState(false);
  const [modalData, setModalData] = React.useState<ModalData>({});
  const [dataLoadError, setDataLoadError] = React.useState(false);
  const [refreshData, doRefreshData] = React.useState(0);

  React.useEffect(() => {
    initialiseAnalytics();
    ReactGA.pageview('/index');
    getGeneralData();
    setLoading(false);
    // eslint-disable-next-line
  }, []);

  React.useEffect(() => {
    async function getUserSwayAmount() {
      const availableTokens = await getUserAvailableTokens(walletId);
      setAppState(prevState => ({...prevState, swayUserTotal: availableTokens}))
    }
    if (walletId) getUserSwayAmount();
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
    const stakingContract = new ethers.Contract(process.env.NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS, STAKING_ABI, signer);
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
      const stakedData = await getStakedData();
      const swayPriceUsd = await getSwayPrice();
      getAvailablePlans();

      // calculate data for different columns
      let allCreators: any = {};
      let topPositions: any = {};
      let totalLocked = 0;
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
        swayUsd: swayPriceUsd,
        swayLockedTotal: totalLocked
      }));
    } catch (err) {
      setDataLoadError(true)
    }
  }

  async function getAvailablePlans() {
    const plans = await getPlans(planIds);

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
        <InfoBar swayUsd={appState.swayUsd}
                 swayLockedTotal={appState.swayLockedTotal}
        />
        <Header disconnectWallet={resetAccount}/>
        {walletLoaded && (
          <Stakes openModal={openStakeModal}
                  contract={contractData}
                  swayUsd={appState.swayUsd}
                  swayUserTotal={appState.swayUserTotal}
                  refreshData={refreshData}
                  plans={appState.plans}
          />
        )}
        <Overview swayLockedTotal={appState.swayLockedTotal}
                  swayUsd={appState.swayUsd}
                  plans={appState.plans}
        />
        <Pools top={appState.topPools.slice(0, 10)}
               latest={appState.latestPools.slice(0, 10)}
               positions={appState.topPositions.slice(0, 10)}
               swayUsd={appState.swayUsd}
               loadError={dataLoadError}
               openModal={openStakeModal}
        />
        <FAQ/>
        {showModal === 'STAKE' && (
          <Modal modalData={modalData}
                 contract={contractData}
                 swayUserTotal={appState.swayUserTotal}
                 onClose={(reload) => {
                   setShowModal('');
                   setModalData({});
                   if (reload) {
                     doRefreshData((prev) => prev + 1);
                     setShowModal('NEWSLETTER');
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
