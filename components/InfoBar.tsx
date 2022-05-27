import React, { FC } from 'react';
import { useConfig } from '../contexts/Config';

type BarType = {
  tokenUsd: number,
  tokenLockedTotal: number,
}

const InfoBar: FC<BarType> = (props: BarType) => {
  const { token1 } = useConfig();

  return (
    <div className="info-bar">
      {(props.tokenUsd * props.tokenLockedTotal > 0) && (
        <div className="d-flex">
            <div className="info-column d-inline-block border border-white col-6">
              <div>
                <ul className={"d-inline"}>
                  <li>TokenTraxx</li>
                  <li>Discover</li>
                  <li>Artists</li>
                  <li>My NFTs</li>
                  <li>Creator Hub</li>
                </ul>
              </div>
            </div>
            <div className="info-column d-inline-block border border-white col-6">
              <div className={"myWallet"}>
                <a>
                  My wallet
                </a>
              </div>
            </div>

        </div>
      )}
    </div>
  );
};

export default InfoBar;
