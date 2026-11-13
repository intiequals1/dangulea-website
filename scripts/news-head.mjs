import { SITE } from './news-core.mjs'

export function articleHead(article) {
  const description = article.shareDescription ?? article.description
  const title = article.shareTitle ?? article.title
  const escape = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character])
  const tags = {
    'og:type': 'article', 'og:title': title, 'og:description': description,
    'og:url': article.url, 'og:site_name': 'Claudiu Dangulea', 'og:locale': 'de_AT',
    'og:image': `${SITE}${article.ogImage}`, 'og:image:secure_url': `${SITE}${article.ogImage}`,
    'og:image:type': 'image/png', 'og:image:width': '1200', 'og:image:height': '630',
    'og:image:alt': article.og?.og_alt ?? article.title, 'article:published_time': article.date,
    'article:author': `${SITE}/person`,
  }
  const ld = {
    '@context': 'https://schema.org', '@type': 'NewsArticle', headline: article.title,
    description, url: article.url, mainEntityOfPage: article.url,
    image: [`${SITE}${article.ogImage}`], datePublished: article.date, inLanguage: 'de-AT',
    author: { '@type': 'Person', name: 'Claudiu Dangulea', url: `${SITE}/person` },
  }
  // Escape '<' in JSON as well: an untrusted headline must not close the script.
  const json = JSON.stringify(ld).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026')
  return `<title>${escape(title)} · Claudiu Dangulea</title>
<link rel="canonical" href="${escape(article.url)}" />
<meta name="description" content="${escape(description)}" />
<meta name="author" content="Claudiu Dangulea" />
${Object.entries(tags).map(([property, value]) => `<meta property="${property}" content="${escape(value)}" />`).join('\n')}
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${escape(title)}" />
<meta name="twitter:description" content="${escape(description)}" />
<meta name="twitter:image" content="${escape(SITE + article.ogImage)}" />
<script type="application/ld+json">${json}</script>`
}
