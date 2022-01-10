import type { NextPage } from 'next'
import Layout from '../components/Layout';
import FAQ from '../components/FAQ/FAQ';
import Overview from '../components/Overview';
import Header from '../components/Header/Header';

const Home: NextPage = () => (
  <Layout>
    <Header/>
    <Overview/>
    <FAQ/>
  </Layout>
);

export default Home
