import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { setSeo } from '../services/seo';

interface DemoStep { who: 'System' | 'AI' | 'Person'; title: string; detail: string; }
interface Demo { id: string; name: string; icon: string; input: string; steps: DemoStep[]; outcome: string; }

/*
 * WORKFLOW DEMO
 * A scripted, illustrative walkthrough. It runs in the browser and calls no AI service.
 * Edit DEMOS to change the examples.
 */
const DEMOS: Demo[] = [
  {
    id: 'invoice', name: 'Supplier invoice processing', icon: '▤',
    input: 'A supplier emails a PDF invoice to your accounts inbox.',
    steps: [
      { who: 'System', title: 'Invoice arrives', detail: 'The workflow picks up the email and the attached PDF from the accounts inbox.' },
      { who: 'AI', title: 'Read and extract', detail: 'AI reads the PDF and extracts the supplier, invoice number, dates, line items and totals, with a confidence level for each field.' },
      { who: 'System', title: 'Check against records', detail: 'The totals are matched against the purchase order and checked for duplicates in your accounting system.' },
      { who: 'Person', title: 'Approve', detail: 'Your finance lead sees the extracted invoice next to the original and approves it. Low-confidence fields are highlighted for review.' },
      { who: 'System', title: 'Post and log', detail: 'The approved bill is created in your accounting system and every step is written to an audit log.' }
    ],
    outcome: 'The invoice is entered without retyping, and a person approved the payment data.'
  },
  {
    id: 'lead', name: 'Inbound lead follow-up', icon: '↗',
    input: 'A prospect submits the contact form on your website at 11pm.',
    steps: [
      { who: 'System', title: 'Lead captured', detail: 'The form submission is saved to your CRM with its source and timestamp.' },
      { who: 'AI', title: 'Qualify', detail: 'AI compares the enquiry with your qualification criteria and summarises what the prospect needs.' },
      { who: 'AI', title: 'Draft a reply', detail: 'AI drafts a reply in your tone, answering the question asked and offering meeting times from your calendar.' },
      { who: 'Person', title: 'Review and send', detail: 'A salesperson reviews the draft in the morning, edits if needed and sends it.' },
      { who: 'System', title: 'Update the CRM', detail: 'The deal, the reply and the next step are logged, and a reminder is set if there is no response.' }
    ],
    outcome: 'The lead gets a considered reply first thing in the morning and the CRM is already up to date.'
  },
  {
    id: 'support', name: 'Support ticket triage', icon: '✦',
    input: 'A customer writes in asking where their order is.',
    steps: [
      { who: 'System', title: 'Ticket received', detail: 'The message is logged in your helpdesk with the customer record attached.' },
      { who: 'AI', title: 'Classify', detail: 'AI identifies the topic, urgency and sentiment, and routes billing or complaint tickets straight to a person.' },
      { who: 'System', title: 'Look up the facts', detail: 'The workflow fetches the order and shipping status from your store. The AI is only given this order, not your whole database.' },
      { who: 'AI', title: 'Draft an answer', detail: 'AI writes a reply using the looked-up facts and links to the tracking page.' },
      { who: 'Person', title: 'Approve or auto-send', detail: 'You choose the rule: an agent approves every reply, or routine status answers send automatically and the rest wait for review.' }
    ],
    outcome: 'Routine questions are answered quickly with real order data, and sensitive tickets go to a person.'
  }
];

