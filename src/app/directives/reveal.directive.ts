import { AfterViewInit, Directive, ElementRef, inject } from '@angular/core';

/**
 * Fades an element in as it scrolls into view. Add the `sfReveal` attribute to any element.
 * Runs only in the browser (ngAfterViewInit is skipped during SSR), so the server markup
 * is still complete. Respects prefers-reduced-motion.
 */
@Directive({
  selector: '[sfReveal]',
  host: { class: 'reveal' }
})
export class RevealDirective implements AfterViewInit {
  private el = inject<ElementRef<HTMLElement>>(ElementRef);

  ngAfterViewInit() {
    const node = this.el.nativeElement;
    const reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce || typeof IntersectionObserver === 'undefined') {
      node.classList.add('in');
      return;
    }

    const observer = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) {
        node.classList.add('in');
        observer.disconnect();
      }
    }, { threshold: 0.12 });

    observer.observe(node);
  }
}
