import React from 'react';
import NextDocument, { Html, Head, Main, NextScript } from 'next/document';

import globalConfigData from '../config.json';

class Document extends NextDocument {
  render() {
    return (
      <Html>
        <Head>
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
