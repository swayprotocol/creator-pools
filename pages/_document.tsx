import React from 'react';
import NextDocument, { Html, Head, Main, NextScript } from 'next/document';

import globalConfigData from '../config.json';

class Document extends NextDocument {
  render() {
    return (
      <Html>
        <Head>
          <meta httpEquiv="content-type" content="text/html; charset=UTF-8"/>
          <link rel="icon" href={globalConfigData.site.meta.favicon} type="image/png"/>
          <link rel="apple-touch-icon" sizes="137x137" href={globalConfigData.site.meta.apple_touch_icon}/>

          <link rel="preconnect" href="https://fonts.googleapis.com"/>
          <link href={globalConfigData.theme.font_url} rel="stylesheet"/>
        </Head>
        <body>
        <Main/>
        <NextScript/>
        </body>
      </Html>
    );
  }
}

export default Document;
