import type { NextPage } from 'next'
import Layout from '../components/Layout';
import FAQ from '../components/FAQ';

const Home: NextPage = () => (
  <Layout>
    <h1>Creator Pools</h1>
    <FAQ/>
  </Layout>
);

export default Home
