import React, { ReactNode } from 'react';
import Head from 'next/head';
import Footer from './Footer';

type Props = {
  children?: ReactNode
}

const meta = {
  title: 'Creator Pools | Sway Social',
  description: '',
  url: '',
  image: ''
};

const Layout = ({ children }: Props) => (
  <>
    <Head>
      <meta httpEquiv="content-type" content="text/html; charset=UTF-8"/>
      <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
      {/*<link rel="icon" href="/assets/favicon.png" type="image/png"/>*/}
      {/*<link rel="apple-touch-icon" sizes="137x137" href="/assets/favicon-137x137.png"/>*/}

      <title>{meta.title}</title>
      <meta name="description" content={meta.description}/>

      {/* Google / Search Engine Tags */}
      <meta itemProp="name" content={meta.title}/>
      <meta itemProp="description" content={meta.description}/>
      <meta itemProp="image" content={`${meta.url}${meta.image}`}/>

      {/* Facebook Meta Tags */}
      <meta property="og:type" content="website"/>
      <meta property="og:url" content={meta.url}/>
      <meta property="og:title" content={meta.title}/>
      <meta property="og:description" content={meta.description}/>
      <meta property="og:image" content={`${meta.url}${meta.image}`}/>

      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content="summary_large_image"/>
      <meta name="twitter:title" content={meta.title}/>
      <meta name="twitter:description" content={meta.description}/>
      <meta name="twitter:image" content={`${meta.url}${meta.image}`}/>
    </Head>
    {children}
    <Footer/>
  </>
);

export default Layout;
