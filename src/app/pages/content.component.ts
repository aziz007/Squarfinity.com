import { Component, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { INDUSTRIES, POSTS, TEAM } from '../data/content';
import { setSeo } from '../services/seo';

type PageKey = 'about' | 'industries' | 'insights' | 'privacy' | 'terms';

const SEO: Record<PageKey, [string, string]> = {
  about: ['About us', 'Our story, values and team. A small team with high standards.'],
  industries: ['Industries we serve', 'E-commerce, fashion, real estate, healthcare, startups and B2B services.'],
  insights: ['Insights', 'Practical guides on software, marketing and growth.'],
  privacy: ['Privacy Policy', 'How SquarFinity collects and uses personal data.'],
  terms: ['Terms of Service', 'Terms for using the SquarFinity website and services.']
};

/** One component for the simple content pages, driven by route data `page`. */
@Component({
  selector: 'sf-content-page',
  imports: [RouterLink],
  template: `
    @switch (page()) {
      @case ('about') {
        <section class="page-hero"><div class="wrap split">
          <div>
            <span class="eyebrow">About us</span>
            <h1>A small team with big standards</h1>
            <p class="lead" style="margin-top:18px">SquarFinity started with a simple idea: software and marketing should work together. We build the product, then help you grow it.</p>
          </div>
          <div class="avatar-lg">SF</div>
        </div></section>

        <section style="padding-top:20px"><div class="wrap grid g3">
          <div class="card"><h3>Our mission</h3><p class="muted">Make great digital products and growth accessible to ambitious businesses of every size.</p></div>
          <div class="card"><h3>Our values</h3><p class="muted">Clarity over jargon. Honest timelines. Work we're proud to show.</p></div>
          <div class="card"><h3>Our promise</h3><p class="muted">You'll always know what we're doing, why, and what it's returning.</p></div>
        </div></section>

        <section class="alt"><div class="wrap">
          <div class="center"><span class="eyebrow">Our team</span><h2>The specialists behind your project</h2>
            <p class="lead">Replace the placeholders with real photos and names.</p></div>
          <div class="grid g4" style="margin-top:44px">
            @for (m of team; track m.initials) {
              <div class="card center">
                <div class="avatar">{{ m.initials }}</div>
                <h3>{{ m.name }}</h3>
                <p class="muted small">{{ m.role }}</p>
              </div>
            }
          </div>
        </div></section>
      }

      @case ('industries') {
        <section class="page-hero"><div class="wrap">
          <span class="eyebrow">Industries</span>
          <h1>Experience across the industries that matter to you</h1>
          <p class="lead" style="margin-top:18px">We understand the workflows, compliance needs and buyer journeys in each sector.</p>
        </div></section>
        <section style="padding-top:20px"><div class="wrap grid g3">
          @for (i of industries; track i[1]) {
            <a routerLink="/consult" class="card">
              <div class="icon">{{ i[0] }}</div>
              <h3>{{ i[1] }}</h3>
              <p class="muted">{{ i[2] }}</p>
            </a>
          }
        </div></section>
      }

      @case ('insights') {
        <section class="page-hero"><div class="wrap">
          <span class="eyebrow">Insights</span>
          <h1>Practical guides on software and growth</h1>
          <p class="lead" style="margin-top:18px">Articles to help you make better decisions about your product and marketing.</p>
        </div></section>
        <section style="padding-top:20px"><div class="wrap grid g2">
          @for (p of posts; track p.title) {
            <article class="card">
              <span class="tag">{{ p.tag }}</span>
              <h3>{{ p.title }}</h3>
              <p class="muted">{{ p.summary }}</p>
              <a routerLink="/guide" class="link">Get the free guide →</a>
            </article>
          }
        </div></section>
      }

      @case ('privacy') {
        <section class="page-hero"><div class="wrap narrow">
          <h1>Privacy Policy</h1>
          <p class="muted" style="margin-top:20px">Replace this with your legal privacy policy. Describe what data forms collect, how it is used, and how users can request deletion.</p>
        </div></section>
      }

      @case ('terms') {
        <section class="page-hero"><div class="wrap narrow">
          <h1>Terms of Service</h1>
          <p class="muted" style="margin-top:20px">Replace this with your terms of service, reviewed by a qualified lawyer.</p>
        </div></section>
      }
    }
  `
})
export class ContentPageComponent {
  private route = inject(ActivatedRoute);
  private title = inject(Title);
  private meta = inject(Meta);

  readonly page = toSignal(this.route.data.pipe(map(d => (d['page'] ?? 'about') as PageKey)), { initialValue: 'about' as PageKey });
  readonly team = TEAM;
  readonly industries = INDUSTRIES;
  readonly posts = POSTS;

  constructor() {
    effect(() => {
      const [t, d] = SEO[this.page()];
      setSeo(this.title, this.meta, t, d);
    });
  }
}
