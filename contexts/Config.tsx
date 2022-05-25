import React, { createContext, useContext, useEffect, useState } from 'react';

const Config = createContext({} as any);

function GlobalConfigProvider({ children }) {
  const [globalConfigData, setGlobalConfigData] = useState({});
  const [isLoading, setLoading] = useState(true);

  // load global config data
  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_CONFIG_URL, {
      method: 'GET'
    }).then((res) => res.json())
      .then((data) => {
        setGlobalConfigData(data);
        setLoading(false);
      });
  }, []);

  return (
    <Config.Provider value={{ ...globalConfigData, isLoading }}>
      {children}
    </Config.Provider>
  );
}

const useConfig = () => useContext(Config);

export { GlobalConfigProvider, useConfig };
