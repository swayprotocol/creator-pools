import React from 'react';

const Footer = () => (
  <footer className="footer-section mb-4">
    <div className="container">
      <div className="row">
        <ul>
          <li>
            (c) {(new Date).getFullYear()} Sway Social
          </li>
          <li>
            <a href="https://swaysocial.org" rel="noreferrer" target="_blank">
              https://swaysocial.org
            </a>
          </li>
          <li>
            <a href="https://github.com/swayprotocol" rel="noreferrer" target="_blank">
              Github
            </a>
          </li>
          <li>
            <a href="https://t.me/swayprotocol" rel="noreferrer" target="_blank">
              Telegram
            </a>
          </li>
          <li>
            <a href="https://twitter.com/swayprotocol" rel="noreferrer" target="_blank">
              Twitter
            </a>
          </li>
        </ul>
      </div>
      <div className="row mt-3">
        <div className="col-12 footer-tos">
          The website is maintained by 721Labs Technology Group Limited. The website is maintained solely to enable analytical insight and allow interaction with the Sway Social protocol.
          An indication of any creator on this website does not implicate that a particular creator is anyhow affiliated with 721Labs or that 721Labs has anyhow endorsed such creator.
          Neither does an indication of any creator on the website suggest that a particular creator has endorsed 721Labs, any project of 721Labs or Sway Social.
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
