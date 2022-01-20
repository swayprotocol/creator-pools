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
import { InjectedConnector } from '@web3-react/injected-connector';

import STAKING_ABI from '../shared/abis/staking-abi.json';
import { getUserAvailableTokens } from '../helpers/getUserAvailableTokens';
import { getPlans } from '../helpers/getPlans';

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
  activePlans: []
};

const planIds = [1, 2, 4, 5, 6]; // hardcoded planIds

function initialiseAnalytics() {
  const TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID;
  ReactGA.initialize(TRACKING_ID);
}

const Home: NextPage = () => {
  const [appState, setAppState] = React.useState(initialAppState);
  const [showModal, setShowModal] = React.useState(false);
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

  async function loadWallet(walletId: string, connector?: AbstractConnector) {
    setWalletId(walletId)
    connector.on('Web3ReactUpdate', (event) => {
      if (event.account) {
        setWalletId(event.account);
      }
    });
    connector.on('Web3ReactDeactivate',  (event) => {
      setWalletId('');
    })
  }

  async function connectWallet(connector: AbstractConnector) {
    try {
      const accountId = await connector.getAccount()
      setWalletId(accountId);
      if (connector instanceof InjectedConnector) {
        initMetamaskChangeListener();
      }
    } catch (e) {
      resetAccount();
    }
  }

  function initMetamaskChangeListener() {
    window.ethereum.on('accountsChanged', handleAccountChange);
    // window.ethereum.on('chainChanged', handleNetworkChange);
  }

  function getLibrary(provider: any): Web3Provider {
    const library = new Web3Provider(provider);
    library.pollingInterval = 12000;
    return library;
  }

  async function setContractSigner(library: Web3Provider) {
    if (library) {
      let signer = library.getSigner();

      // hack for mobile, if there is no ethereum object - needed for gas price, etc. in the app
      if (!window.ethereum || library.connection.url !== 'metamask') {
        window.ethereum = library.provider;
      }

      const stakingContract = new ethers.Contract(process.env.NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS, STAKING_ABI, signer);
      setContractData(getContract(stakingContract));
      setWalletLoaded(true);
    }
  }

  function handleAccountChange(accounts) {
    console.log(accounts);
    if (accounts.length > 0) {
      setWalletId(accounts[0])
    } else {
      resetAccount();
    }
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
    // filter out expired dates and sort by apy first
    const activePlans = plans.filter(plan => +plan.availableUntil > +new Date());
    activePlans.sort((prev, current) => (current.apy - prev.apy));

    setAppState((prevState) => ({
      ...prevState,
      activePlans: activePlans
    }));
  }

  function openModal(modalData: ModalData) {
    setShowModal(true);
    setModalData(modalData);
  }

  return (
    <Layout>
      <Web3ReactProvider getLibrary={getLibrary}>
        <WalletConnect
          userLoaded={walletLoaded}
          loaded={!loading}
          setNewSigner={setContractSigner}
          loadUserData={loadWallet} />
        <Header
          walletId={walletId}
          connectWallet={connectWallet}
        />
        {walletLoaded && (
          <Stakes openModal={openModal}
                  walletId={walletId}
                  contract={contractData}
                  swayUsd={appState.swayUsd}
                  swayUserTotal={appState.swayUserTotal}
                  refreshData={refreshData}
          />
        )}
        <Overview swayLockedTotal={appState.swayLockedTotal}
                  swayUsd={appState.swayUsd}
                  activePlans={appState.activePlans}
        />
        <Pools top={appState.topPools.slice(0, 10)}
               latest={appState.latestPools.slice(0, 10)}
               positions={appState.topPositions.slice(0, 10)}
               swayUsd={appState.swayUsd}
               loadError={dataLoadError}
        />
        <FAQ/>
        {showModal && (
          <Modal modalData={modalData}
                 contract={contractData}
                 swayUserTotal={appState.swayUserTotal}
                 onClose={(reload) => {
                   setShowModal(false);
                   setModalData({});
                   if (reload) doRefreshData((prev) => prev + 1);
                 }}
                 activePlans={appState.activePlans}
          />
        )}
      </Web3ReactProvider>
    </Layout>
  );
};

export default Home;
