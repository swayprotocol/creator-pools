import React, { createContext, useContext, useEffect, useState } from 'react';

const Config = createContext({} as any);

function GlobalConfigProvider({ children, props }) {
  const [globalConfigData, setGlobalConfigData] = useState({});
  const [isLoading, setLoading] = useState(true);

  // load global config data
  useEffect(() => {
    if (props.globalConfig) {
      setGlobalConfigData(props.globalConfig);
      setLoading(false);
    }
  }, [props]);

  return (
      <Config.Provider value={{ ...globalConfigData, isLoading }}>
        {children}
      </Config.Provider>
  );
}

const useConfig = () => useContext(Config);

export { GlobalConfigProvider, useConfig };