@Component({
  selector: 'sf-demo',
  imports: [RouterLink],
  template: `
    <section class="page-hero hero-grid"><div class="wrap">
      <span class="eyebrow">Workflow demo</span>
      <h1>See how an AI workflow runs, <span>step by step</span></h1>
      <p class="lead" style="margin-top:18px">Pick a process and walk through it. Each step shows who is acting: your systems, the AI, or a person on your team.</p>
      <p class="notice" style="margin-top:18px">This is an illustrative walkthrough with example data. It does not call a live AI model.</p>
    </div></section>

    <section style="padding-top:10px"><div class="wrap">
      <div class="filters">
        @for (d of demos; track d.id) {
          <button class="chip" [class.on]="d.id === demo().id" (click)="pick(d.id)">{{ d.icon }} {{ d.name }}</button>
        }
      </div>

      <div class="card" style="margin-top:24px">
        <p class="muted small">Starting point</p>
        <h3 style="margin-top:6px">{{ demo().input }}</h3>
      </div>

      <div class="grid" style="gap:14px;margin-top:14px">
        @for (s of demo().steps; track s.title; let i = $index) {
          @if (i <= step()) {
            <div class="card" style="display:flex;gap:18px;align-items:flex-start" [style.opacity]="i === step() ? 1 : .7">
              <div class="big-num" style="font-size:1.6rem">0{{ i + 1 }}</div>
              <div>
                <span class="tag">{{ s.who }}</span>
                <h3 style="margin-top:8px">{{ s.title }}</h3>
                <p class="muted">{{ s.detail }}</p>
              </div>
            </div>
          }
        }
      </div>

      @if (done()) {
        <div class="card" style="margin-top:14px;border-color:var(--accent)">
          <p class="muted small">Result</p>
          <h3 style="margin-top:6px">{{ demo().outcome }}</h3>
        </div>
      }

      <div class="btns">
        @if (!done()) {
          <button class="btn btn-primary" (click)="next()">Next step →</button>
        }
        <button class="btn btn-ghost" (click)="step.set(0)">Start again</button>
      </div>
    </div></section>

    <section class="alt"><div class="wrap split">
      <div>
        <span class="eyebrow">Estimate</span>
        <h2>How much time could one workflow give back?</h2>
        <p class="lead">Enter your own numbers. The estimate is simple arithmetic on what you enter, not a promise of results.</p>
      </div>
      <div class="form-card">
        <div class="field"><label for="d-count">Times this task is done per week</label>
          <input id="d-count" type="number" min="0" [value]="count()" (input)="count.set(num($event))"></div>
        <div class="field"><label for="d-mins">Minutes per task today</label>
          <input id="d-mins" type="number" min="0" [value]="mins()" (input)="mins.set(num($event))"></div>
        <div class="field"><label for="d-share">Share of that time automation could remove (%)</label>
          <input id="d-share" type="number" min="0" max="100" [value]="share()" (input)="share.set(num($event))"></div>
        <div class="stats" style="margin-top:8px">
          <div class="stat"><strong>{{ weekly() }}</strong><span>hours saved per week</span></div>
          <div class="stat"><strong>{{ yearly() }}</strong><span>hours saved per year</span></div>
        </div>
        <p class="muted small" style="margin-top:14px">Calculated as tasks × minutes × share, over 48 working weeks. We measure the real share during an assessment.</p>
      </div>
    </div></section>

    <section><div class="wrap">
      <div class="cta-band">
        <h2>Want this mapped to your own process?</h2>
        <p class="lead" style="margin:0 auto 28px">In a 30-minute assessment we walk through one of your workflows the same way.</p>
        <div class="btns" style="justify-content:center;margin-top:0">
          <a routerLink="/consult" class="btn btn-primary">Book an AI Workflow Assessment →</a>
        </div>
      </div>
    </div></section>
  `
})
export class DemoComponent implements OnInit {
  private title = inject(Title);
  private meta = inject(Meta);

  readonly demos = DEMOS;
  readonly demoId = signal(DEMOS[0].id);
  readonly step = signal(0);
  readonly demo = computed(() => DEMOS.find(d => d.id === this.demoId()) ?? DEMOS[0]);
  readonly done = computed(() => this.step() >= this.demo().steps.length - 1);

  readonly count = signal(100);
  readonly mins = signal(10);
  readonly share = signal(60);
  readonly weekly = computed(() => this.round(this.count() * this.mins() * Math.min(this.share(), 100) / 100 / 60));
  readonly yearly = computed(() => Math.round(this.weekly() * 48));

  ngOnInit() {
    setSeo(this.title, this.meta, 'AI Workflow Demo',
      'Walk through example AI workflows step by step and estimate the time one automated process could save.');
  }

  pick(id: string) { this.demoId.set(id); this.step.set(0); }
  next() { this.step.update(this.inc); }
  num(e: Event) { return Math.max(0, Number((e.target as HTMLInputElement).value) || 0); }

  private inc = (v: number) => v + 1;
  private round(v: number) { return Math.round(v * 10) / 10; }
}
