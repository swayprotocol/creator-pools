import React, { FC } from 'react';

type BarType = {
  swayUsd: number,
  swayLockedTotal: number,
}

const InfoBar: FC<BarType> = (props: BarType) => (
  <div className="info-bar">
    {(props.swayUsd * props.swayLockedTotal > 0) && (
      <div className="container">
        <div className="row">
          <p>
            <strong>${(props.swayLockedTotal * props.swayUsd).toLocaleString('en-US', { maximumFractionDigits: 0 })}</strong> TVL
            - total $SWAY locked in creator pools
          </p>
        </div>
      </div>
    )}
  </div>
);

export default InfoBar;
