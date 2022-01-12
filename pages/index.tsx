import React from 'react';
import type { NextPage } from 'next';
import Layout from '../components/Layout';
import FAQ from '../components/FAQ/FAQ';
import Overview from '../components/Overview';
import Header from '../components/Header/Header';
import Pools from '../components/Pools';
import { getStakedData } from '../helpers/getStakedData';
import { getSwayPrice } from '../helpers/getSwayPrice';

const initialAppState = {
  topPools: [],
  latestPools: [],
  individualHighestPools: [],
  tvl: 0,
  swayUsd: 0
};

const Home: NextPage = () => {
  const [appState, setAppState] = React.useState(initialAppState);

  React.useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, []);

  async function getData() {
    const stakedData = await getStakedData();
    const swayPriceUsd = await getSwayPrice();

    // console.log(appState);
    // console.log(stakedData);

    // creating array of all creators with value
    let allCreators: any = {};
    stakedData.forEach(event => {
      allCreators[event.poolHandle] = {
        ...event,
        amount: allCreators[event.poolHandle]?.amount + event.amount || event.amount
      };
    });
    // sort by high to low
    allCreators = Object.values(allCreators);
    allCreators.sort((a: { amount: number; }, b: { amount: number; }) => (b.amount - a.amount));

    // set state
    setAppState((prevState) => ({ ...prevState, topPools: allCreators }));
    setAppState((prevState) => ({ ...prevState, latestPools: stakedData }));
    setAppState((prevState) => ({ ...prevState, swayUsd: swayPriceUsd }));

    // console.log(appState.topPools);
    // console.log(appState);
  }

  return (
    <Layout>
      <Header/>
      <Overview/>
      <Pools top={appState.topPools.slice(0, 10)}
             latest={appState.latestPools.slice(0, 10)}
             positions={appState.latestPools.slice(0, 10)}
             swayUsd={appState.swayUsd}
      />
      <FAQ/>
    </Layout>
  );
};

export default Home;
