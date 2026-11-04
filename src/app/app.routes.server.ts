import { RenderMode, ServerRoute } from '@angular/ssr';

// Every page is rendered on the server per request, so titles and meta tags
// are correct for each URL and lead data is always fresh.
export const serverRoutes: ServerRoute[] = [
  { path: '**', renderMode: RenderMode.Server }
];
