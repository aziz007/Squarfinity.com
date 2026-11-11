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
      <span class="eyebrow" sfReveal>AI workflow automation · Agentic AI · Custom software</span>
      <h1 sfReveal>We Build AI-Powered Workflows<br>and <span>Dependable Software</span></h1>
      <p class="lead big" sfReveal>A team of 10–15 specialists who automate repetitive work, connect your systems and deploy AI with the testing, approvals and monitoring a business can rely on. Working with clients across the US, UK, Europe and Asia.</p>
      <div class="btns" sfReveal>
        <a routerLink="/consult" class="btn btn-primary">Book an AI Workflow Assessment →</a>
        <a routerLink="/demo" class="btn btn-ghost">See a Workflow Demo</a>
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
        <p class="eyebrow center" style="display:block;text-align:center;margin-bottom:22px" sfReveal>Clients we have worked with</p>
        <div class="client-logos" sfReveal>
          @for (c of clients; track c.src) {
            <div class="client-logo" [style.background]="c.bg"><img [src]="c.src" [alt]="c.name" loading="lazy"></div>
          }
        </div>
      </div></section>
    }

    <section class="alt"><div class="wrap">
      <div class="center" sfReveal><span class="eyebrow">Solutions</span><h2>Seven ways we help you work smarter</h2>
        <p class="lead">Start with one process or one system. Each solution is scoped, built and measured on its own terms.</p></div>
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

    <section><div class="wrap split">
      <div sfReveal><span class="eyebrow">Engineering</span><h2>How we engineer AI</h2>
        <p class="lead">Every AI system follows the same discipline as our software: defined inputs, tested behaviour, controlled releases and monitoring after launch.</p>
        <div class="btns" style="margin-top:24px"><a routerLink="/engineering" class="btn btn-ghost">See our engineering approach →</a></div></div>
      <div class="grid" style="gap:14px">
        <div class="card" sfReveal><h3>Evaluation before launch</h3><p class="muted">Agreed test cases and acceptance criteria for accuracy and failure handling.</p></div>
        <div class="card" sfReveal><h3>Human approval for sensitive actions</h3><p class="muted">AI proposes, and a person approves anything that changes money, records or customers.</p></div>
        <div class="card" sfReveal><h3>Monitoring after launch</h3><p class="muted">Logs, error alerts and quality tracking so problems are seen early.</p></div>
      </div>
    </div></section>

    <section class="alt"><div class="wrap split">
      <div sfReveal><span class="eyebrow">Your data</span><h2>How we handle your data</h2>
        <p class="lead">Trust comes first when AI touches business information. We agree these points with you before any build starts.</p></div>
      <div class="grid" style="gap:14px">
        <div class="card" sfReveal><h3>Your data stays yours</h3><p class="muted">You own your data, code and accounts. We document each system so your team can run it without us.</p></div>
        <div class="card" sfReveal><h3>Access limited to the task</h3><p class="muted">Each workflow only sees the data it needs, with access controls and an audit trail of actions.</p></div>
        <div class="card" sfReveal><h3>Clear rules on AI training</h3><p class="muted">We confirm in writing how your data is used by any AI provider before a project starts.</p></div>
      </div>
    </div></section>

    @if (featured.length) {
      <section><div class="wrap">
        <div style="display:flex;justify-content:space-between;align-items:end;flex-wrap:wrap;gap:20px">
          <div sfReveal><span class="eyebrow">Featured work</span><h2>Projects we're proud of</h2></div>
          <a routerLink="/portfolio" class="btn btn-ghost">All case studies →</a>
        </div>
        <div class="grid g3" style="margin-top:40px">
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

    <section class="alt"><div class="wrap split">
      <div sfReveal><span class="eyebrow">Free download</span><h2>The AI Automation Starter Checklist</h2>
        <p class="lead">A 4-page PDF with seven steps to choose, scope and safely launch your first AI workflow. Written for business owners, not engineers.</p>
        <div class="btns" style="margin-top:24px"><a routerLink="/guide" class="btn btn-primary">Get the Free Checklist →</a></div></div>
      <div class="card" sfReveal>
        <h3>What's inside</h3>
        <ul class="check" style="margin-top:14px">
          <li>How to pick the right first workflow</li>
          <li>The data questions to ask any supplier</li>
          <li>Where a person should approve</li>
          <li>How to test before launch</li>
          <li>What to measure before and after</li>
        </ul>
      </div>
    </div></section>

    <section><div class="wrap">
      <div class="cta-band" sfReveal>
        <span class="eyebrow">Ready when you are</span>
        <h2>Find the first process worth automating.</h2>
        <p class="lead" style="margin:0 auto 28px">Book a 30-minute AI workflow assessment. We'll map your most repetitive work and tell you honestly where AI fits and where it doesn't.</p>
        <div class="btns" style="justify-content:center;margin-top:0">
          <a routerLink="/consult" class="btn btn-primary">Book an AI Workflow Assessment →</a>
          <a routerLink="/contact" class="btn btn-ghost">Talk to Our Team</a>
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
  readonly featured = PROJECTS.slice(0, 3);
  readonly process: [string, string][] = [
    ['Discover', 'We learn your goals, users and budget.'],
    ['Plan', 'We agree on scope, timeline and KPIs.'],
    ['Build & Launch', 'We ship in short cycles with weekly demos.'],
    ['Grow', 'We measure, optimize and scale what works.']
  ];

  ngOnInit() {
    setSeo(this.title, this.meta, 'AI Workflow Automation & Software Engineering',
      'SquarFinity builds AI-powered workflows, agentic AI assistants, CRM automation and custom software for clients in the US, UK, Europe and Asia.');
  }
}
