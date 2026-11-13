import { isPlatformBrowser } from '@angular/common';
import { Component, HostListener, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { CONFIG } from '../data/content';
import { VoiceAgentComponent } from './voice-agent.component';

@Component({
  selector: 'sf-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, VoiceAgentComponent],
  template: `
    <header>
      <div class="wrap nav">
        <a routerLink="/" class="logo"><span class="logo-mark">SF</span>Squar<span>Finity</span></a>
        <nav [class.open]="menuOpen()">
          <ul>
            <li><a routerLink="/services" routerLinkActive="active" (click)="menuOpen.set(false)">Solutions</a></li>
            <li><a routerLink="/engineering" routerLinkActive="active" (click)="menuOpen.set(false)">Engineering</a></li>
            <li><a routerLink="/industries" routerLinkActive="active" (click)="menuOpen.set(false)">Industries</a></li>
            <li><a routerLink="/portfolio" routerLinkActive="active" (click)="menuOpen.set(false)">Case Studies</a></li>
            <li><a routerLink="/insights" routerLinkActive="active" (click)="menuOpen.set(false)">Insights</a></li>
            <li><a routerLink="/about" routerLinkActive="active" (click)="menuOpen.set(false)">About</a></li>
            <li><a routerLink="/contact" routerLinkActive="active" (click)="menuOpen.set(false)">Contact</a></li>
            <li class="nav-cta"><a routerLink="/consult" class="btn btn-primary btn-sm">AI Workflow Assessment</a></li>
          </ul>
        </nav>
        <button class="menu-btn" (click)="toggleMenu()" aria-label="Toggle menu">☰</button>
      </div>
    </header>

    <main><router-outlet /></main>

    <footer>
      <div class="wrap">
        <div class="fgrid">
          <div>
            <a routerLink="/" class="logo"><span class="logo-mark">SF</span>Squar<span>Finity</span></a>
            <p class="muted" style="max-width:320px;margin-top:14px">AI workflow automation, agentic AI, CRM intelligence and cloud-native delivery from a team of 10–15 specialists.</p>
          </div>
          <div>
            <h4>Services</h4>
            <a routerLink="/services/workflow-automation">AI Workflow Automation</a>
            <a routerLink="/services/agentic-ai">Agentic AI</a>
            <a routerLink="/services/crm-revops">CRM & Revenue Ops</a>
            <a routerLink="/services/devops-cloud">Cloud & DevOps</a>
          </div>
          <div>
            <h4>Company</h4>
            <a routerLink="/about">About</a>
            <a routerLink="/portfolio">Portfolio</a>
            <a routerLink="/industries">Industries</a>
            <a routerLink="/insights">Insights</a>
          </div>
          <div>
            <h4>Get in touch</h4>
            <a routerLink="/consult">AI Workflow Assessment</a>
            <a routerLink="/engineering">How We Engineer AI</a>
            <a routerLink="/demo">Workflow Demo</a>
            <a routerLink="/guide">Free AI Checklist</a>
            <a routerLink="/contact">Contact</a>
            <a [href]="'mailto:' + config.companyEmail">{{ config.companyEmail }}</a>
            <a [href]="waLink" target="_blank" rel="noopener">WhatsApp: {{ config.phone }}</a>
          </div>
        </div>
        <div class="copy">
          <span>© {{ year }} SquarFinity. All rights reserved.</span>
          <span><a routerLink="/privacy" style="display:inline">Privacy</a> · <a routerLink="/terms" style="display:inline">Terms</a></span>
        </div>
      </div>
    </footer>

    @if (showFloatBar()) {
      <div class="float-bar">
        <a routerLink="/consult" class="btn btn-primary btn-sm">Book an Assessment</a>
        <a routerLink="/demo" class="btn btn-ghost btn-sm">See a Demo</a>
      </div>
    }

    <a class="wa" [href]="waLink" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">💬</a>
    <sf-voice-agent />

    @if (showExit()) {
      <div class="modal show" (click)="showExit.set(false)">
        <div class="form-card" style="max-width:520px;width:100%;position:relative" (click)="$event.stopPropagation()">
          <button class="x" (click)="showExit.set(false)" aria-label="Close">×</button>
          <span class="eyebrow">Before you go</span>
          <h2 style="font-size:1.8rem">Get the free AI Automation Starter Checklist</h2>
          <p class="muted" style="margin:10px 0 20px">A 4-page PDF with seven steps to choose, scope and safely launch your first AI workflow.</p>
          <a routerLink="/guide" class="btn btn-primary" style="width:100%;justify-content:center" (click)="showExit.set(false)">Get the Free Checklist</a>
        </div>
      </div>
    }
  `
})
export class ShellComponent {
  private platformId = inject(PLATFORM_ID);

  readonly config = CONFIG;
  readonly waLink = `https://wa.me/${CONFIG.whatsapp}`;
  readonly year = new Date().getFullYear();
  readonly menuOpen = signal(false);
  readonly showExit = signal(false);

  /** The floating bar is hidden on form pages, where it would cover the form's own buttons. */
  private router = inject(Router);
  private url = toSignal(
    this.router.events.pipe(filter(e => e instanceof NavigationEnd), map(() => this.router.url)),
    { initialValue: this.router.url }
  );
  readonly showFloatBar = computed(() => !/^\/(consult|contact|audit|quote|guide|thanks)(\/|\?|#|$)/.test(this.url()));
  private exitShown = false;

  toggleMenu() {
    this.menuOpen.update(open => !open);
  }

  /** Exit-intent popup: shows once per visit when the cursor leaves the top of the page. */
  @HostListener('document:mouseout', ['$event'])
  onMouseOut(e: MouseEvent) {
    if (!this.exitShown && isPlatformBrowser(this.platformId) && !e.relatedTarget && e.clientY < 10) {
      this.exitShown = true;
      this.showExit.set(true);
    }
  }
}
