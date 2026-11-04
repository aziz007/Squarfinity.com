import { RenderMode, ServerRoute } from '@angular/ssr';
import { PROJECTS, SERVICES } from './data/content';

// Every page is pre-rendered to static HTML at build time, so the site can be
// hosted on plain shared hosting (no Node.js needed). Lead forms post to api/leads.php.
export const serverRoutes: ServerRoute[] = [
  {
    path: 'services/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => SERVICES.map(s => ({ slug: s.slug }))
  },
  {
    path: 'portfolio/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => PROJECTS.map(p => ({ id: p.id }))
  },
  {
    path: 'thanks/:type',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => ['consultation', 'audit', 'quote', 'guide', 'contact', 'ad-landing'].map(type => ({ type }))
  },
  { path: '**', renderMode: RenderMode.Prerender }
];
