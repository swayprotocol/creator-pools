import React from 'react';
import type { NextPage } from 'next';
import Layout from '../components/Layout';
import FAQ from '../components/FAQ/FAQ';
import Overview from '../components/Overview';
import Header from '../components/Header/Header';
import Pools from '../components/Pools';
import { getStakedData } from '../helpers/getStakedData';
import ReactGA from 'react-ga';
import { getSwayPrice } from '../helpers/getSwayPrice';

const initialAppState = {
  topPools: [],
  latestPools: [],
  topPositions: [],
  swayAmountTotal: 0,
  swayUsd: 0
};

function initialiseAnalytics() {
  const TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID;
  ReactGA.initialize(TRACKING_ID);
}

const Home: NextPage = () => {
  const [appState, setAppState] = React.useState(initialAppState);
  React.useEffect(() => {
    initialiseAnalytics();
    ReactGA.pageview('/index');
    getAndCalculateData();
    // eslint-disable-next-line
  }, []);

  async function getAndCalculateData() {
    const stakedData = await getStakedData();
    const swayPriceUsd = await getSwayPrice();
    let totalLocked = 0;

    // calculate data for different columns
    let allCreators: any = {};
    let topPositions: any = {};
    stakedData.forEach(event => {
      totalLocked += event.amount;
      allCreators[event.poolHandle] = {
        ...event,
        amount: allCreators[event.poolHandle]?.amount + event.amount || event.amount
      };
      topPositions[event.sender] = {
        ...event,
        amount: allCreators[event.poolHandle]?.amount + event.amount || event.amount
      }
    });

    // sort by high to low
    allCreators = Object.values(allCreators);
    allCreators.sort((a: { amount: number; }, b: { amount: number; }) => (b.amount - a.amount));
    topPositions = Object.values(topPositions);
    topPositions.sort((a: { amount: number; }, b: { amount: number; }) => (b.amount - a.amount));

    // set state
    setAppState({
      topPools: allCreators,
      latestPools: stakedData,
      topPositions: topPositions,
      swayUsd: swayPriceUsd,
      swayAmountTotal: totalLocked,
    });
  }

  return (
    <Layout>
      <Header/>
      <Overview swayAmountTotal={appState.swayAmountTotal}
                swayUsd={appState.swayUsd}
      />
      <Pools top={appState.topPools.slice(0, 10)}
             latest={appState.latestPools.slice(0, 10)}
             positions={appState.topPositions.slice(0, 10)}
             swayUsd={appState.swayUsd}
      />
      <FAQ/>
    </Layout>
  );
};

export default Home;
