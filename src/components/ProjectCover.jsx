import React from 'react';
import { asset, hash } from '../lib/utils.js';

/**
 * Project cover. Uses the real image when one is configured, otherwise
 * renders a deterministic abstract composition seeded by the project id so
 * every card looks different without inventing screenshots.
 */
export default function ProjectCover({ project, big = false }) {
  if (project.cover) {
    return (
      <img
        src={asset(project.cover)}
        alt={`${project.title} cover`}
        width={big ? 1600 : 800}
        height={big ? 700 : 600}
        loading={big ? 'eager' : 'lazy'}
        decoding="async"
      />
    );
  }

  const h = hash(project.id);
  const variant = h % 4;
  const rot = (h >> 4) % 360;
  const n = 6 + ((h >> 8) % 5);
  const initials = project.title
    .replace(/[^A-Za-z0-9 ]/g, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
  const W = 800;
  const H = big ? 350 : 600;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Abstract cover for ${project.title}`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`g-${project.id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#161515" />
          <stop offset="1" stopColor="#0c0b0b" />
        </linearGradient>
        <pattern id={`p-${project.id}`} width="28" height="28" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="rgba(242,239,235,0.14)" />
        </pattern>
      </defs>
      <rect width={W} height={H} fill={`url(#g-${project.id})`} />
      <rect width={W} height={H} fill={`url(#p-${project.id})`} />
      <g transform={`rotate(${rot} ${W * 0.62} ${H * 0.5})`} opacity="0.9">
        {variant === 0 &&
          Array.from({ length: n }).map((_, i) => (
            <circle key={i} cx={W * 0.62} cy={H * 0.5} r={40 + i * 42} fill="none" stroke={i % 3 === 0 ? 'var(--accent)' : 'rgba(242,239,235,0.18)'} strokeWidth={i % 3 === 0 ? 3 : 1.2} />
          ))}
        {variant === 1 &&
          Array.from({ length: n }).map((_, i) => (
            <rect key={i} x={W * 0.3 + i * 34} y={H * 0.12 + i * 18} width={220} height={220} fill="none" stroke={i === n - 1 ? 'var(--accent)' : 'rgba(242,239,235,0.16)'} strokeWidth={i === n - 1 ? 3 : 1.2} rx="4" />
          ))}
        {variant === 2 &&
          Array.from({ length: n * 2 }).map((_, i) => (
            <line key={i} x1={W * 0.25 + i * 30} y1={-50} x2={W * 0.05 + i * 30} y2={H + 50} stroke={i % 4 === 0 ? 'var(--accent)' : 'rgba(242,239,235,0.14)'} strokeWidth={i % 4 === 0 ? 2.5 : 1} />
          ))}
        {variant === 3 &&
          Array.from({ length: n }).map((_, i) => (
            <path key={i} d={`M ${W * 0.2} ${H * 0.9 - i * 36} Q ${W * 0.55} ${H * 0.1 - i * 20} ${W * 0.95} ${H * 0.75 - i * 30}`} fill="none" stroke={i === 0 ? 'var(--accent)' : 'rgba(242,239,235,0.16)'} strokeWidth={i === 0 ? 3 : 1.2} />
          ))}
      </g>
      <text x="40" y={H - 44} fontFamily="Anton, Impact, sans-serif" fontSize={big ? 150 : 170} fill="rgba(242,239,235,0.08)" letterSpacing="2">
        {initials}
      </text>
      <circle cx={W - 46} cy="46" r="7" fill="var(--accent)" />
    </svg>
  );
}
