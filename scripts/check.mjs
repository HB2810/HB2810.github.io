// Content sanity check: run before building so placeholders or broken
// config never reach the live site.  `npm run check`
import site from '../src/config/site.js';
import projects from '../src/data/projects.js';
import { experience, education, awards } from '../src/data/experience.js';

const problems = [];
const placeholder = /\[[A-Z][A-Z /&+-]{2,}\]|Add your detailed description/;

function scan(value, path) {
  if (typeof value === 'string') {
    if (placeholder.test(value)) problems.push(`${path}: still contains a placeholder → "${value}"`);
  } else if (Array.isArray(value)) {
    value.forEach((v, i) => scan(v, `${path}[${i}]`));
  } else if (value && typeof value === 'object') {
    Object.entries(value).forEach(([k, v]) => scan(v, `${path}.${k}`));
  }
}

scan(site, 'site');
scan(projects, 'projects');
scan({ experience, education, awards }, 'experience');

const required = ['fullName', 'displayName', 'profession', 'headline', 'intro'];
for (const key of required) {
  if (!site.identity[key]) problems.push(`site.identity.${key} is required`);
}
if (!site.contact.email) problems.push('site.contact.email is required');
if (!/^https?:\/\//.test(site.websiteUrl)) problems.push('site.websiteUrl must be an absolute URL');

const ids = new Set();
for (const p of projects) {
  if (!p.id || !p.title || !p.category || !p.summary) problems.push(`project "${p.title || p.id}" is missing id/title/category/summary`);
  if (ids.has(p.id)) problems.push(`duplicate project id "${p.id}"`);
  ids.add(p.id);
  for (const key of ['liveUrl', 'sourceUrl', 'videoUrl']) {
    if (p[key] && !/^https:\/\//.test(p[key])) problems.push(`project "${p.id}".${key} should be an https URL`);
  }
}
if (site.contact.whatsapp && !/^\d{8,15}$/.test(site.contact.whatsapp)) {
  problems.push('site.contact.whatsapp must be international digits only (no +, spaces or dashes)');
}

if (problems.length) {
  console.error('\nContent check failed:\n');
  problems.forEach((p) => console.error('  • ' + p));
  console.error('');
  process.exit(1);
}
console.log(`Content check passed: ${projects.length} projects, ${experience.length} roles, ${education.length} education, ${awards.length} awards.`);
