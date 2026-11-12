import { mergePublicationPr } from './merge-publication-pr.mjs';

await mergePublicationPr({
  branchPattern: /^automation\/news\/\d{4}-\d{2}-\d{2}$/,
  allowedFiles: ['public/news-updates.json', 'data/news-archive.json', 'data/news-fact-checks.json'],
});
