import { Component, OnInit, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { setSeo } from '../services/seo';

@Component({
  selector: 'sf-not-found',
  imports: [RouterLink],
  template: `
    <section class="page-hero"><div class="wrap center">
      <h1>Page not found</h1>
      <p class="lead" style="margin:18px auto 28px">The page you're looking for doesn't exist.</p>
      <a routerLink="/" class="btn btn-primary">Back to Home</a>
    </div></section>
  `
})
export class NotFoundComponent implements OnInit {
  private title = inject(Title);
  private meta = inject(Meta);

  ngOnInit() {
    setSeo(this.title, this.meta, 'Page not found', 'The page you are looking for does not exist.');
  }
}
