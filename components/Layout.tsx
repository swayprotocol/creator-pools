import React, { ReactNode } from 'react';
import Head from 'next/head';
import Footer from './Footer';
import { useConfig } from '../contexts/Config';

type Props = {
  children?: ReactNode
}

const Layout = ({ children }: Props) => {
  const { site } = useConfig();

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width"/>

        <title>{site.meta.title}</title>
        <meta name="description" content={site.meta.description}/>

        {/* Google / Search Engine Tags */}
        <meta itemProp="name" content={site.meta.title}/>
        <meta itemProp="description" content={site.meta.description}/>
        <meta itemProp="image" content={`${site.meta.url}${site.meta.og_image}`}/>

        {/* Facebook Meta Tags */}
        <meta property="og:type" content="website"/>
        <meta property="og:url" content={site.meta.url}/>
        <meta property="og:title" content={site.meta.title}/>
        <meta property="og:description" content={site.meta.description}/>
        <meta property="og:image" content={`${site.meta.url}${site.meta.og_image}`}/>

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image"/>
        <meta name="twitter:title" content={site.meta.title}/>
        <meta name="twitter:description" content={site.meta.description}/>
        <meta name="twitter:image" content={`${site.meta.url}${site.meta.og_image}`}/>
      </Head>
      {children}
      <Footer/>
    </>
  )
};

export default Layout;
