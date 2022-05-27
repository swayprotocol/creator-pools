import React from 'react';
import { useConfig } from '../contexts/Config';
import globalConfigData from "../config.json";

const Footer = () => {
  const { site } = useConfig();

  return (
    <footer>
      <div className={"d-flex"}>
        <div className={"footer-column col-6"}>
          <div className={"footer-heading"}>
            TokenTraxx
          </div>
          <div className={"footer-description"}>
            Own your sound
          </div>
        </div>
        <div className={"footer-column col-3"}>
          <div className={"footer-paragraph"}>
            <div className={"footer-subheading"}>
                Our community
            </div>
              <ul>
                <li>Terms of use</li>
                <li>Privacy policy</li>
                <li>Contact us</li>
                <li>FAQs</li>
              </ul>
          </div>
        </div>
          <div className={"footer-column col-3"}>
            <div className={"footer-paragraph"}>
              <div className={"footer-subheading"}>
                Connect with us
              </div>
                <ul>
                  <li><img src={globalConfigData.site.footer.twitter_logo} alt={"twitter_logo"} height="18"/>Twitter</li>
                  <li><img src={globalConfigData.site.footer.discord_logo} alt={"discord_logo"} height="18"/>Discord</li>
                  <li><img src={globalConfigData.site.footer.telegram_logo} alt={"telegram_logo"} height="18"/>Telegram</li>
                  <li><img src={globalConfigData.site.footer.medium_logo} alt={"medium_logo"} height="18"/>Medium</li>
                </ul>
            </div>
          </div>
        </div>
      <div className={"footer-copyright"}>
        Copyright 2022@TokenTraxx
      </div>
    </footer>
  );
};

export default Footer;
