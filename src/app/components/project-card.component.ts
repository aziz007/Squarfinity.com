import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Project } from '../data/content';

@Component({
  selector: 'sf-project-card',
  imports: [RouterLink],
  template: `
    <a [routerLink]="['/portfolio', project().id]" class="card work">
      <div class="thumb">{{ project().icon }}</div>
      <div class="body">
        <span class="tag">{{ project().cats.join(' · ') }}</span>
        <h3>{{ project().title }}</h3>
        <p class="muted">{{ project().problem }}</p>
        @if (project().results[0]; as r) {
          <span class="result">{{ r[0] }} {{ r[1] }}</span>
        }
      </div>
    </a>
  `
})
export class ProjectCardComponent {
  project = input.required<Project>();
}
