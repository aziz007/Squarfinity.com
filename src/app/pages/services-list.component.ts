import { Component, OnInit, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { SERVICES } from '../data/content';
import { setSeo } from '../services/seo';

@Component({
  selector: 'sf-services-list',
  imports: [RouterLink],
  template: `
    <section class="page-hero"><div class="wrap">
      <span class="eyebrow">Services</span>
      <h1>Everything you need to build and grow online</h1>
      <p class="lead" style="margin-top:18px">Software and marketing under one roof, so your product and growth plan work together.</p>
    </div></section>

    <section style="padding-top:20px"><div class="wrap grid g2">
      @for (s of services; track s.slug) {
        <a [routerLink]="['/services', s.slug]" class="card">
          <div class="icon">{{ s.icon }}</div>
          <h3>{{ s.name }}</h3>
          <p class="muted">{{ s.short }}</p>
          <ul class="check" style="margin-top:18px;font-size:.92rem">
            @for (i of s.includes.slice(0, 3); track i) { <li>{{ i }}</li> }
          </ul>
          <p class="link">View service →</p>
        </a>
      }
    </div></section>

    <section class="alt"><div class="wrap center">
      <h2>Not sure where to start?</h2>
      <p class="lead">Tell us your goal and we'll recommend the right mix in one call.</p>
      <div class="btns" style="justify-content:center">
        <a routerLink="/consult" class="btn btn-primary">Book a Free Consultation →</a>
      </div>
    </div></section>
  `
})
export class ServicesListComponent implements OnInit {
  private title = inject(Title);
  private meta = inject(Meta);
  readonly services = SERVICES;

  ngOnInit() {
    setSeo(this.title, this.meta, 'Services', 'Custom software, mobile apps, SaaS, e-commerce, digital marketing and AI automation.');
  }
}
