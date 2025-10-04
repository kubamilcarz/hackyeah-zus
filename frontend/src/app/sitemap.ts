export const dynamic = 'force-static';
export default function sitemap() {
  const base = '/';

  return [
    { url: `${base}/`,               lastModified: new Date() },
    { url: `${base}/simulator/`,      lastModified: new Date() },
    { url: `${base}/results/`,          lastModified: new Date() },
  ];
}