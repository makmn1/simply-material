import {
  Component,
  ViewChild,
  signal,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OverlayModule } from '@angular/cdk/overlay';
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { page } from 'vitest/browser';
import { SimplyMatTooltip, TooltipConfig } from './tooltip';
import { SimplyMatTooltipContentComponent } from './tooltip-content.component';

@Component({
  selector: 'tooltip-timing-host',
  template: `
    <ng-template #tpl>
      <sm-tooltip-content>Timing tooltip</sm-tooltip-content>
    </ng-template>

    <button
      data-testid="timing-host-button"
      sm-tooltip
      [tooltip]="tpl"
      [tooltipType]="tooltipType"
      [config]="config()"
    >
      Host
    </button>
  `,
  imports: [SimplyMatTooltip, SimplyMatTooltipContentComponent],
})
class TooltipTimingHostComponent {
  tooltipType: 'plain' | 'rich' = 'plain';
  config = signal<TooltipConfig>({
    showDelay: 0,
    hideDelay: 1500,
    persistStrategy: 'on-hover',
    trigger: 'default',
    position: undefined,
    overlayConfig: undefined,
    positionOffset: undefined,
  });

  @ViewChild(SimplyMatTooltip, { static: true })
  tooltip!: SimplyMatTooltip;
}

describe('SimplyMatTooltip (timing behavior)', () => {
  let fixture: ComponentFixture<TooltipTimingHostComponent>;
  let host: TooltipTimingHostComponent;
  let directive: SimplyMatTooltip;
  let hostElement: HTMLElement;

  beforeEach(async () => {
    vi.useFakeTimers();

    TestBed.configureTestingModule({
      imports: [TooltipTimingHostComponent, OverlayModule],
    });

    fixture = TestBed.createComponent(TooltipTimingHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

    directive = host.tooltip;

    hostElement = page.getByTestId("timing-host-button").query() as HTMLElement
    if (!hostElement) {
      throw new Error('Host element not found');
    }
  });

  afterEach(async () => {
    await vi.runAllTimersAsync();
    vi.useRealTimers();
  });

  function isVisible(): boolean {
    if (!directive.overlayRef) return false;
    return (
      directive.overlayRef.hasAttached() &&
      directive.componentRef?.instance.open() === true
    );
  }

  function finishClosingAnimation() {
    if (directive.componentRef) {
      const instance = directive.componentRef.instance as any;
      if (typeof instance.onAnimationEnd === 'function') {
        instance.onAnimationEnd();
      } else if (instance.closingAnimationComplete) {
        instance.closingAnimationComplete.emit();
      }
    }
  }

  test('shows tooltip after default showDelay (0ms) on hover', async () => {
    expect(isVisible()).toBe(false);

    hostElement.dispatchEvent(
      new MouseEvent('mouseenter', { bubbles: true }),
    );

    await vi.advanceTimersByTimeAsync(0);

    expect(isVisible()).toBe(true);
  });

  test('hides tooltip after default hideDelay (1500ms) on mouseleave', async () => {
    hostElement.dispatchEvent(
      new MouseEvent('mouseenter', { bubbles: true }),
    );
    await vi.advanceTimersByTimeAsync(0);
    expect(isVisible()).toBe(true);

    hostElement.dispatchEvent(
      new MouseEvent('mouseleave', { bubbles: true }),
    );

    // Before hideDelay expires, still visible
    await vi.advanceTimersByTimeAsync(1499);
    expect(isVisible()).toBe(true);

    // At hideDelay, the tooltip should start closing
    await vi.advanceTimersByTimeAsync(1);

    finishClosingAnimation();

    expect(isVisible()).toBe(false);
  });

  test('respects custom showDelay and hideDelay', async () => {
    host.config.set({
      showDelay: 500,
      hideDelay: 2000,
      persistStrategy: 'on-hover',
      trigger: 'default',
      position: undefined,
      overlayConfig: undefined,
      positionOffset: undefined,
    });

    // With fake timers, advance timers and wait for change detection
    await vi.advanceTimersByTimeAsync(0);
    await fixture.whenStable();

    expect(isVisible()).toBe(false);

    // Custom showDelay: 500 ms
    hostElement.dispatchEvent(
      new MouseEvent('mouseenter', { bubbles: true }),
    );

    await vi.advanceTimersByTimeAsync(499);
    expect(isVisible()).toBe(false);

    await vi.advanceTimersByTimeAsync(1);
    expect(isVisible()).toBe(true);

    // Custom hideDelay: 2000 ms
    hostElement.dispatchEvent(
      new MouseEvent('mouseleave', { bubbles: true }),
    );

    await vi.advanceTimersByTimeAsync(1999);
    expect(isVisible()).toBe(true);

    await vi.advanceTimersByTimeAsync(1);
    finishClosingAnimation();

    expect(isVisible()).toBe(false);
  });

  test('cancels hide timeout when hovering back before hideDelay', async () => {
    hostElement.dispatchEvent(
      new MouseEvent('mouseenter', { bubbles: true }),
    );
    await vi.advanceTimersByTimeAsync(0);
    expect(isVisible()).toBe(true);

    hostElement.dispatchEvent(
      new MouseEvent('mouseleave', { bubbles: true }),
    );

    // Wait for half of hideDelay
    await vi.advanceTimersByTimeAsync(750);
    expect(isVisible()).toBe(true);

    // Hover back before the timeout completes
    hostElement.dispatchEvent(
      new MouseEvent('mouseenter', { bubbles: true }),
    );

    // Run past the original hideDelay – if timeout was canceled, the tooltip should still be visible.
    await vi.advanceTimersByTimeAsync(2000);

    expect(isVisible()).toBe(true);
  });

  test('shows tooltip on focus when last interaction was keyboard (Tab)', async () => {
    expect(isVisible()).toBe(false);

    hostElement.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }),
    );
    hostElement.dispatchEvent(
      new FocusEvent('focus', { bubbles: true }),
    );

    await vi.advanceTimersByTimeAsync(0);

    expect(isVisible()).toBe(true);
  });

  test('does not show tooltip on focus when last interaction was pointer (mousedown)', async () => {
    expect(isVisible()).toBe(false);

    hostElement.dispatchEvent(
      new MouseEvent('mousedown', { bubbles: true }),
    );
    hostElement.dispatchEvent(
      new FocusEvent('focus', { bubbles: true }),
    );

    await vi.advanceTimersByTimeAsync(0);

    expect(isVisible()).toBe(false);
  });
});
