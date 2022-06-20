import React, { FC } from 'react';
import { useConfig } from '../contexts/Config';

type BarType = {
  tokenUsd: number[],
  tokenLockedTotal: number[],
}

const InfoBar: FC<BarType> = (props: BarType) => {
  const { token1, token2 } = useConfig();

  return (
    <div className="info-bar">
      {(props.tokenUsd[0] * props.tokenLockedTotal[0] > 0 || props.tokenUsd[1] * props.tokenLockedTotal[1] > 0) && (
        <div className="container">
          <div className="row">
            <p>
              <strong>{(props.tokenLockedTotal[0]).toLocaleString('en-US', { maximumFractionDigits: 0 })}</strong> {token1.ticker} and <strong>{(props.tokenLockedTotal[1]).toLocaleString('en-US', { maximumFractionDigits: 0 })}</strong> {token2.ticker} locked in creator pools
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfoBar;
