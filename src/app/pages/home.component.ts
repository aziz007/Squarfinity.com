import { Component, OnInit, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { ProjectCardComponent } from '../components/project-card.component';
import { RevealDirective } from '../directives/reveal.directive';
import { CLIENTS, PROJECTS, REGIONS, SERVICES, STATS, TESTIMONIALS } from '../data/content';
import { setSeo } from '../services/seo';

@Component({
  selector: 'sf-home',
  imports: [RouterLink, ProjectCardComponent, RevealDirective],
  template: `
    <section class="hero hero-grid"><div class="wrap">
      <span class="eyebrow" sfReveal>Software house · Digital marketing agency</span>
      <h1 sfReveal>We Build Software<br>and <span>Grow Brands</span></h1>
      <p class="lead big" sfReveal>A team of 10–15 specialists who design, build and market digital products for startups, SMBs and e-commerce brands across the US, UK, Europe and Asia.</p>
      <div class="btns" sfReveal>
        <a routerLink="/consult" class="btn btn-primary">Book a Free Consultation →</a>
        <a routerLink="/portfolio" class="btn btn-ghost">View Our Work</a>
      </div>

      @if (stats.length) {
        <div class="stats" sfReveal>
          @for (s of stats; track s[1]) {
            <div class="stat"><strong>{{ s[0] }}</strong><span>{{ s[1] }}</span></div>
          }
        </div>
      }
    </div></section>

    @if (clients.length) {
      <section style="padding:40px 0"><div class="wrap">
        <p class="logos" sfReveal>
          @for (c of clients; track c) { <span>{{ c }}</span> }
        </p>
      </div></section>
    }

    <section class="alt"><div class="wrap">
      <div class="center" sfReveal><span class="eyebrow">What we do</span><h2>Two teams. One goal: your growth.</h2></div>
      <div class="grid g2" style="margin-top:48px">
        @for (s of services; track s.slug) {
          <a [routerLink]="['/services', s.slug]" class="card" sfReveal>
            <div class="icon">{{ s.icon }}</div>
            <h3>{{ s.name }}</h3>
            <p class="muted">{{ s.short }}</p>
            <p class="link">Learn more →</p>
          </a>
        }
      </div>
    </div></section>

    <section><div class="wrap">
      <div class="center" sfReveal><span class="eyebrow">Where we work</span><h2>Serving clients across the US, UK, Europe and Asia</h2>
        <p class="lead">Remote-first delivery, so your team gets updates in your time zone.</p></div>
      <div class="grid g4" style="margin-top:44px">
        @for (r of regions; track r.name) {
          <div class="card region" sfReveal>
            <div class="icon">{{ r.icon }}</div>
            <h3>{{ r.name }}</h3>
            <p class="muted">{{ r.note }}</p>
          </div>
        }
      </div>
    </div></section>

    <section class="alt"><div class="wrap split">
      <div sfReveal><span class="eyebrow">Our process</span><h2>From idea to results, in four steps</h2>
        <p class="lead">No black boxes. You see progress every week and know what is happening and why.</p></div>
      <div class="grid" style="gap:18px">
        @for (step of process; track step[0]; let i = $index) {
          <div class="card" style="display:flex;gap:18px" sfReveal>
            <div class="big-num" style="font-size:1.6rem">0{{ i + 1 }}</div>
            <div><h3>{{ step[0] }}</h3><p class="muted">{{ step[1] }}</p></div>
          </div>
        }
      </div>
    </div></section>

    @if (featured.length) {
      <section><div class="wrap">
        <div style="display:flex;justify-content:space-between;align-items:end;flex-wrap:wrap;gap:20px">
          <div sfReveal><span class="eyebrow">Featured work</span><h2>Projects we're proud of</h2></div>
          <a routerLink="/portfolio" class="btn btn-ghost">All case studies →</a>
        </div>
        <div class="grid g2" style="margin-top:40px">
          @for (p of featured; track p.id) { <sf-project-card [project]="p" sfReveal /> }
        </div>
      </div></section>
    }

    @if (testimonials.length) {
      <section class="alt"><div class="wrap">
        <div class="center" sfReveal><span class="eyebrow">Testimonials</span><h2>What clients say</h2></div>
        <div class="grid g3" style="margin-top:44px">
          @for (t of testimonials; track t.who) {
            <div class="card" sfReveal>
              <p class="quote">“{{ t.quote }}”</p>
              <cite class="cite">{{ t.who }}</cite>
            </div>
          }
        </div>
      </div></section>
    }

    <section><div class="wrap">
      <div class="cta-band" sfReveal>
        <span class="eyebrow">Ready when you are</span>
        <h2>Let's build something people use.</h2>
        <p class="lead" style="margin:0 auto 28px">Book a 30-minute call. We'll review your goals and tell you honestly what we'd do.</p>
        <div class="btns" style="justify-content:center;margin-top:0">
          <a routerLink="/consult" class="btn btn-primary">Book a Free Consultation →</a>
          <a routerLink="/audit" class="btn btn-ghost">Get a Free Website Audit</a>
        </div>
      </div>
    </div></section>
  `
})
export class HomeComponent implements OnInit {
  private title = inject(Title);
  private meta = inject(Meta);

  readonly services = SERVICES;
  readonly regions = REGIONS;
  readonly stats = STATS;
  readonly clients = CLIENTS;
  readonly testimonials = TESTIMONIALS;
  readonly featured = PROJECTS.slice(0, 2);
  readonly process: [string, string][] = [
    ['Discover', 'We learn your goals, users and budget.'],
    ['Plan', 'We agree on scope, timeline and KPIs.'],
    ['Build & Launch', 'We ship in short cycles with weekly demos.'],
    ['Grow', 'We measure, optimize and scale what works.']
  ];

  ngOnInit() {
    setSeo(this.title, this.meta, 'Software House & Digital Marketing Agency',
      'SquarFinity builds custom software, mobile apps and e-commerce stores for clients in the US, UK, Europe and Asia, and grows them with SEO, paid ads and content.');
  }
}
