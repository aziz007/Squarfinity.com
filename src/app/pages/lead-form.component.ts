import { Component, computed, inject, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { CONFIG } from '../data/content';
import { LEAD_CONFIG, LeadConfig, LeadType } from '../data/lead-config';
import { LeadService } from '../services/lead.service';
import { setSeo } from '../services/seo';

/**
 * One reusable form for consultation, audit, quote, guide, contact and the
 * ad landing page. Each one is described by LEAD_CONFIG; multi-step forms
 * simply have more than one entry in `steps`.
 */
@Component({
  selector: 'sf-lead-form',
  imports: [ReactiveFormsModule],
  template: `
    <section class="page-hero"><div class="wrap" [class.split]="!cfg.landing">
      <div>
        <span class="eyebrow">{{ cfg.eyebrow }}</span>
        <h1>{{ cfg.title }}</h1>
        <p class="lead" style="margin:18px 0 26px">{{ cfg.intro }}</p>
        @if (cfg.bullets) {
          <ul class="check">
            @for (b of cfg.bullets; track b) { <li>{{ b }}</li> }
          </ul>
        }
        @if (cfg.type === 'consultation') {
          <div class="trust"><span>★★★★★ 4.9 average rating</span><span>85+ clients</span></div>
        }
      </div>

      <div class="form-card" [class.narrow-card]="cfg.landing">
        <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>
          @if (cfg.steps.length > 1) {
            <div class="progress"><div [style.width.%]="progress()"></div></div>
          }

          <!-- Honeypot: hidden from people, filled by bots -->
          <input class="hp" tabindex="-1" autocomplete="off" aria-hidden="true" formControlName="hp" />

          @for (f of stepFields(); track f.name) {
            <label class="field">
              <span>{{ f.label }}{{ f.required ? ' *' : '' }}</span>
              @if (f.options) {
                <select [formControlName]="f.name">
                  <option value="">Select…</option>
                  @for (o of f.options; track o) { <option [value]="o">{{ o }}</option> }
                </select>
              } @else if (f.type === 'textarea') {
                <textarea rows="4" [formControlName]="f.name"></textarea>
              } @else {
                <input [type]="f.type ?? 'text'" [formControlName]="f.name" />
              }
              @if (invalid(f.name)) {
                <small class="error">{{ f.label }} is required{{ f.type === 'email' ? ' (valid email)' : '' }}.</small>
              }
            </label>
          }

          @if (error()) { <p class="error">{{ error() }}</p> }

          <div class="btns">
            @if (step() > 0) {
              <button type="button" class="btn btn-ghost" (click)="back()">← Back</button>
            }
            @if (isLast()) {
              <button type="submit" class="btn btn-primary" [disabled]="sending()">
                {{ sending() ? 'Sending…' : cfg.submitLabel }}
              </button>
            } @else {
              <button type="button" class="btn btn-primary" (click)="next()">Next →</button>
            }
          </div>

          <div class="trust"><span>🔒 Your details stay private</span><span>Reply within 1 business day</span></div>
        </form>
      </div>
    </div></section>
  `
})
export class LeadFormComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private leads = inject(LeadService);
  private title = inject(Title);
  private meta = inject(Meta);

  readonly cfg: LeadConfig;
  readonly form: FormGroup;
  readonly step = signal(0);
  readonly sending = signal(false);
  readonly error = signal('');
  readonly stepFields = computed(() => this.cfg.steps[this.step()]);
  readonly isLast = computed(() => this.step() === this.cfg.steps.length - 1);
  readonly progress = computed(() => ((this.step() + 1) / this.cfg.steps.length) * 100);

  constructor() {
    const type = this.route.snapshot.data['leadType'] as LeadType;
    this.cfg = LEAD_CONFIG[type];

    const controls: Record<string, FormControl<string>> = {
      hp: new FormControl('', { nonNullable: true })
    };
    for (const f of this.cfg.steps.flat()) {
      const validators: ValidatorFn[] = [];
      if (f.required) validators.push(Validators.required);
      if (f.type === 'email') validators.push(Validators.email);
      controls[f.name] = new FormControl('', { nonNullable: true, validators });
    }
    this.form = new FormGroup(controls);

    setSeo(this.title, this.meta, this.cfg.title, this.cfg.intro);
  }

  invalid(name: string): boolean {
    const c = this.form.get(name);
    return !!c && c.touched && c.invalid;
  }

  private validateStep(): boolean {
    const controls = this.stepFields().map(f => this.form.get(f.name)!);
    controls.forEach(c => c.markAsTouched());
    return controls.every(c => c.valid);
  }

  next() {
    if (this.validateStep()) this.step.update(s => s + 1);
  }

  back() {
    this.step.update(s => Math.max(0, s - 1));
  }

  onSubmit() {
    if (!this.isLast()) return this.next();
    if (!this.validateStep()) return;

    // Honeypot filled: pretend success, send nothing.
    const { hp, ...data } = this.form.value;
    if (hp) return this.router.navigate(['/thanks', this.cfg.type]);

    this.sending.set(true);
    this.error.set('');
    this.leads.submit(this.cfg.type, data).subscribe({
      next: () => this.router.navigate(['/thanks', this.cfg.type]),
      error: () => {
        this.sending.set(false);
        this.error.set(`Something went wrong. Please try again or email ${CONFIG.companyEmail}.`);
      }
    });
  }
}
