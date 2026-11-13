import { isPlatformBrowser } from '@angular/common';
import { Component, OnDestroy, OnInit, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CONFIG } from '../data/content';

/**
 * "Talk to our AI" voice agent, powered by Retell AI web calls.
 *
 * Settings are read at runtime from /voice-agent.json in the web root, so the agent can be
 * switched on, off or changed in cPanel File Manager without rebuilding the site:
 *   { "enabled": true, "publicKey": "public_key_...", "agentId": "agent_..." }
 * The public key is meant for browser use; restrict it to squarfinity.com in the Retell dashboard.
 *
 * The Retell SDK (and the audio library it uses) is only downloaded when a visitor starts a call,
 * so the button adds almost nothing to page load.
 */
interface VoiceSettings { enabled?: boolean; publicKey?: string; agentId?: string; maxMinutes?: number; }
type Phase = 'idle' | 'connecting' | 'live' | 'ended' | 'error';
interface Session { end(): Promise<void>; mute(): void; unmute(): void; on(event: string, fn: (...a: unknown[]) => void): unknown; }

@Component({
  selector: 'sf-voice-agent',
  imports: [RouterLink],
  template: `
    @if (settings(); as s) {
      @if (!open()) {
        <button class="va-launch" (click)="open.set(true)" aria-label="Talk to our AI agent">
          <span class="va-dot" aria-hidden="true"></span> Talk to our AI
        </button>
      } @else {
        <div class="va-panel" role="dialog" aria-label="SquarFinity AI voice agent">
          <button class="va-close" (click)="close()" aria-label="Close">×</button>
          <div class="va-head">
            <div class="va-orb" [class.live]="phase() === 'live'" [class.talking]="agentTalking()" aria-hidden="true"></div>
            <div>
              <h3>SquarFinity AI agent</h3>
              <p class="muted small">{{ statusLine() }}</p>
            </div>
          </div>

          @switch (phase()) {
            @case ('idle') {
              <p class="muted">Ask about our services, how we build AI workflows, or book an assessment. Uses your microphone.</p>
              <button class="btn btn-primary va-wide" (click)="start(s)">Start voice call</button>
              <p class="va-note">Calls are recorded and transcribed so we can follow up. See our <a routerLink="/privacy" (click)="close()">privacy policy</a>.</p>
            }
            @case ('connecting') {
              <p class="muted">Connecting… allow microphone access if your browser asks.</p>
              <button class="btn btn-ghost va-wide" (click)="hangUp()">Cancel</button>
            }
            @case ('live') {
              <p class="va-timer">{{ timer() }}</p>
              <div class="btns va-row">
                <button class="btn btn-ghost btn-sm" (click)="toggleMute()">{{ muted() ? 'Unmute' : 'Mute' }}</button>
                <button class="btn btn-primary btn-sm va-end" (click)="hangUp()">End call</button>
              </div>
            }
            @case ('ended') {
              <p class="muted">Thanks for calling. If you shared your email, we'll follow up within one business day.</p>
              <div class="btns va-row">
                <a routerLink="/consult" class="btn btn-primary btn-sm" (click)="close()">Book an assessment</a>
                <button class="btn btn-ghost btn-sm" (click)="phase.set('idle')">Call again</button>
              </div>
            }
            @case ('error') {
              <p class="muted">{{ errorText() }}</p>
              <div class="btns va-row">
                <button class="btn btn-ghost btn-sm" (click)="phase.set('idle')">Try again</button>
                <a [href]="waLink" target="_blank" rel="noopener" class="btn btn-primary btn-sm">Message us on WhatsApp</a>
              </div>
            }
          }
        </div>
      }
    }
  `
})
export class VoiceAgentComponent implements OnInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);

  readonly waLink = `https://wa.me/${CONFIG.whatsapp}`;
  readonly settings = signal<VoiceSettings | null>(null);
  readonly open = signal(false);
  readonly phase = signal<Phase>('idle');
  readonly muted = signal(false);
  readonly agentTalking = signal(false);
  readonly seconds = signal(0);
  readonly errorText = signal('');

  readonly timer = computed(() => {
    const s = this.seconds();
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  });
  readonly statusLine = computed(() => ({
    idle: 'Voice assistant · usually answers instantly',
    connecting: 'Connecting…',
    live: this.agentTalking() ? 'Speaking…' : 'Listening…',
    ended: 'Call ended',
    error: 'Could not connect'
  })[this.phase()]);

  private session?: Session;
  private tick?: ReturnType<typeof setInterval>;

  async ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      const res = await fetch('/voice-agent.json', { cache: 'no-cache' });
      if (!res.ok) return;
      const s = (await res.json()) as VoiceSettings;
      if (s.enabled && s.publicKey?.startsWith('public_key_') && s.agentId) this.settings.set(s);
    } catch {
      // No settings file or invalid JSON: the button stays hidden.
    }
  }

  async start(s: VoiceSettings) {
    if (this.phase() === 'connecting' || this.phase() === 'live') return;
    this.phase.set('connecting');
    this.muted.set(false);
    this.seconds.set(0);
    try {
      const { RetellClient } = await import('retell-client-js-sdk');
      const client = new RetellClient({ key: s.publicKey! });
      const session = client.createWebCall({
        agent_id: s.agentId!,
        metadata: { source: 'squarfinity.com', page: location.pathname },
        hooks: {
          onStatus: status => {
            if (status === 'live') this.goLive(s.maxMinutes ?? 10);
          },
          onAgentStartTalking: () => this.agentTalking.set(true),
          onAgentStopTalking: () => this.agentTalking.set(false),
          onEnd: () => this.finish(),
          onError: err => this.fail(err)
        }
      }) as unknown as Session;
      this.session = session;
    } catch (err) {
      this.fail(err);
    }
  }

  toggleMute() {
    if (!this.session) return;
    if (this.muted()) this.session.unmute(); else this.session.mute();
    this.muted.update(m => !m);
  }

  async hangUp() {
    const session = this.session;
    if (!session) { this.phase.set('idle'); return; }
    try { await session.end(); } catch { /* the end hook still resets the UI */ }
    this.finish();
  }

  close() {
    if (this.phase() === 'connecting' || this.phase() === 'live') this.hangUp();
    this.open.set(false);
    if (this.phase() !== 'error') this.phase.set('idle');
  }

  ngOnDestroy() {
    this.stopTimer();
    this.session?.end().catch(() => undefined);
  }

  private goLive(maxMinutes: number) {
    if (this.phase() === 'live') return;
    this.phase.set('live');
    this.stopTimer();
    this.tick = setInterval(() => {
      this.seconds.update(v => v + 1);
      // Safety net on top of the agent's own maximum call length in Retell.
      if (this.seconds() >= maxMinutes * 60) this.hangUp();
    }, 1000);
  }

  private finish() {
    this.stopTimer();
    this.agentTalking.set(false);
    this.session = undefined;
    if (this.phase() !== 'error') this.phase.set(this.seconds() > 0 ? 'ended' : 'idle');
  }

  private fail(err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    const micBlocked = /permission|notallowed|denied/i.test(msg);
    this.errorText.set(micBlocked
      ? 'Your browser blocked the microphone. Allow microphone access for this site and try again, or message us on WhatsApp.'
      : 'The voice agent is not available right now. Please try again in a moment, or message us on WhatsApp.');
    this.phase.set('error');
    this.stopTimer();
    this.session = undefined;
  }

  private stopTimer() {
    if (this.tick) clearInterval(this.tick);
    this.tick = undefined;
  }
}
