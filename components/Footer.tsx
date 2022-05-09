import React from 'react';
import { useConfig } from '../contexts/Config';

const Footer = () => {
  const { site } = useConfig();

  return (
    <footer className="footer-section mb-4">
      <div className="container">
        <div className="row">
          <ul>
            <li>
              (c) {(new Date).getFullYear()} {site.author}
            </li>
            {site.footer.links?.map(link => (
              <li key={link.url}>
                <a href={link.url} rel="noreferrer" target="_blank">
                  {link.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="row mt-3">
          <div className="col-12 footer-tos">
            {site.footer.colophon}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
