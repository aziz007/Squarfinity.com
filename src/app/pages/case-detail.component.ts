import { Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { PROJECTS } from '../data/content';
import { setSeo } from '../services/seo';

@Component({
  selector: 'sf-case-detail',
  imports: [RouterLink],
  template: `
    @if (project(); as p) {
      <section class="page-hero"><div class="wrap">
        <div class="crumb"><a routerLink="/portfolio">Portfolio</a> / {{ p.title }}</div>
        <span class="tag">{{ p.cats.join(' · ') }}</span>
        <h1>{{ p.title }}</h1>
        <p class="muted" style="margin-top:8px">Client: {{ p.client }}</p>
      </div></section>

      <section style="padding-top:20px"><div class="wrap">
        <div class="thumb big">{{ p.icon }}</div>
        <p class="notice">Replace this placeholder with real screenshots.</p>
      </div></section>

      <section><div class="wrap grid g2">
        <div class="card"><h3>The problem</h3><p class="muted">{{ p.problem }}</p></div>
        <div class="card"><h3>Our solution</h3><p class="muted">{{ p.solution }}</p></div>
      </div></section>

      <section class="alt"><div class="wrap">
        <h2>Results</h2>
        <div class="grid g3" style="margin-top:32px">
          @for (r of p.results; track r[1]) {
            <div class="card"><div class="big-num">{{ r[0] }}</div><p class="muted">{{ r[1] }}</p></div>
          }
        </div>
        <div class="card" style="margin-top:32px"><h3>Tools & tech</h3><p class="muted">{{ p.tools.join(' · ') }}</p></div>
      </div></section>

      <section><div class="wrap split">
        <div class="card">
          <p class="quote">“{{ p.quote }}”</p>
          <cite class="cite">{{ p.who }}</cite>
        </div>
        <div class="card center">
          <h3>Want similar results?</h3>
          <p class="muted" style="margin:10px 0 22px">Tell us about your project and we'll outline a plan.</p>
          <a routerLink="/consult" class="btn btn-primary">Book a Free Consultation →</a>
        </div>
      </div></section>
    } @else {
      <section class="page-hero"><div class="wrap"><h1>Case study not found</h1>
        <p class="lead"><a routerLink="/portfolio">Back to portfolio →</a></p></div></section>
    }
  `
})
export class CaseDetailComponent {
  private route = inject(ActivatedRoute);
  private title = inject(Title);
  private meta = inject(Meta);

  private id = toSignal(this.route.paramMap.pipe(map(p => p.get('id') ?? '')), { initialValue: '' });
  readonly project = computed(() => PROJECTS.find(p => p.id === this.id()));

  constructor() {
    effect(() => {
      const p = this.project();
      if (p) setSeo(this.title, this.meta, p.title, p.problem);
      else setSeo(this.title, this.meta, 'Case study not found', 'This case study does not exist.');
    });
  }
}
