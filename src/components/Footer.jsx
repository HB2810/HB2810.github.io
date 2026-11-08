import React from 'react';
import { ArrowUp, Mail } from 'lucide-react';
import site from '../config/site.js';
import { GithubIcon, LinkedinIcon, InstagramIcon as Instagram, YoutubeIcon as Youtube } from './Icons.jsx';
import { externalProps } from '../lib/utils.js';

export default function Footer() {
  const { identity, contact } = site;
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <a href="#top" className="wordmark" aria-label="Back to top">
          {identity.displayName}
          <span className="dot" aria-hidden="true" />
        </a>
        <p className="copy">
          © {year} {identity.fullName} · {identity.profession}
        </p>
        <nav className="socials" aria-label="Social links">
          {contact.github && (
            <a href={contact.github} aria-label="GitHub" {...externalProps}>
              <GithubIcon />
            </a>
          )}
          {contact.linkedin && (
            <a href={contact.linkedin} aria-label="LinkedIn" {...externalProps}>
              <LinkedinIcon />
            </a>
          )}
          {contact.instagram && (
            <a href={contact.instagram} aria-label="Instagram" {...externalProps}>
              <Instagram />
            </a>
          )}
          {contact.youtube && (
            <a href={contact.youtube} aria-label="YouTube" {...externalProps}>
              <Youtube />
            </a>
          )}
          <a href={`mailto:${contact.email}`} aria-label="Email">
            <Mail />
          </a>
          <a href="#top" aria-label="Back to top">
            <ArrowUp />
          </a>
        </nav>
      </div>
    </footer>
  );
}
