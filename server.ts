import { AngularNodeAppEngine, createNodeRequestHandler, isMainModule, writeResponseToNodeResponse } from '@angular/ssr/node';
import { appendFile, mkdir } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import express, { NextFunction, Request, Response } from 'express';
import { ɵsetAngularAppEngineManifest as setAngularAppEngineManifest } from '@angular/ssr';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');
// Run `npm run serve:ssr:squarfinity` from the project root so this resolves to <project>/data
const leadsDir = resolve(process.cwd(), 'data');
const leadsFile = join(leadsDir, 'leads.ndjson');

// The build writes the SSR manifest next to this bundle. Load it at runtime on the
// first request (a variable path keeps the bundler from resolving it at build time).
const manifestFile = './angular-app-engine-manifest.mjs';
let enginePromise: Promise<AngularNodeAppEngine> | undefined;

function getEngine(): Promise<AngularNodeAppEngine> {
  enginePromise ??= import(new URL(manifestFile, import.meta.url).href).then(({ default: manifest }) => {
    setAngularAppEngineManifest(manifest);
    return new AngularNodeAppEngine();
  });
  return enginePromise;
}

const app = express();

app.disable('x-powered-by');
app.use(express.json({ limit: '50kb' }));

/* ---------- API ---------- */
const LEAD_TYPES = new Set(['consultation', 'audit', 'quote', 'guide', 'contact', 'ad-landing']);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.post(['/api/leads', '/api/leads.php'], async (req: Request, res: Response) => {
  const { type, data } = req.body ?? {};

  if (typeof type !== 'string' || !LEAD_TYPES.has(type) || !data || typeof data !== 'object') {
    return res.status(400).json({ ok: false, error: 'Invalid lead' });
  }

  const email = String(data.email ?? '').trim();
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ ok: false, error: 'A valid email is required' });
  }

  // Clean and cap every value so the stored record stays small.
  const fields = Object.entries(data)
    .filter(([k]) => k !== 'hp')
    .slice(0, 30)
    .map(([k, v]) => [k.slice(0, 50), String(v ?? '').trim().slice(0, 2000)] as const);

  const lead = {
    id: randomUUID(),
    type,
    ...Object.fromEntries(fields),
    receivedAt: new Date().toISOString()
  };

  try {
    await mkdir(leadsDir, { recursive: true });
    await appendFile(leadsFile, JSON.stringify(lead) + '\n', 'utf8');
  } catch (err) {
    console.error('Failed to save lead', err);
    return res.status(500).json({ ok: false, error: 'Could not save lead' });
  }

  // TODO: forward to your CRM or send an email notification here, e.g.
  // await fetch(process.env['CRM_WEBHOOK_URL']!, { method: 'POST', body: JSON.stringify(lead), headers: {'content-type':'application/json'} });

  return res.status(201).json({ ok: true });
});

app.use('/api', (_req, res) => res.status(404).json({ ok: false, error: 'Not found' }));

// Malformed JSON and other API errors get a JSON response instead of a stack trace
app.use('/api', (err: Error & { status?: number }, _req: Request, res: Response, _next: NextFunction) => {
  res.status(err.status ?? 400).json({ ok: false, error: 'Bad request' });
});

/* ---------- Static assets ---------- */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false
  })
);

/* ---------- Angular SSR ---------- */
app.use((req: Request, res: Response, next: NextFunction) => {
  getEngine()
    .then(engine => engine.handle(req))
    .then(response => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

if (isMainModule(import.meta.url)) {
  const port = Number(process.env['PORT']) || 4000;
  app.listen(port, () => {
    console.log(`SquarFinity running at http://localhost:${port}`);
  });
}

export const reqHandler = createNodeRequestHandler(app);
