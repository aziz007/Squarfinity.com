import { Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { ProjectCardComponent } from '../components/project-card.component';
import { PROJECTS, SERVICES } from '../data/content';
import { setSeo } from '../services/seo';

@Component({
  selector: 'sf-service-detail',
  imports: [RouterLink, ProjectCardComponent],
  template: `
    @if (service(); as s) {
      <section class="page-hero"><div class="wrap">
        <div class="crumb"><a routerLink="/services">Services</a> / {{ s.name }}</div>
        <span class="eyebrow">{{ s.icon }} {{ s.name }}</span>
        <h1>{{ s.short }}</h1>
        <p class="lead" style="margin-top:18px"><strong class="white">The problem:</strong> {{ s.problem }}</p>
        <div class="btns">
          <a routerLink="/consult" class="btn btn-primary">Book a Free Consultation →</a>
          <a routerLink="/portfolio" class="btn btn-ghost">See related work</a>
        </div>
      </div></section>

      <section style="padding-top:20px"><div class="wrap split">
        <div>
          <h2>What's included</h2>
          <ul class="check" style="margin-top:20px">
            @for (i of s.includes; track i) { <li>{{ i }}</li> }
          </ul>
        </div>
        <div class="card">
          <h3>Our process</h3>
          @for (step of s.process; track step[0]; let i = $index) {
            <div style="margin-top:16px">
              <strong class="accent">0{{ i + 1 }} · {{ step[0] }}</strong>
              <p class="muted">{{ step[1] }}</p>
            </div>
          }
        </div>
      </div></section>

      <section class="alt"><div class="wrap">
        <h2>Related projects</h2>
        <div class="grid g2" style="margin-top:32px">
          @for (p of related(); track p.id) { <sf-project-card [project]="p" /> }
        </div>
      </div></section>

      <section><div class="wrap split">
        <div><span class="eyebrow">FAQ</span><h2>Common questions</h2></div>
        <div class="faq">
          @for (f of s.faqs; track f[0]) {
            <details><summary>{{ f[0] }}</summary><p>{{ f[1] }}</p></details>
          }
        </div>
      </div></section>

      <section class="alt"><div class="wrap"><div class="cta-band">
        <h2>Ready to start with {{ s.name }}?</h2>
        <p class="lead" style="margin:0 auto 26px">Get a clear scope, timeline and quote, free of charge.</p>
        <div class="btns" style="justify-content:center;margin-top:0">
          <a routerLink="/consult" class="btn btn-primary">Book a Free Consultation →</a>
          <a routerLink="/quote" class="btn btn-ghost">Get a Project Quote</a>
        </div>
      </div></div></section>
    } @else {
      <section class="page-hero"><div class="wrap"><h1>Service not found</h1>
        <p class="lead"><a routerLink="/services">Browse all services →</a></p></div></section>
    }
  `
})
export class ServiceDetailComponent {
  private route = inject(ActivatedRoute);
  private title = inject(Title);
  private meta = inject(Meta);

  private slug = toSignal(this.route.paramMap.pipe(map(p => p.get('slug') ?? '')), { initialValue: '' });
  readonly service = computed(() => SERVICES.find(s => s.slug === this.slug()));
  readonly related = computed(() => {
    const s = this.service();
    return s ? PROJECTS.filter(p => s.projects.includes(p.id)) : [];
  });

  constructor() {
    effect(() => {
      const s = this.service();
      if (s) setSeo(this.title, this.meta, s.name, s.short);
      else setSeo(this.title, this.meta, 'Service not found', 'This service does not exist.');
    });
  }
}
