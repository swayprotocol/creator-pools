import React, { ReactNode } from 'react';
import Head from 'next/head';
import Footer from './Footer';

type Props = {
  children?: ReactNode,
  config: any
}

const Layout = ({ children, config }: Props) => {
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width"/>

        <link rel="icon" href={config.site.meta.favicon} type="image/png"/>
        <link rel="apple-touch-icon" sizes="137x137" href={config.site.meta.apple_touch_icon}/>

        <title>{config.site.meta.title}</title>
        <meta name="description" content={config.site.meta.description}/>

        {/* Google / Search Engine Tags */}
        <meta itemProp="name" content={config.site.meta.title}/>
        <meta itemProp="description" content={config.site.meta.description}/>
        <meta itemProp="image" content={`${config.site.meta.url}${config.site.meta.og_image}`}/>

        {/* Facebook Meta Tags */}
        <meta property="og:type" content="website"/>
        <meta property="og:url" content={config.site.meta.url}/>
        <meta property="og:title" content={config.site.meta.title}/>
        <meta property="og:description" content={config.site.meta.description}/>
        <meta property="og:image" content={`${config.site.meta.url}${config.site.meta.og_image}`}/>

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image"/>
        <meta name="twitter:title" content={config.site.meta.title}/>
        <meta name="twitter:description" content={config.site.meta.description}/>
        <meta name="twitter:image" content={`${config.site.meta.url}${config.site.meta.og_image}`}/>
      </Head>
      {children}
      <Footer/>
    </>
  )
};

export default Layout;
