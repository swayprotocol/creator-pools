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
              {/* <strong>{(props.tokenLockedTotal).toLocaleString('en-US', { maximumFractionDigits: 0 })}</strong> TVL
              - total {token.ticker} locked in creator pools */}
              Creator pools are getting discontinued. Active staking plans will remain active by end of 2023. Read more about transition to Sway Protocol at <a href='https://swayprotocol.org' target='_blank' rel='noreferrer'>swayprotocol.org</a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfoBar;
