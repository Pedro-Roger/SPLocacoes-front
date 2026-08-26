// URL pública do site — usada em metadados, sitemap e robots.txt
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const SITE_URL = siteUrl || 'http://localhost:3000';
