import { Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { CONFIG } from '../data/content';
import { setSeo } from '../services/seo';

const MESSAGES: Record<string, { title: string; text: string }> = {
  consultation: { title: "You're one step away", text: 'Pick a time on our calendar. We will confirm by email.' },
  audit: { title: 'Review request received', text: "We'll email your automation review within 48 hours." },
  quote: { title: 'Thanks! Your quote is on its way', text: "We'll review your brief and send a detailed proposal within one business day." },
  guide: { title: 'Request received', text: "We'll email the checklist to you within one business day." },
  contact: { title: 'Message sent', text: 'We reply within one business day.' },
  'ad-landing': { title: "You're booked in", text: 'We will contact you within one business day to confirm your strategy call.' }
};
const DEFAULT = { title: 'Thank you', text: "We'll be in touch soon." };

@Component({
  selector: 'sf-thanks',
  imports: [RouterLink],
  template: `
    <section class="page-hero"><div class="wrap center narrow">
      <div class="bigcheck">✓</div>
      <h1>{{ msg().title }}</h1>
      <p class="lead" style="margin:14px auto 30px">{{ msg().text }}</p>

      @if (type() === 'consultation') {
        <div class="card" style="text-align:left;margin-bottom:24px">
          <h3>Book your call</h3>
          <p class="muted" style="margin-bottom:16px">Choose a time that works for you.</p>
          <a [href]="calendarUrl" target="_blank" rel="noopener" class="btn btn-primary">Open Calendar →</a>
        </div>
      }

      <div class="btns" style="justify-content:center;margin-top:0">
        <a routerLink="/portfolio" class="btn btn-ghost">See Our Work</a>
        <a routerLink="/" class="btn btn-ghost">Back to Home</a>
      </div>
    </div></section>
  `
})
export class ThanksComponent {
  private route = inject(ActivatedRoute);

  readonly calendarUrl = CONFIG.calendarUrl;
  readonly type = toSignal(this.route.paramMap.pipe(map(p => p.get('type') ?? '')), { initialValue: '' });
  readonly msg = computed(() => MESSAGES[this.type()] ?? DEFAULT);

  private title = inject(Title);
  private meta = inject(Meta);

  constructor() {
    effect(() => setSeo(this.title, this.meta, this.msg().title, this.msg().text));
  }
}
