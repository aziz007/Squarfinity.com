import { Meta, Title } from '@angular/platform-browser';

/** Sets the page <title> and meta description. Works during SSR and in the browser. */
export function setSeo(title: Title, meta: Meta, pageTitle: string, description: string) {
  title.setTitle(`${pageTitle} | SquarFinity`);
  meta.updateTag({ name: 'description', content: description });
}
