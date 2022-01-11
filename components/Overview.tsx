import React from 'react';

const TVLdata = {
  tvl: 81233.65,
  usd: 4112.23,
  rewards: 0
}

const Overview = () => (
  <section className="my-5">
    <div className="container">
      <div className="row">
        <h2 className="mb-4">Overview</h2>
        <div className="col-12 col-sm-8">
          <div className="overview-item">
            <div className="overview-item-name">TVL</div>
            <div className="overview-item-value">${TVLdata.usd}</div>
            <div className="overview-item-name">{TVLdata.tvl} SWAY</div>
          </div>
          <div className="overview-item">
            <div className="overview-item-name">APY MAX</div>
            <div className="overview-item-value">99%</div>
            <div className="overview-item-name">*promotional</div>
          </div>
          <div className="overview-item">
            <div className="overview-item-name">TOTAL REWARDS PAID</div>
            <div className="overview-item-value">{TVLdata.rewards} SWAY</div>
          </div>
        </div>
        <div className="col-12 col-sm-4">
          <div className="row">
            <div className="overview-item-title col-7">
              CHANNEL DISTRIBUTION
            </div>
            <div className="overview-item-channels col-5">
              <div className="overview-item-channels-item">
                Instagram 85%
              </div>
              {/*<div className="overview-item-channels-item">*/}
              {/*  ENS 9%*/}
              {/*</div>*/}
              <div className="overview-item-channels-item">
                TikTok 15%
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
