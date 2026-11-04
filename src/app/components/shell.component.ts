import { isPlatformBrowser } from '@angular/common';
import { Component, HostListener, PLATFORM_ID, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CONFIG } from '../data/content';

@Component({
  selector: 'sf-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header>
      <div class="wrap nav">
        <a routerLink="/" class="logo"><span class="logo-mark">SF</span>Squar<span>Finity</span></a>
        <nav [class.open]="menuOpen()">
          <ul>
            <li><a routerLink="/services" routerLinkActive="active" (click)="menuOpen.set(false)">Services</a></li>
            <li><a routerLink="/portfolio" routerLinkActive="active" (click)="menuOpen.set(false)">Portfolio</a></li>
            <li><a routerLink="/industries" routerLinkActive="active" (click)="menuOpen.set(false)">Industries</a></li>
            <li><a routerLink="/about" routerLinkActive="active" (click)="menuOpen.set(false)">About</a></li>
            <li><a routerLink="/insights" routerLinkActive="active" (click)="menuOpen.set(false)">Insights</a></li>
            <li><a routerLink="/contact" routerLinkActive="active" (click)="menuOpen.set(false)">Contact</a></li>
            <li class="nav-cta"><a routerLink="/consult" class="btn btn-primary btn-sm">Book a Free Call</a></li>
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
            <p class="muted" style="max-width:320px;margin-top:14px">We build software and grow brands with a team of 10–15 specialists.</p>
          </div>
          <div>
            <h4>Services</h4>
            <a routerLink="/services/software">Software Development</a>
            <a routerLink="/services/marketing">Digital Marketing</a>
            <a routerLink="/services/ecommerce">E-commerce</a>
            <a routerLink="/services/ai">AI Automation</a>
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
            <a routerLink="/consult">Free Consultation</a>
            <a routerLink="/audit">Free Audit</a>
            <a routerLink="/contact">Contact</a>
            <a [href]="'mailto:' + config.companyEmail">{{ config.companyEmail }}</a>
          </div>
        </div>
        <div class="copy">
          <span>© {{ year }} SquarFinity. All rights reserved.</span>
          <span><a routerLink="/privacy" style="display:inline">Privacy</a> · <a routerLink="/terms" style="display:inline">Terms</a></span>
        </div>
      </div>
    </footer>

    <div class="float-bar">
      <a routerLink="/consult" class="btn btn-primary btn-sm">Book a Call</a>
      <a routerLink="/audit" class="btn btn-ghost btn-sm">Free Audit</a>
    </div>

    <a class="wa" [href]="waLink" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">💬</a>

    @if (showExit()) {
      <div class="modal show" (click)="showExit.set(false)">
        <div class="form-card" style="max-width:520px;width:100%;position:relative" (click)="$event.stopPropagation()">
          <button class="x" (click)="showExit.set(false)" aria-label="Close">×</button>
          <span class="eyebrow">Before you go</span>
          <h2 style="font-size:1.8rem">Get a free audit of your website</h2>
          <p class="muted" style="margin:10px 0 20px">We'll review your speed, SEO and conversion points and email you a report within 48 hours.</p>
          <a routerLink="/audit" class="btn btn-primary" style="width:100%;justify-content:center" (click)="showExit.set(false)">Get My Free Audit</a>
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
