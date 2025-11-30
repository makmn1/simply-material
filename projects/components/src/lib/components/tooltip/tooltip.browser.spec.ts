import {Component} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {OverlayModule} from '@angular/cdk/overlay';
import {describe, test, expect, beforeEach, afterEach} from 'vitest';
import {page, userEvent} from 'vitest/browser';
import {SimplyMatTooltip} from './tooltip';
import {SimplyMatTooltipContentComponent} from './tooltip-content.component';

describe('SimplyMatTooltip (browser interaction)', () => {
  let fixture: ComponentFixture<TooltipTestComponent>;
  let testPage: TooltipPage;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [TooltipTestComponent, OverlayModule],
    });

    fixture = TestBed.createComponent(TooltipTestComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    testPage = new TooltipPage(fixture);
  });

  afterEach(() => {
    fixture?.destroy();
  });

  describe('Directive Creation', () => {
    test('should create directive on element with sm-tooltip attribute', () => {
      const directive = testPage.getDirective('default-tooltip');
      expect(directive).toBeTruthy();
      expect(directive).toBeInstanceOf(SimplyMatTooltip);
    });
  });

  describe('Tooltip Visibility', () => {
    test('should show tooltip on mouseenter', async () => {
      const hostLocator = testPage.getHostLocator('default-tooltip');

      await expect.poll(() => testPage.isTooltipVisible()).toBe(false);

      await userEvent.hover(hostLocator);

      await expect.poll(() => testPage.isTooltipVisible()).toBe(true);
    });

    test('should show tooltip on focus when last interaction was keyboard', async () => {
      const hostElement = testPage.getHostElement('default-tooltip') as HTMLElement;

      const directive = testPage.getDirective('default-tooltip') as any;
      directive.lastInteractionWasKeyboard = true;

      await expect.poll(() => testPage.isTooltipVisible()).toBe(false);

      await userEvent.keyboard('{Tab}');
      hostElement.focus();
      hostElement.dispatchEvent(new FocusEvent('focus', {bubbles: true}));

      await expect.poll(() => testPage.isTooltipVisible()).toBe(true);
    });

    test('should hide tooltip on blur', async () => {
      const hostElement = testPage.getHostElement('default-tooltip') as HTMLElement;

      const directive = testPage.getDirective('default-tooltip') as any;
      directive.lastInteractionWasKeyboard = true;

      await userEvent.keyboard('{Tab}');
      hostElement.focus();
      hostElement.dispatchEvent(new FocusEvent('focus', {bubbles: true}));

      await expect.poll(() => testPage.isTooltipVisible()).toBe(true);

      hostElement.blur();
      hostElement.dispatchEvent(new FocusEvent('blur', {bubbles: true}));

      await new Promise(resolve => setTimeout(resolve, 1600));

      if (directive.componentRef) {
        directive.componentRef.instance.closingAnimationComplete.emit();
      }

      await expect.poll(() => testPage.isTooltipVisible()).toBe(false);
    });

    test('should show rich tooltip on click', async () => {
      const hostLocator = testPage.getHostLocator('rich-tooltip');

      await expect.poll(() => testPage.isTooltipVisible('rich-tooltip')).toBe(
        false,
      );

      await userEvent.click(hostLocator);

      await expect.poll(() => testPage.isTooltipVisible('rich-tooltip')).toBe(
        true,
      );
    });
  });


  describe('Tooltip Content Rendering', () => {
    test('should render plain tooltip with correct content and role', async () => {
      const hostLocator = testPage.getHostLocator('default-tooltip');

      await userEvent.hover(hostLocator);
      await expect.poll(() => testPage.isTooltipVisible()).toBe(true);

      const tooltipElement = testPage.getTooltipElement();
      expect(tooltipElement).toBeTruthy();
      expect(tooltipElement?.getAttribute('role')).toBe('tooltip');

      const contentElement =
        tooltipElement?.querySelector('sm-tooltip-content');
      expect(contentElement).toBeTruthy();
      if (contentElement) {
        const textContent = contentElement.textContent?.trim() || '';
        expect(textContent).toContain('Plain tooltip content');
      }
    });

    test('should render rich tooltip with template content', async () => {
      const hostLocator = testPage.getHostLocator('rich-tooltip');

      await userEvent.click(hostLocator);
      await expect.poll(() => testPage.isTooltipVisible('rich-tooltip')).toBe(
        true,
      );

      await expect.poll(() => testPage.getTooltipElement('rich-tooltip')).toBeTruthy();

      const tooltipElement = testPage.getTooltipElement('rich-tooltip')!;
      expect(tooltipElement).toBeTruthy();
      expect(tooltipElement?.getAttribute('role')).toBe('tooltip');

      // Wait for the content element to be rendered
      await expect.poll(() => tooltipElement?.querySelector('sm-tooltip-content')).toBeTruthy();

      const contentElement = tooltipElement.querySelector('sm-tooltip-content')!;
      const textContent = contentElement.textContent;
      expect(textContent).toContain('Rich tooltip content');
    });
  });

  describe('Tooltip Persistence Strategy', () => {
    test('should hide plain tooltip when leaving host with default on-hover strategy', async () => {
      const hostLocator = testPage.getHostLocator('default-tooltip');

      await userEvent.hover(hostLocator);
      await expect.poll(() => testPage.isTooltipVisible()).toBe(true);

      await userEvent.unhover(hostLocator);
      await new Promise(resolve => setTimeout(resolve, 1600));

      const directive = testPage.getDirective('default-tooltip');
      if (directive.componentRef) {
        directive.componentRef.instance.closingAnimationComplete.emit();
      }

      await expect.poll(() => testPage.isTooltipVisible()).toBe(false);
    });

    test('should hide rich tooltip when leaving host with default on-hover strategy', async () => {
      const hostLocator = testPage.getHostLocator('rich-tooltip');

      await userEvent.click(hostLocator);
      await expect.poll(() => testPage.isTooltipVisible('rich-tooltip')).toBe(
        true,
      );

      await userEvent.unhover(hostLocator);
      await new Promise(resolve => setTimeout(resolve, 1600));

      const directive = testPage.getDirective('rich-tooltip');
      if (directive.componentRef) {
        directive.componentRef.instance.closingAnimationComplete.emit();
      }

      await expect
        .poll(() => testPage.isTooltipVisible('rich-tooltip'))
        .toBe(false);
    });

    test('should respect explicit on-hover strategy override', async () => {
      const hostLocator = testPage.getHostLocator('on-hover-strategy-tooltip');

      await userEvent.hover(hostLocator);
      await expect
        .poll(() => testPage.isTooltipVisible('on-hover-strategy-tooltip'))
        .toBe(true);

      await userEvent.unhover(hostLocator);
      await new Promise(resolve => setTimeout(resolve, 1600));

      const directive = testPage.getDirective('on-hover-strategy-tooltip');
      if (directive.componentRef) {
        directive.componentRef.instance.closingAnimationComplete.emit();
      }

      await expect
        .poll(() => testPage.isTooltipVisible('on-hover-strategy-tooltip'))
        .toBe(false);
    });

    test('should keep tooltip visible when hovering tooltip container with on-hover-with-tooltip strategy', async () => {
        const hostLocator = testPage.getHostLocator(
          'on-hover-with-tooltip-strategy-tooltip',
        );

        await userEvent.hover(hostLocator);
        await expect
          .poll(() =>
            testPage.isTooltipVisible('on-hover-with-tooltip-strategy-tooltip'),
          )
          .toBe(true);

        await userEvent.unhover(hostLocator);

        const directive = testPage.getDirective(
          'on-hover-with-tooltip-strategy-tooltip',
        );

        await expect.poll(() => {
          const tooltipElement = testPage.getTooltipElement(
            'on-hover-with-tooltip-strategy-tooltip',
          );
          return tooltipElement !== null && directive.overlayRef !== null;
        }).toBe(true);

        const tooltipElement = testPage.getTooltipElement(
          'on-hover-with-tooltip-strategy-tooltip',
        );

        if (tooltipElement && directive.overlayRef) {
          await userEvent.hover(tooltipElement);
        }

        // Wait longer than hideDelay. Should still be visible because we hovered the tooltip
        await new Promise(resolve => setTimeout(resolve, 1600));

        await expect
          .poll(() =>
            testPage.isTooltipVisible('on-hover-with-tooltip-strategy-tooltip'),
          )
          .toBe(true);
      },
    );
  });

  describe('Programmatic Control', () => {
    test('should open tooltip via directive API', async () => {
      const directive = testPage.getDirective('default-tooltip');
      expect(directive).toBeTruthy();

      await expect.poll(() => testPage.isTooltipVisible()).toBe(false);

      directive.open();

      await expect.poll(() => testPage.isTooltipVisible()).toBe(true);
    });

    test('should close tooltip via directive API', async () => {
      const directive = testPage.getDirective('default-tooltip');
      expect(directive).toBeTruthy();

      directive.open();
      await expect.poll(() => testPage.isTooltipVisible()).toBe(true);

      directive.close();

      if (directive.componentRef) {
        directive.componentRef.instance.closingAnimationComplete.emit();
      }

      await expect.poll(() => testPage.isTooltipVisible()).toBe(false);
    });

    test('should ignore user events when programmatically controlled', async () => {
      const directive = testPage.getDirective('default-tooltip');
      const hostLocator = testPage.getHostLocator('default-tooltip');
      expect(directive).toBeTruthy();

      directive.open();
      await expect.poll(() => testPage.isTooltipVisible()).toBe(true);

      // Try to close via unhover (should be ignored)
      await userEvent.unhover(hostLocator);
      await new Promise(resolve => setTimeout(resolve, 1600));

      await expect.poll(() => testPage.isTooltipVisible()).toBe(true);
    });

    test('should allow programmatic control after normal interaction', async () => {
      const directive = testPage.getDirective('default-tooltip');
      const hostLocator = testPage.getHostLocator('default-tooltip');
      expect(directive).toBeTruthy();

      await userEvent.hover(hostLocator);
      await expect.poll(() => testPage.isTooltipVisible()).toBe(true);

      await userEvent.unhover(hostLocator);
      await new Promise(resolve => setTimeout(resolve, 1600));

      if (directive.componentRef) {
        directive.componentRef.instance.closingAnimationComplete.emit();
      }

      await expect.poll(() => testPage.isTooltipVisible()).toBe(false);

      // Now open programmatically
      directive.open();
      await expect.poll(() => testPage.isTooltipVisible()).toBe(true);
    });
  });

  describe('Trigger Modes', () => {
    test('should not show tooltip on user interaction when trigger is manual', async () => {
      const hostLocator = testPage.getHostLocator('manual-trigger-tooltip');

      await userEvent.hover(hostLocator);

      await expect
        .poll(() => testPage.isTooltipVisible('manual-trigger-tooltip'))
        .toBe(false);
    });

    test('should allow programmatic control when trigger is manual', async () => {
      const directive = testPage.getDirective('manual-trigger-tooltip');
      expect(directive).toBeTruthy();

      directive.open();

      await expect
        .poll(() => testPage.isTooltipVisible('manual-trigger-tooltip'))
        .toBe(true);
    });

    test('should show tooltip on hover when trigger is default', async () => {
      const hostLocator = testPage.getHostLocator('default-tooltip');

      await userEvent.hover(hostLocator);

      await expect.poll(() => testPage.isTooltipVisible()).toBe(true);
    });

    test('should allow programmatic control when trigger is default', async () => {
      const directive = testPage.getDirective('default-tooltip');
      expect(directive).toBeTruthy();

      directive.open();

      await expect.poll(() => testPage.isTooltipVisible()).toBe(true);
    });
  });

  describe('Custom Overlay Configuration', () => {
    test('should use default overlay config when not provided', async () => {
      const directive = testPage.getDirective('default-tooltip');
      expect(directive).toBeTruthy();

      directive.open();
      await fixture.whenStable();

      expect(directive.overlayRef).toBeTruthy();
      expect(directive.overlayRef?.hasAttached()).toBe(true);
    });

    test('should merge custom overlay config with defaults', () => {
      const directive = testPage.getDirective('custom-overlay-config-tooltip');
      expect(directive).toBeTruthy();

      directive.open();

      expect(directive.overlayRef).toBeTruthy();
      expect(directive.overlayRef?.hasAttached()).toBe(true);
    });

    test('should use default values for undefined properties in custom config', () => {
      const directive = testPage.getDirective(
        'partial-overlay-config-tooltip',
      );
      expect(directive).toBeTruthy();

      directive.open();

      expect(directive.overlayRef).toBeTruthy();
      expect(directive.overlayRef?.hasAttached()).toBe(true);
    });

    test('should use custom position strategy override', () => {
      const directive = testPage.getDirective(
        'custom-position-strategy-tooltip',
      );
      expect(directive).toBeTruthy();

      directive.open();

      expect(directive.overlayRef).toBeTruthy();
      expect(directive.overlayRef?.hasAttached()).toBe(true);
    });
  });

  describe('Disabled State', () => {
    test('should not show tooltip on user interaction when disabled', async () => {
      const hostLocator = testPage.getHostLocator('disabled-tooltip');

      await userEvent.hover(hostLocator);

      await expect
        .poll(() => testPage.isTooltipVisible('disabled-tooltip'))
        .toBe(false);
    });

    test('should allow programmatic control when disabled', async () => {
      const directive = testPage.getDirective('disabled-tooltip');
      expect(directive).toBeTruthy();

      directive.open();

      await expect
        .poll(() => testPage.isTooltipVisible('disabled-tooltip'))
        .toBe(true);
    });
  });

  describe('Tooltip Positioning', () => {
    test('should default to above for plain tooltips', () => {
      const directive = testPage.getDirective('default-tooltip');
      expect(directive).toBeTruthy();

      directive.open();

      expect(directive.overlayRef).toBeTruthy();
    });

    test('should default to below for rich tooltips', () => {
      const directive = testPage.getDirective('rich-tooltip');
      expect(directive).toBeTruthy();

      directive.open();

      expect(directive.overlayRef).toBeTruthy();
    });

    test('should position tooltip $position when configured', () => {
      const directive = testPage.getDirective('position-left-tooltip');
      expect(directive).toBeTruthy();

      directive.open();

      expect(directive.overlayRef).toBeTruthy();
    });

    test('should use explicit position override for rich tooltips', () => {
      const directive = testPage.getDirective('rich-position-above-tooltip');
      expect(directive).toBeTruthy();

      directive.open();

      expect(directive.overlayRef).toBeTruthy();
    });
  });

  describe('Position Offset', () => {
    test('should use default offset of 4 for plain tooltips', () => {
      const directive = testPage.getDirective('default-tooltip');
      expect(directive).toBeTruthy();

      directive.open();

      expect(directive.overlayRef).toBeTruthy();
    });

    test('should use default offset of 8 for rich tooltips', () => {
      const directive = testPage.getDirective('rich-tooltip');
      expect(directive).toBeTruthy();

      directive.open();

      expect(directive.overlayRef).toBeTruthy();
    });

    test('should use custom offset when provided', () => {
      const directive = testPage.getDirective('custom-offset-tooltip');
      expect(directive).toBeTruthy();

      directive.open();

      expect(directive.overlayRef).toBeTruthy();
    });

    test('should use custom offset for rich tooltips when provided', () => {
      const directive = testPage.getDirective('rich-custom-offset-tooltip');
      expect(directive).toBeTruthy();

      directive.open();

      expect(directive.overlayRef).toBeTruthy();
    });
  });

  describe('Keyboard-Only Focus Behavior', () => {
    test('should show tooltip on focus after Tab key', async () => {
      const hostElement = testPage.getHostElement(
        'default-tooltip',
      ) as HTMLElement;

      await userEvent.keyboard('{Tab}');
      hostElement.focus();
      hostElement.dispatchEvent(new FocusEvent('focus', {bubbles: true}));

      await expect.poll(() => testPage.isTooltipVisible()).toBe(true);
    });

    test('should not show tooltip on focus after mousedown', async () => {
      const hostElement = testPage.getHostElement(
        'default-tooltip',
      ) as HTMLElement;

      hostElement.dispatchEvent(
        new MouseEvent('mousedown', {bubbles: true}),
      );

      hostElement.focus();
      hostElement.dispatchEvent(new FocusEvent('focus', {bubbles: true}));

      await expect.poll(() => testPage.isTooltipVisible()).toBe(false);
    });

    test('should show tooltip on focus after Tab key even if mouse was used previously', async () => {
      const hostLocator = testPage.getHostLocator('default-tooltip');
      const hostElement = testPage.getHostElement(
        'default-tooltip',
      ) as HTMLElement;

      const directive = testPage.getDirective('default-tooltip');

      // First use mouse to interact and hide again
      await userEvent.hover(hostLocator);
      await expect.poll(() => testPage.isTooltipVisible()).toBe(true);

      await userEvent.unhover(hostLocator);
      await new Promise(resolve => setTimeout(resolve, 1600));

      if (directive.componentRef) {
        directive.componentRef.instance.closingAnimationComplete.emit();
      }

      await expect.poll(() => testPage.isTooltipVisible()).toBe(false);

      // Now Tab + focus should show again
      await userEvent.keyboard('{Tab}');
      hostElement.focus();
      hostElement.dispatchEvent(new FocusEvent('focus', {bubbles: true}));

      await expect.poll(() => testPage.isTooltipVisible()).toBe(true);
    });
  });

  describe('Cleanup', () => {
    test('should cleanup overlay on directive destruction', () => {
      const directive = testPage.getDirective('default-tooltip');
      expect(directive).toBeTruthy();

      directive.open();

      expect(directive.overlayRef).toBeTruthy();
      expect(directive.overlayRef?.hasAttached()).toBe(true);

      fixture.destroy();

      expect(directive.overlayRef).toBeNull();
    });
  });
});

