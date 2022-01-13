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
    </div>
  </footer>
);

export default Footer;
