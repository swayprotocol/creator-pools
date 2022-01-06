import type { NextPage } from 'next'
import Layout from '../components/Layout';
import FAQ from '../components/FAQ';
import Overview from '../components/Overview';

const Home: NextPage = () => (
  <Layout>
    <h1>Creator Pools</h1>
    <Overview/>
    <FAQ/>
  </Layout>
);

export default Home
