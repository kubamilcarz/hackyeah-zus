export const dynamic = 'force-static';

export default function robots() {
  const base = '/';
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}