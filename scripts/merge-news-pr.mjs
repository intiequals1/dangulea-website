import { execFileSync } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

const repository = 'intiequals1/dangulea-website';
const checkName = 'Build and validate every news article';
const newsFiles = new Set([
  'public/news-updates.json',
  'data/news-archive.json',
  'data/news-fact-checks.json',
]);
const [number, expectedHead, ...options] = process.argv.slice(2);
const checkOnly = options.length === 1 && options[0] === '--check-only';

function github(...args) {
  return JSON.parse(execFileSync('gh', args, { encoding: 'utf8', timeout: 45_000 }));
}

async function mergeWhenValidated() {
  if (!/^[1-9]\d*$/.test(number ?? '') || !/^[a-f0-9]{40}$/.test(expectedHead ?? '') || (options.length && !checkOnly)) {
    throw new Error('Aufruf: node scripts/merge-news-pr.mjs PR_NUMMER HEAD_SHA [--check-only]');
  }

  const deadline = Date.now() + 20 * 60_000;
  while (Date.now() < deadline) {
    const pr = github('pr', 'view', number, '--repo', repository, '--json',
      'url,state,isDraft,isCrossRepository,baseRefName,headRefName,headRefOid,files,statusCheckRollup,mergeCommit');

    if (pr.isCrossRepository || pr.baseRefName !== 'main' || !/^automation\/news\/\d{4}-\d{2}-\d{2}$/.test(pr.headRefName)) {
      throw new Error(`Unerwartete Branches für News-PR ${pr.url}.`);
    }
    if (pr.headRefOid !== expectedHead) {
      throw new Error(`Der Commit von ${pr.url} hat sich geändert. Erwartet: ${expectedHead}.`);
    }
    if (!pr.files.length || pr.files.some(({ path }) => !newsFiles.has(path))) {
      throw new Error(`Der PR ${pr.url} darf ausschließlich News-Dateien ändern.`);
    }
    if (pr.state === 'MERGED' && pr.mergeCommit?.oid) {
      return { pullRequest: pr.url, mergeSha: pr.mergeCommit.oid, alreadyMerged: true };
    }
    if (pr.state !== 'OPEN' || pr.isDraft) {
      throw new Error(`Der PR ${pr.url} muss offen und bereit zur Prüfung sein.`);
    }

    const checks = pr.statusCheckRollup.filter(check =>
      check.__typename === 'CheckRun' && check.name === checkName && check.workflowName === 'Deploy');
    if (checks.length > 1) {
      throw new Error(`Mehrdeutiges Prüfergebnis für ${pr.url}.`);
    }
    const [check] = checks;
    if (check?.status === 'COMPLETED') {
      if (check.conclusion !== 'SUCCESS') {
        throw new Error(`${checkName}: ${check.conclusion}. Der PR bleibt offen. ${check.detailsUrl}`);
      }
      const runId = check.detailsUrl.match(/\/actions\/runs\/(\d+)\/job\/\d+$/)?.[1];
      if (!runId) throw new Error(`Unbekannter Prüflauf für ${pr.url}.`);
      const run = github('api', `repos/${repository}/actions/runs/${runId}`);
      if (run.event !== 'pull_request' || run.path !== '.github/workflows/deploy.yml' ||
          run.head_sha !== expectedHead || run.head_branch !== pr.headRefName || run.head_repository?.full_name !== repository) {
        throw new Error(`Der Prüflauf ${run.html_url} gehört nicht zum erwarteten News-Commit.`);
      }
      if (run.status === 'completed') {
        if (run.conclusion !== 'success') throw new Error(`Der Prüflauf war nicht erfolgreich: ${run.html_url}`);
        if (checkOnly) return { pullRequest: pr.url, validatedHead: expectedHead, checkUrl: check.detailsUrl };

        const merge = github('api', '--method', 'PUT', `repos/${repository}/pulls/${number}/merge`,
          '-f', `sha=${expectedHead}`, '-f', 'merge_method=merge');
        if (!merge.merged || !merge.sha) throw new Error(`Merge für ${pr.url} fehlgeschlagen: ${merge.message}`);
        return { pullRequest: pr.url, mergeSha: merge.sha, checkUrl: check.detailsUrl };
      }
    }
    await delay(15_000);
  }
  throw new Error(`Zeitlimit für ${checkName} in PR #${number} erreicht. Der PR bleibt offen.`);
}

try {
  console.log(JSON.stringify(await mergeWhenValidated()));
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
