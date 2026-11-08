import React from 'react';
import site from '../config/site.js';
import { education } from '../data/experience.js';
import { pad } from '../lib/utils.js';
import Reveal from './Reveal.jsx';

export default function About() {
  const { identity, skills, tools, processSteps, interests, preferences } = site;
  const showEdu = preferences.showEducation && education.length > 0;

  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <div className="container">
        <Reveal className="section-head">
          <div>
            <p className="kicker">
              <span className="num">02</span> / Behind the craft
            </p>
            <h2 id="about-title" className="section-title display">
              More than code.
              <br />
              <span className="accent-dot">Making machines see</span>
            </h2>
          </div>
        </Reveal>

        <div className="about-grid">
          <div>
            <Reveal className="bio">
              {identity.about.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </Reveal>

            <div className="about-cols">
              {skills.length > 0 && (
                <Reveal delay={0.05}>
                  <h3>Expertise &amp; skills</h3>
                  {skills.map((g) => (
                    <div className="skill-group" key={g.group}>
                      <b>{g.group}</b>
                      <ul className="chip-row">
                        {g.items.map((s) => (
                          <li key={s} className="chip">
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </Reveal>
              )}
              {showEdu && (
                <Reveal delay={0.1}>
                  <h3>Education &amp; learning</h3>
                  {education.map((e) => (
                    <div className="edu-item" key={e.id}>
                      <b>{e.title}</b>
                      <span>{e.organization}</span>
                      {e.description && <span>{e.description}</span>}
                      <span className="period">{e.period}</span>
                    </div>
                  ))}
                  {interests?.length > 0 && (
                    <div className="interests" style={{ marginTop: 28 }}>
                      <h3>Off the keyboard</h3>
                      <ul className="chip-row">
                        {interests.map((i) => (
                          <li key={i} className="chip">
                            {i}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Reveal>
              )}
            </div>

            {tools.length > 0 && (
              <Reveal className="toolkit" delay={0.1}>
                <h3>Creative &amp; tech toolkit</h3>
                <ul className="chip-row">
                  {tools.map((t) => (
                    <li key={t} className="chip">
                      {t}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}
          </div>

          <div className="about-right">
            {preferences.showProcess && processSteps.length > 0 && (
              <Reveal className="process" delay={0.1}>
                <h3>From problem to shipped</h3>
                <ol>
                  {processSteps.map((s, i) => (
                    <li key={s.title}>
                      <span className="n">{pad(i + 1)}</span>
                      <div>
                        <b>{s.title}</b>
                        <p>{s.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </Reveal>
            )}
            <Reveal className="quote-panel" delay={0.15}>
              <span className="mark" aria-hidden="true">
                &ldquo;
              </span>
              <p className="q">From mathematical theory to production systems.</p>
              <p className="sig hand">{identity.fullName}</p>
              <p className="foot">
                Let&rsquo;s build
                <br />
                something intelligent. ✳
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
