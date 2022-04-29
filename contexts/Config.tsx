import React, { createContext, useContext } from 'react';
const Config = createContext({} as any);

import globalConfigData from '../config.json';

function GlobalConfigProvider({ children }) {
  return (
    <Config.Provider value={globalConfigData}>
      {children}
    </Config.Provider>
  );
}

const useConfig = () => useContext(Config);

export { GlobalConfigProvider, useConfig };
