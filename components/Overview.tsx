import React, { FC } from 'react';

type OverviewProps = {
  swayAmountTotal: number,
  swayUsd: number,
}

const Overview: FC<OverviewProps> = (props: OverviewProps) => (
  <section className="my-5">
    <div className="container">
      <div className="row">
        <h2 className="mb-4">Overview</h2>
        <div className="col-12 col-sm-8">
          <div className="overview-item">
            <div className="overview-item-name">TVL</div>
            <div className="overview-item-value">
              ${(props.swayAmountTotal * props.swayUsd).toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </div>
            <div className="overview-item-name">
              {props.swayAmountTotal.toLocaleString('en-US', { maximumFractionDigits: 0 })} SWAY
            </div>
          </div>
          <div className="overview-item">
            <div className="overview-item-name">APY MAX</div>
            <div className="overview-item-value">99%</div>
            <div className="overview-item-name">*promotional</div>
          </div>
          <div className="overview-item">
            <div className="overview-item-name">TOTAL REWARDS PAID</div>
            <div className="overview-item-value">0 SWAY</div>
          </div>
        </div>
        <div className="col-12 col-sm-4">
          <div className="row">
            <div className="overview-item-title col-7">
              CHANNEL DISTRIBUTION
            </div>
            <div className="overview-item-channels col-5">
              <div className="overview-item-channels-item">
                Instagram 91%
              </div>
              {/*<div className="overview-item-channels-item">*/}
              {/*  ENS 9%*/}
              {/*</div>*/}
              <div className="overview-item-channels-item">
                TikTok 9%
              </div>
              {/*<div className="overview-item-channels-item">*/}
              {/*  Wallet 1%*/}
              {/*</div>*/}
              {/*<div className="overview-item-channels-item">*/}
              {/*  Other {'<'} 1%*/}
              {/*</div>*/}
            </div>
          </div>

        </div>
      </div>
    </div>
  </section>
);

export default Overview;