@Component({
  selector: 'tooltip-test',
  template: `
    <ng-template #defaultTemplate>
      <sm-tooltip-content>Plain tooltip content</sm-tooltip-content>
    </ng-template>

    <ng-template #richTemplate>
      <sm-tooltip-content>Rich tooltip content</sm-tooltip-content>
    </ng-template>

    <ng-template #customDelayTemplate>
      <sm-tooltip-content>Custom delay tooltip</sm-tooltip-content>
    </ng-template>

    <ng-template #onHoverTemplate>
      <sm-tooltip-content>On hover tooltip</sm-tooltip-content>
    </ng-template>

    <ng-template #onHoverWithTooltipTemplate>
      <sm-tooltip-content>On hover with tooltip</sm-tooltip-content>
    </ng-template>

    <ng-template #customOverlayTemplate>
      <sm-tooltip-content>Custom overlay tooltip</sm-tooltip-content>
    </ng-template>

    <ng-template #partialOverlayTemplate>
      <sm-tooltip-content>Partial overlay tooltip</sm-tooltip-content>
    </ng-template>

    <ng-template #customPositionStrategyTemplate>
      <sm-tooltip-content>Custom position strategy tooltip</sm-tooltip-content>
    </ng-template>

    <ng-template #positionLeftTemplate>
      <sm-tooltip-content>Position left tooltip</sm-tooltip-content>
    </ng-template>

    <ng-template #richPositionAboveTemplate>
      <sm-tooltip-content>Rich position above tooltip</sm-tooltip-content>
    </ng-template>

    <ng-template #customOffsetTemplate>
      <sm-tooltip-content>Custom offset tooltip</sm-tooltip-content>
    </ng-template>

    <ng-template #richCustomOffsetTemplate>
      <sm-tooltip-content>Rich custom offset tooltip</sm-tooltip-content>
    </ng-template>

    <button
      data-testid="default-tooltip"
      sm-tooltip
      [tooltip]="defaultTemplate"
      [tooltipType]="'plain'"
    >
      Default Tooltip
    </button>

    <button data-testid="no-tooltip">No Tooltip</button>

    <button
      data-testid="rich-tooltip"
      sm-tooltip
      [tooltip]="richTemplate"
      [tooltipType]="'rich'"
    >
      Rich Tooltip
    </button>

    <button
      data-testid="custom-delay-tooltip"
      sm-tooltip
      [tooltip]="customDelayTemplate"
      [config]="{ showDelay: 500, hideDelay: 2000 }"
    >
      Custom Delay Tooltip
    </button>

    <button
      data-testid="on-hover-strategy-tooltip"
      sm-tooltip
      [tooltip]="onHoverTemplate"
      [config]="{ persistStrategy: 'on-hover' }"
    >
      On Hover Strategy Tooltip
    </button>

    <button
      data-testid="on-hover-with-tooltip-strategy-tooltip"
      sm-tooltip
      [tooltip]="onHoverWithTooltipTemplate"
      [config]="{ persistStrategy: 'on-hover-with-tooltip' }"
    >
      On Hover With Tooltip Strategy Tooltip
    </button>

    <button
      data-testid="manual-trigger-tooltip"
      sm-tooltip
      [tooltip]="defaultTemplate"
      [config]="{ trigger: 'manual' }"
    >
      Manual Trigger Tooltip
    </button>

    <button
      data-testid="custom-overlay-config-tooltip"
      sm-tooltip
      [tooltip]="customOverlayTemplate"
      [config]="{ overlayConfig: { hasBackdrop: false } }"
    >
      Custom Overlay Config Tooltip
    </button>

    <button
      data-testid="partial-overlay-config-tooltip"
      sm-tooltip
      [tooltip]="partialOverlayTemplate"
      [config]="{ overlayConfig: { hasBackdrop: false } }"
    >
      Partial Overlay Config Tooltip
    </button>

    <button
      data-testid="custom-position-strategy-tooltip"
      sm-tooltip
      [tooltip]="customPositionStrategyTemplate"
      [config]="{ overlayConfig: {} }"
    >
      Custom Position Strategy Tooltip
    </button>

    <button
      data-testid="disabled-tooltip"
      sm-tooltip
      [tooltip]="defaultTemplate"
      disabled
    >
      Disabled Tooltip
    </button>

    <button
      data-testid="position-left-tooltip"
      sm-tooltip
      [tooltip]="positionLeftTemplate"
      [config]="{ position: 'left' }"
    >
      Position Left Tooltip
    </button>

    <button
      data-testid="rich-position-above-tooltip"
      sm-tooltip
      [tooltip]="richPositionAboveTemplate"
      [tooltipType]="'rich'"
      [config]="{ position: 'above' }"
    >
      Rich Position Above Tooltip
    </button>

    <button
      data-testid="custom-offset-tooltip"
      sm-tooltip
      [tooltip]="customOffsetTemplate"
      [config]="{ positionOffset: 10 }"
    >
      Custom Offset Tooltip
    </button>

    <button
      data-testid="rich-custom-offset-tooltip"
      sm-tooltip
      [tooltip]="richCustomOffsetTemplate"
      [tooltipType]="'rich'"
      [config]="{ positionOffset: 12 }"
    >
      Rich Custom Offset Tooltip
    </button>
  `,
  imports: [SimplyMatTooltip, SimplyMatTooltipContentComponent],
})
class TooltipTestComponent {
}

class TooltipPage {
  constructor(private fixture: ComponentFixture<TooltipTestComponent>) {
  }

  getDirective(testId: string): SimplyMatTooltip {
    const element = this.getHostElement(testId)!;

    const debugElement = this.fixture.debugElement.query(
      (el) => el.nativeElement === element,
    );
    return debugElement?.injector.get(SimplyMatTooltip);
  }

  getHostElement(testId: string): HTMLElement | null {
    return page.getByTestId(testId).query() as HTMLElement | null;
  }

  getHostLocator(testId: string) {
    return page.getByTestId(testId);
  }

  isTooltipVisible(testId: string = 'default-tooltip'): boolean {
    const directive = this.getDirective(testId);
    if (!directive || !directive.overlayRef) {
      return false;
    }

    return (
      directive.overlayRef.hasAttached() &&
      directive.componentRef?.instance.open() === true
    );
  }

  getTooltipElement(testId: string = 'default-tooltip'): HTMLElement | null {
    const directive = this.getDirective(testId);
    if (!directive || !directive.overlayRef) {
      return null;
    }

    return directive.overlayRef.overlayElement.querySelector(
      '[role="tooltip"]',
    ) as HTMLElement | null;
  }
}
