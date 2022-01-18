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
  swayUserTotal: 0
};

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
  }, [walletId]);

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

  async function connectWallet(connector?: AbstractConnector) {
    try {
      let networkId;
      let accountId;

      // connector is submitted only when connecting through /connect page
      if (connector) {
        accountId = await connector.getAccount() || (await connector.getProvider())?.selectedAddress;
        let id = await connector.getChainId();

        // re-init metamask chain/account change listeners
        if (connector instanceof InjectedConnector) {
          initMetamaskChangeListener();
        }
      } else {
        networkId = await window.ethereum.chainId;
      }

      if (networkId === process.env.REACT_APP_WEB3_NETWORK_ID) {
        // if account was not set by connector, get the enabled metamask one
        if (!accountId) {
          const metaMaskUser = await window.ethereum.enable();
          accountId = metaMaskUser[0];
        }

        setWalletId(accountId);
      } else {

        resetAccount();

        try {
          const NETWORK_IDS = ['0x89', '0x4', '0x13881'];
          NETWORK_IDS.forEach(async id => {
            if(process.env.REACT_APP_WEB3_NETWORK_ID === id){
              await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: id }],
              });
            }
          })

        } catch (switchError: any) {
          // This error code indicates that the chain has not been added to MetaMask.
          if (switchError.code === 4902) {
            try {
              if(process.env.REACT_APP_WEB3_NETWORK_ID === '0x89'){
                await window.ethereum.request({
                  method: 'wallet_addEthereumChain',
                    params: [{  chainId: '0x89', //0x89 or 137
                        chainName: 'Matic Mainnet',
                        nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
                        rpcUrls: ['https://polygon-rpc.com/'],
                        blockExplorerUrls: ['https://explorer.matic.network/']
                    }]
                });
              } else if (process.env.REACT_APP_WEB3_NETWORK_ID === '0x4') {
                await window.ethereum.request({
                  method: 'wallet_addEthereumChain',
                    params: [{  chainId: '0x4', //0x4 or 4
                        chainName: 'Rinkeby Test Network',
                        nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
                        rpcUrls: ['https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
                        blockExplorerUrls: ['https://rinkeby.etherscan.io']
                    }]
                });
              } else if (process.env.REACT_APP_WEB3_NETWORK_ID === '0x13881') {
                await window.ethereum.request({
                  method: 'wallet_addEthereumChain',
                    params: [{  chainId: '0x13881', //0x13881 or 80001
                        chainName: 'Matic Mumbai',
                        nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
                        rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
                        blockExplorerUrls: ['https://mumbai.polygonscan.com/']
                    }]
                });
              }

            } catch (addError) {
              console.log("Automatic switching to MATIC failed!");
              console.log(addError);
            }
          }
        }
      }
    } catch (error) {
      console.log(error);
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

  async function loadWeb3() {
    let providerOrSigner;

    if (window.ethereum) {
      providerOrSigner = new ethers.providers.Web3Provider(window.ethereum);

      const networkId = await window.ethereum.chainId;

      let isLoggedInMetamask = window.ethereum.selectedAddress !== null;

      if (isLoggedInMetamask && networkId === process.env.NEXT_PUBLIC_WEB3_NETWORK_ID) {
        await connectMetamask();
        providerOrSigner = providerOrSigner.getSigner();

        await window.ethereum.request({method: 'eth_requestAccounts'});
        initMetamaskChangeListener();
      } else {
        providerOrSigner = new ethers.providers.WebSocketProvider(process.env.NEXT_PUBLIC_WEB3_WS_PROVIDER!);
        await resetAccount();
      }
    } else {
      providerOrSigner = new ethers.providers.WebSocketProvider(process.env.NEXT_PUBLIC_WEB3_WS_PROVIDER!);
    }

    // const cloutContract = new ethers.Contract(process.env.NEXT_PUBLIC_CLOUT_NFT_CONTRACT_ADDRESS, cloutAbi, providerOrSigner);
    // const marketplaceContract = new ethers.Contract(process.env.NEXT_PUBLIC_MARKETPLACE_CONTRACT_ADDRESS, marketplaceAbi, providerOrSigner);

    // return [cloutContract, marketplaceContract];
  }

  async function connectMetamask() {
    try {
      const networkId = await window.ethereum.chainId;
      if (networkId === process.env.NEXT_PUBLIC_WEB3_NETWORK_ID) {
        const metaMaskUser = await window.ethereum.enable();

        setWalletId(metaMaskUser[0]);
      } else {

        resetAccount();

        try {
          if(process.env.NEXT_PUBLIC_WEB3_NETWORK_ID === '0x89'){
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0x89' }], // 0x89 or 137
            });
          }else if (process.env.NEXT_PUBLIC_WEB3_NETWORK_ID === '0x4'){
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0x4' }], // 0x4 or 4
            });
          }else if (process.env.NEXT_PUBLIC_WEB3_NETWORK_ID === '0x13881'){
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0x13881' }], // 0x13881 or 80001
            });
          }

        } catch (switchError: any) {
          // This error code indicates that the chain has not been added to MetaMask.
          if (switchError.code === 4902) {
            try {
              if(process.env.NEXT_PUBLIC_WEB3_NETWORK_ID === '0x89'){
                await window.ethereum.request({
                  method: 'wallet_addEthereumChain',
                    params: [{  chainId: '0x89', //0x89 or 137
                        chainName: 'Matic Mainnet',
                        nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
                        rpcUrls: ['https://rpc-mainnet.maticvigil.com/'],
                        blockExplorerUrls: ['https://explorer.matic.network/']
                    }]
                });
              } else if (process.env.NEXT_PUBLIC_WEB3_NETWORK_ID === '0x4') {
                await window.ethereum.request({
                  method: 'wallet_addEthereumChain',
                    params: [{  chainId: '0x4', //0x4 or 4
                        chainName: 'Rinkeby Test Network',
                        nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
                        rpcUrls: ['https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
                        blockExplorerUrls: ['https://rinkeby.etherscan.io']
                    }]
                });
              } else if (process.env.NEXT_PUBLIC_WEB3_NETWORK_ID === '0x13881') {
                await window.ethereum.request({
                  method: 'wallet_addEthereumChain',
                    params: [{  chainId: '0x13881', //0x13881 or 80001
                        chainName: 'Matic Mumbai',
                        nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
                        rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
                        blockExplorerUrls: ['https://mumbai.polygonscan.com/']
                    }]
                });
              }

            } catch (addError) {
              console.log("Automatic switching to MATIC failed!");
              console.log(addError);
            }
          }
        }
      }
    } catch (error) {
      resetAccount();
    }
  }

  async function resetAccount() {
    setWalletId('');
  }

  async function getGeneralData() {
    try {
      const stakedData = await getStakedData();
      const swayPriceUsd = await getSwayPrice();

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
          />
        )}
      </Web3ReactProvider>
    </Layout>
  );
};

export default Home;
