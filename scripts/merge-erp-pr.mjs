import { mergePublicationPr } from './merge-publication-pr.mjs';

await mergePublicationPr({
  branchPattern: /^automation\/erp\/\d{4}-\d{2}-\d{2}$/,
  allowedFiles: ['public/current-topics.json'],
});
