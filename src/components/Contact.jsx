import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Mail, Phone, MapPin, Download, Plus, Minus, MessageCircle, Link } from 'lucide-react';
import site from '../config/site.js';
import { GithubIcon, LinkedinIcon, InstagramIcon as Instagram, YoutubeIcon as Youtube } from './Icons.jsx';
import { asset, externalProps } from '../lib/utils.js';
import { useMotion, EASE } from '../hooks/useMotion.jsx';
import Reveal from './Reveal.jsx';
import Magnetic from './Magnetic.jsx';

function ContactRow({ icon, label, value, href, external }) {
  const inner = (
    <>
      <span className="ico">{icon}</span>
      <span>
        <small>{label}</small>
        <span>{value}</span>
      </span>
    </>
  );
  return <li>{href ? <a href={href} {...(external ? externalProps : {})}>{inner}</a> : <div className="static">{inner}</div>}</li>;
}

export default function Contact() {
  const { on } = useMotion();
  const { identity, contact, preferences } = site;
  const [formOpen, setFormOpen] = useState(false);
  const [values, setValues] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});

  const waDigits = contact.whatsapp.replace(/\D/g, '');
  const waHref = waDigits ? `https://wa.me/${waDigits}?text=${encodeURIComponent(`Hi ${identity.fullName}, I found your portfolio and would like to talk about a project.`)}` : '';

  const validate = () => {
    const e = {};
    if (!values.name.trim()) e.name = 'Please add your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) e.email = 'Please add a valid email.';
    if (values.message.trim().length < 10) e.message = 'Tell me a little more (10+ characters).';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    const subject = encodeURIComponent(`Portfolio enquiry from ${values.name}`);
    const body = encodeURIComponent(`${values.message}\n\n— ${values.name}\n${values.email}`);
    window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`;
  };

  const field = (key, label, type = 'text') => (
    <div className={`field ${key === 'message' ? 'full' : ''}`}>
      <label htmlFor={`f-${key}`}>{label}</label>
      {key === 'message' ? (
        <textarea id={`f-${key}`} rows={5} value={values[key]} onChange={(e) => setValues({ ...values, [key]: e.target.value })} aria-invalid={Boolean(errors[key])} aria-describedby={errors[key] ? `e-${key}` : undefined} />
      ) : (
        <input id={`f-${key}`} type={type} value={values[key]} onChange={(e) => setValues({ ...values, [key]: e.target.value })} aria-invalid={Boolean(errors[key])} aria-describedby={errors[key] ? `e-${key}` : undefined} autoComplete={key} />
      )}
      {errors[key] && (
        <span id={`e-${key}`} className="err" role="alert">
          {errors[key]}
        </span>
      )}
    </div>
  );

  return (
    <section id="contact" className="section" aria-labelledby="contact-title">
      <div className="container">
        <div className="contact-grid">
          <Reveal>
            <p className="kicker">
              <span className="num">04</span> / Your next project
            </p>
            <h2 id="contact-title" className="section-title display">
              Let&rsquo;s build <span className="accent-dot">together</span>
            </h2>
            <p className="lead">Got a model to train, a vision system to ship or a role to fill? Let&rsquo;s make something that actually works.</p>
            <div className="hero-cta">
              <Magnetic>
                <a href={`mailto:${contact.email}`} className="btn btn-ghost">
                  <span className="ico">
                    <ArrowUpRight />
                  </span>
                  Start a conversation
                </a>
              </Magnetic>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <ul className="contact-list" aria-label="Contact details">
              <ContactRow icon={<Mail />} label="Email" value={contact.email} href={`mailto:${contact.email}`} />
              {contact.phone && <ContactRow icon={<Phone />} label="Phone" value={contact.phone} href={`tel:${contact.phone.replace(/[^\d+]/g, '')}`} />}
              {waHref && <ContactRow icon={<MessageCircle />} label="WhatsApp" value={`+${waDigits}`} href={waHref} external />}
              {contact.linkedin && <ContactRow icon={<LinkedinIcon width={15} height={15} />} label="LinkedIn" value={identity.fullName} href={contact.linkedin} external />}
              {contact.github && <ContactRow icon={<GithubIcon width={15} height={15} />} label="GitHub" value={contact.githubHandle || contact.github} href={contact.github} external />}
              {contact.instagram && <ContactRow icon={<Instagram />} label="Instagram" value={contact.instagram.replace(/^https?:\/\/(www\.)?instagram\.com\//, '@')} href={contact.instagram} external />}
              {contact.youtube && <ContactRow icon={<Youtube />} label="YouTube" value="Channel" href={contact.youtube} external />}
              {contact.otherLinks.map((l) => (
                <ContactRow key={l.url} icon={<Link />} label={l.label} value={l.url.replace(/^https?:\/\//, '')} href={l.url} external />
              ))}
              {identity.location && <ContactRow icon={<MapPin />} label="Based in" value={identity.location} />}
            </ul>
          </Reveal>

          {preferences.showDownloadResume && identity.resume && (
            <Reveal className="resume-card" delay={0.14}>
              <p className="kicker">Résumé</p>
              <h3 className="display">
                Build
                <br />
                <span className="accent">smarter.</span>
              </h3>
              <p className="hand">Everything on one page.</p>
              <a href={asset(identity.resume)} className="btn btn-primary" {...externalProps}>
                Download CV <Download />
              </a>
            </Reveal>
          )}
        </div>

        {preferences.showContactForm && (
          <div className="form-row">
            <button type="button" className="form-toggle" aria-expanded={formOpen} aria-controls="contact-form" onClick={() => setFormOpen((v) => !v)}>
              Tell me about your project
              <span className="tog" aria-hidden="true">
                {formOpen ? <Minus /> : <Plus />}
              </span>
            </button>
            <AnimatePresence initial={false}>
              {formOpen && (
                <motion.form
                  id="contact-form"
                  className="form"
                  noValidate
                  onSubmit={submit}
                  initial={on ? { height: 0, opacity: 0 } : false}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={on ? { height: 0, opacity: 0 } : undefined}
                  transition={{ duration: 0.45, ease: EASE }}
                >
                  <div className="fields">
                    {field('name', 'Your name')}
                    {field('email', 'Your email', 'email')}
                    {field('message', 'What are you building?')}
                    <div className="field full actions">
                      <button type="submit" className="btn btn-primary">
                        Send via email <ArrowUpRight />
                      </button>
                      <span className="note">Opens your email app with the message pre-filled. Nothing is sent from this page itself.</span>
                    </div>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}
