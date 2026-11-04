import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { ProjectCardComponent } from '../components/project-card.component';
import { RevealDirective } from '../directives/reveal.directive';
import { PROJECTS } from '../data/content';
import { setSeo } from '../services/seo';

const FILTERS = ['All', 'Web', 'Mobile', 'SaaS', 'E-commerce', 'Marketing', 'AI'];

@Component({
  selector: 'sf-portfolio-list',
  imports: [RouterLink, ProjectCardComponent, RevealDirective],
  template: `
    <section class="page-hero hero-grid"><div class="wrap">
      <span class="eyebrow" sfReveal>Portfolio</span>
      <h1 sfReveal>Case studies with real results</h1>
      <p class="lead" style="margin-top:18px" sfReveal>Problem, solution and measurable outcomes for every project.</p>
      @if (projects.length) {
        <div class="filters">
          @for (f of filters; track f) {
            <button class="chip" [class.on]="active() === f" (click)="active.set(f)">{{ f }}</button>
          }
        </div>
      }
    </div></section>

    <section style="padding-top:0"><div class="wrap">
      @if (visible().length) {
        <div class="grid g2">
          @for (p of visible(); track p.id) { <sf-project-card [project]="p" sfReveal /> }
        </div>
      } @else {
        <div class="empty">
          <h3>Case studies coming soon</h3>
          <p style="margin:8px 0 22px">We're preparing our latest projects for this page.</p>
          <a routerLink="/consult" class="btn btn-primary">Talk to us about your project →</a>
        </div>
      }
    </div></section>

    <section class="alt"><div class="wrap center">
      <h2 sfReveal>Have a project in mind?</h2>
      <div class="btns" style="justify-content:center">
        <a routerLink="/consult" class="btn btn-primary">Book a Free Consultation →</a>
      </div>
    </div></section>
  `
})
export class PortfolioListComponent implements OnInit {
  private title = inject(Title);
  private meta = inject(Meta);

  readonly projects = PROJECTS;
  readonly filters = FILTERS;
  readonly active = signal('All');
  readonly visible = computed(() => {
    const f = this.active();
    return this.projects.filter(p => f === 'All' || p.cats.includes(f));
  });

  ngOnInit() {
    setSeo(this.title, this.meta, 'Portfolio', 'Web, mobile, SaaS, e-commerce and marketing case studies with measurable results.');
  }
}
