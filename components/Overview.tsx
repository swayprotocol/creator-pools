import React from 'react';

const Overview = () => (
  <section className="overview-section">
    <div className="container">
      <div className="row">
        <h2>Overview</h2>
        <div className="col-12 col-sm-8">
          <div className="overview-item">
            <div className="overview-item-name">TVL</div>
            <div className="overview-item-value">$1,327,299</div>
            <div className="overview-item-name">31,299,322 SWAY</div>
          </div>
          <div className="overview-item">
            <div className="overview-item-name">APY MAX</div>
            <div className="overview-item-value">99%</div>
            <div className="overview-item-name">*promotional</div>
          </div>
          <div className="overview-item">
            <div className="overview-item-name">TOTAL REWARDS PAID{'   '}</div>
            <div className="overview-item-value">3,299 SWAY</div>
          </div>
        </div>
        <div className="col-12 col-sm-4">
          <div className="row">
            <div className="overview-item-title col-7">
              CHANNEL DISTRIBUTION
            </div>
            <div className="overview-item-channels col-5">
              <div className="overview-item-channels-item">
                Instagram 13%
              </div>
              <div className="overview-item-channels-item">
                ENS 9%
              </div>
              <div className="overview-item-channels-item">
                TikTok 2%
              </div>
              <div className="overview-item-channels-item">
                Wallet 1%
              </div>
              <div className="overview-item-channels-item">
                Other {'<'} 1%
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </section>
);

export default Overview;
