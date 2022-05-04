import React, { FC } from 'react';

type BarType = {
  tokenUsd: number,
  tokenLockedTotal: number,
}

const InfoBar: FC<BarType> = (props: BarType) => (
  <div className="info-bar">
    {(props.tokenUsd * props.tokenLockedTotal > 0) && (
      <div className="container">
        <div className="row">
          <p>
            <strong>{(props.tokenLockedTotal).toLocaleString('en-US', { maximumFractionDigits: 0 })}</strong> TVL
            - total SWAY locked in creator pools
          </p>
        </div>
      </div>
    )}
  </div>
);

export default InfoBar;
