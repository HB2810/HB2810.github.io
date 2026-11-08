/** Prefix a public asset path with the Vite base URL. */
export function asset(path) {
  if (!path) return '';
  if (/^https?:\/\//.test(path)) return path;
  return import.meta.env.BASE_URL + path.replace(/^\/+/, '');
}

export const pad = (n) => String(n).padStart(2, '0');

/** Small deterministic hash for generated covers. */
export function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Extract a YouTube video id from common URL shapes. */
export function youtubeId(url) {
  if (!url) return '';
  const m = url.match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : '';
}

export const externalProps = { target: '_blank', rel: 'noopener noreferrer' };
