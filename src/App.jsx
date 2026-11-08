import React, { useCallback, useEffect, useMemo, useState } from 'react';
import site from './config/site.js';
import projects from './data/projects.js';
import { experience, education, awards } from './data/experience.js';
import { asset } from './lib/utils.js';
import { MotionProvider } from './hooks/useMotion.jsx';
import { useActiveSection } from './hooks/useActiveSection.js';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import ProjectGrid from './components/ProjectGrid.jsx';
import ProjectDialog from './components/ProjectDialog.jsx';
import About from './components/About.jsx';
import Journey from './components/Journey.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';

/** Fill <head> metadata from the config so nothing personal lives in index.html. */
function useDocumentMeta() {
  useEffect(() => {
    const { identity, contact, websiteUrl } = site;
    const title = `${identity.fullName} | ${identity.profession}`;
    const description = `${identity.headline} ${identity.intro}`;
    document.title = title;

    const set = (selector, attrs) => {
      let el = document.head.querySelector(selector);
      if (!el) {
        el = document.createElement(selector.startsWith('link') ? 'link' : 'meta');
        document.head.appendChild(el);
      }
      Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    };
    set('meta[name="description"]', { name: 'description', content: description });
    set('link[rel="canonical"]', { rel: 'canonical', href: websiteUrl });
    set('meta[property="og:title"]', { property: 'og:title', content: title });
    set('meta[property="og:description"]', { property: 'og:description', content: description });
    set('meta[property="og:type"]', { property: 'og:type', content: 'website' });
    set('meta[property="og:url"]', { property: 'og:url', content: websiteUrl });
    if (identity.portrait) set('meta[property="og:image"]', { property: 'og:image', content: new URL(asset(identity.portrait), websiteUrl).href });
    set('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary' });

    const ld = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: identity.fullName,
      jobTitle: identity.profession,
      url: websiteUrl,
      email: `mailto:${contact.email}`,
      address: identity.location ? { '@type': 'PostalAddress', addressLocality: identity.location } : undefined,
      sameAs: [contact.github, contact.linkedin, contact.instagram, contact.youtube].filter(Boolean),
    };
    let script = document.getElementById('ld-person');
    if (!script) {
      script = document.createElement('script');
      script.id = 'ld-person';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(ld);
  }, []);
}

export default function App() {
  useDocumentMeta();
  const [openProject, setOpenProject] = useState(null);
  const close = useCallback(() => setOpenProject(null), []);

  const { preferences } = site;
  const sections = useMemo(() => {
    const list = [];
    if (preferences.showProjectArchive || projects.length) list.push({ id: 'work', label: 'Work' });
    list.push({ id: 'about', label: 'About' });
    const hasJourney = (preferences.showExperience && experience.length) || (preferences.showEducation && education.length) || (preferences.showAwards && awards.length);
    if (hasJourney) list.push({ id: 'journey', label: 'Journey' });
    list.push({ id: 'contact', label: 'Contact' });
    return list;
  }, [preferences]);

  const ids = useMemo(() => ['top', ...sections.map((s) => s.id)], [sections]);
  const active = useActiveSection(ids);

  return (
    <MotionProvider>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header sections={sections} active={active} />
      <main id="main">
        <Hero onOpenProject={setOpenProject} />
        {sections.some((s) => s.id === 'work') && <ProjectGrid onOpen={setOpenProject} />}
        <About />
        {sections.some((s) => s.id === 'journey') && <Journey />}
        <Contact />
      </main>
      <Footer />
      <ProjectDialog project={openProject} onClose={close} />
    </MotionProvider>
  );
}
