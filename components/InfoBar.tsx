import React, { FC } from 'react';
import { useConfig } from '../contexts/Config';

type BarType = {
  tokenUsd: number,
  tokenLockedTotal: number,
}

const InfoBar: FC<BarType> = (props: BarType) => {
  const { token } = useConfig();

  return (
    <div className="info-bar">
      {(props.tokenUsd * props.tokenLockedTotal > 0) && (
        <div className="container">
          <div className="row">
            <p>
              <strong>{(props.tokenLockedTotal).toLocaleString('en-US', { maximumFractionDigits: 0 })}</strong> TVL
              - total {token.ticker} locked in creator pools
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfoBar;
