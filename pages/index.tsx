import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Layout from '../components/Layout';
import FAQ from '../components/FAQ/FAQ';
import Overview from '../components/Overview';
import Header from '../components/Header/Header';
import Pools from '../components/Pools';
import { getContract } from '../helpers/getContract';
import ReactGA from 'react-ga';
import { getTokenPrice } from '../helpers/getTokenPrice';
import Stakes from '../components/Stakes';
import Modal from '../components/Modal';
import { ModalData } from '../shared/interfaces';
import { Contract, ethers } from 'ethers';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import WalletConnect from '../components/WalletConnect';
import { AbstractConnector } from '@web3-react/abstract-connector';

import { getUserAvailableTokens } from '../helpers/getUserAvailableTokens';
import InfoBar from '../components/InfoBar';
import Newsletter from '../components/Newsletter/Newsletter';
import { useConfig } from '../contexts/Config';
import getStakingAbi from '../helpers/getStakingAbi';
import { GetStaticProps } from 'next';
import CommonService from '../services/Common';

declare global {
  interface Window {
    ethereum: any;
  }
}

type Props = {
  globalConfig: any
}

const initialAppState = {
  topPools: [],
  latestStakes: [],
  topPositions: [],
  tokenLockedTotal: 0,
  tokenUsd: 0,
  tokenUserTotal: '0',
  activePlans: [],
  distribution: [],
  totalRewardsFarmed: 0,
  maxApyPlan: undefined
};

function initialiseAnalytics(trackingId: string) {
  ReactGA.initialize(trackingId);
}

const Home: NextPage<Props> = ({ globalConfig }) => {
  const [appState, setAppState] = useState(initialAppState);
  const [showModal, setShowModal] = useState<'STAKE' | 'NEWSLETTER' | ''>('');
  const [walletId, setWalletId] = useState('');
  const [loading, setLoading] = useState(true);
  const [contractData, setContractData] = useState<Contract>();
  const [walletLoaded, setWalletLoaded] = useState(false);
  const [modalData, setModalData] = useState<ModalData>({});
  const [dataLoadError, setDataLoadError] = useState(false);
  const [refreshData, doRefreshData] = useState(0);
  const { token, staking, network, ga_tracking_id, site, isLoading } = useConfig();

  useEffect(() => {
    setLoading(false);
    if (!isLoading) {
      getGeneralData();
    }
    if (ga_tracking_id) {
      initialiseAnalytics(ga_tracking_id);
      ReactGA.pageview('/index');
    }
    // eslint-disable-next-line
  }, [isLoading, ga_tracking_id]);

  useEffect(() => {
    async function getUserTokenAmount() {
      const availableTokens = await getUserAvailableTokens(walletId, token.address, network.web3_provider_url);
      setAppState(prevState => ({...prevState, tokenUserTotal: availableTokens}))
    }
    if (walletId) getUserTokenAmount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const stakingAbi = getStakingAbi(staking.abi);
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
      const stakes = await CommonService.getLatestStakes();
      const topStakes = await CommonService.getTopStakes();
      const topPositions = await CommonService.getHighestPositions();
      const tokenPriceUsd = await getTokenPrice(token.coingecko_coin_ticker);
      setAppState((prevState) => ({
        ...prevState,
        latestStakes: stakes,
        topPools: topStakes,
        topPositions: topPositions,
        tokenUsd: tokenPriceUsd
      }));
      getActivePlans();
    } catch (err) {
      setDataLoadError(true);
    }
  }

  async function getActivePlans() {
    let activePlans = await CommonService.getActivePlans();
    // sort by high to low APY
    activePlans.sort((a: { apy: number; }, b: { apy: number; }) => (b.apy - a.apy));
    const maxApyPlan = await CommonService.getMaxApyPlan();

    setAppState((prevState) => ({
      ...prevState,
      activePlans: activePlans,
      maxApyPlan: maxApyPlan
    }));
  }

  function openStakeModal(modalData: ModalData) {
    setShowModal('STAKE');
    setModalData(modalData);
  }

  return (
    <Layout config={globalConfig}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <WalletConnect
          appLoaded={!loading}
          loadWallet={loadWallet}
        />
        {site?.show_tvl_bar && (
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
                  plans={appState.activePlans}
          />
        )}
        <Overview tokenLockedTotal={appState.tokenLockedTotal}
                  maxApyPlan={appState.maxApyPlan}
                  distribution={appState.distribution}
                  totalRewards={appState.totalRewardsFarmed}
                  // todo
                  totalStakes={appState.latestStakes.length}
        />
        <Pools top={appState.topPools.slice(0, 10)}
               latest={appState.latestStakes}
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
                 activePlans={appState.activePlans}
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

export const getStaticProps: GetStaticProps = async () => {
  const res = await fetch(process.env.NEXT_PUBLIC_CONFIG_URL);
  const data = await res.json()

  return {
    props: {
      globalConfig: data
    }
  }
}
