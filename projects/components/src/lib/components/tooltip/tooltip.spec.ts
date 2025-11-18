import {Component} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {provideZonelessChangeDetection} from '@angular/core';
import {OverlayContainer, OverlayConfig, Overlay} from '@angular/cdk/overlay';
import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest';
import {SmTooltipDirective, TooltipConfig} from './tooltip';
import {TooltipContentComponent, RichTooltipConfig} from './tooltip-content.component';
import {SmButtonComponent} from '../../buttons/button/button';
import {
  getTooltipElements,
  getTooltipFromOverlay,
  showTooltip,
  triggerAnimationEnd,
  hideTooltipAndCompleteAnimation,
  getOverlayConfig,
  testControlledOpenClose,
  unselectAndHoverTooltip,
  setupAndShowTooltip,
  setupCustomOverlayConfigTest,
  getPositionDataForTooltip,
  getOffsetForTooltip,
  hideTooltipAndVerifyAnimation,
  setupShowAndHoverTooltip,
  setupShowAndLeaveHost,
} from './tooltip-test.utils';

const defaultTooltipConfig: TooltipConfig = {
  position: null,
  showDelay: 0,
  hideDelay: 1500,
  persistStrategy: null,
  trigger: 'default',
  overlayConfig: null,
  positionOffset: null,
};

// Each button is used as a host component to represent different tooltip configurations by button ID
@Component({
  template: `
    <button id="plain-tooltip" sm-tooltip [tooltip]="'Plain tooltip text'" [config]="defaultTooltipConfig">Hover me</button>
    <button id="rich-tooltip" sm-tooltip [tooltip]="richConfig" [config]="defaultTooltipConfig">Rich tooltip</button>
    <button id="rich-tooltip-no-buttons" sm-tooltip [tooltip]="richConfigNoButtons" [config]="defaultTooltipConfig">Rich no buttons</button>
    <button id="custom-delay" sm-tooltip [tooltip]="'Delayed tooltip'" [config]="customDelayConfig">Custom delay</button>
    <button id="position-above" sm-tooltip [tooltip]="'Above tooltip'" [config]="positionAboveConfig">Above</button>
    <button id="position-below" sm-tooltip [tooltip]="'Below tooltip'" [config]="positionBelowConfig">Below</button>
    <button id="position-left" sm-tooltip [tooltip]="'Left tooltip'" [config]="positionLeftConfig">Left</button>
    <button id="position-right" sm-tooltip [tooltip]="'Right tooltip'" [config]="positionRightConfig">Right</button>
    <button id="explicit-on-hover" sm-tooltip [tooltip]="richConfig" [config]="explicitOnHoverConfig">Explicit on-hover</button>
    <button id="explicit-on-hover-with-tooltip" sm-tooltip [tooltip]="'Plain text'" [config]="explicitOnHoverWithTooltipConfig">Explicit on-hover-with-tooltip</button>
    <button #programmaticTooltip="smTooltip" id="programmatic-tooltip" sm-tooltip [tooltip]="'Programmatic tooltip'" [config]="defaultTooltipConfig">Programmatic</button>
    <button id="manual-tooltip" sm-tooltip [tooltip]="'Manual tooltip'" [config]="manualTriggerConfig">Manual</button>
    <button id="default-tooltip" sm-tooltip [tooltip]="'Default tooltip'" [config]="defaultTriggerConfig">Default</button>
    <button id="custom-config-tooltip" sm-tooltip [tooltip]="'Custom config tooltip'" [config]="customOverlayConfigValue">Custom Config</button>
    <button id="disabled-button" sm-tooltip [tooltip]="'Disabled tooltip'" [config]="defaultTooltipConfig" disabled>Disabled</button>
    <button #disabledProgrammaticTooltip="smTooltip" id="disabled-programmatic-tooltip" sm-tooltip [tooltip]="'Disabled controlled tooltip'" [config]="defaultTooltipConfig" disabled>Disabled Controlled</button>
    <button id="custom-offset-plain" sm-tooltip [tooltip]="'Custom offset plain'" [config]="customOffsetPlainConfig">Custom Offset Plain</button>
    <button id="custom-offset-rich" sm-tooltip [tooltip]="richConfig" [config]="customOffsetRichConfig">Custom Offset Rich</button>
    <button id="rich-above" sm-tooltip [tooltip]="richConfig" [config]="richAboveConfig">Rich Above</button>
    <div id="no-tooltip">No tooltip</div>
  `,
  imports: [SmTooltipDirective],
  standalone: true,
})
class TooltipTestComponent {
  defaultTooltipConfig = defaultTooltipConfig;
  customDelayConfig: TooltipConfig = {...defaultTooltipConfig, showDelay: 100, hideDelay: 200};
  positionAboveConfig: TooltipConfig = {...defaultTooltipConfig, position: 'above'};
  positionBelowConfig: TooltipConfig = {...defaultTooltipConfig, position: 'below'};
  positionLeftConfig: TooltipConfig = {...defaultTooltipConfig, position: 'left'};
  positionRightConfig: TooltipConfig = {...defaultTooltipConfig, position: 'right'};
  explicitOnHoverConfig: TooltipConfig = {...defaultTooltipConfig, persistStrategy: 'on-hover'};
  explicitOnHoverWithTooltipConfig: TooltipConfig = {...defaultTooltipConfig, persistStrategy: 'on-hover-with-tooltip'};
  manualTriggerConfig: TooltipConfig = {...defaultTooltipConfig, trigger: 'manual'};
  defaultTriggerConfig: TooltipConfig = {...defaultTooltipConfig, trigger: 'default'};
  customOffsetPlainConfig: TooltipConfig = {...defaultTooltipConfig, positionOffset: 12};
  customOffsetRichConfig: TooltipConfig = {...defaultTooltipConfig, positionOffset: 16};
  richAboveConfig: TooltipConfig = {...defaultTooltipConfig, position: 'above'};

  richConfig: RichTooltipConfig = {
    subhead: 'Rich Tooltip Subhead',
    supportingText: 'This is supporting text for the rich tooltip',
    buttons: [
      {label: 'Action 1', action: () => {}},
      {label: 'Action 2', action: () => {}},
    ],
  };
  richConfigNoButtons: RichTooltipConfig = {
    subhead: 'Rich Tooltip Subhead',
    supportingText: 'This is supporting text for the rich tooltip without buttons',
  };
  customOverlayConfig: OverlayConfig | null = null;

  get customOverlayConfigValue(): TooltipConfig {
    return {...defaultTooltipConfig, overlayConfig: this.customOverlayConfig};
  }
}

describe('SmTooltipDirective', () => {
  let fixture: ComponentFixture<TooltipTestComponent>;
  let overlayContainer: OverlayContainer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TooltipTestComponent, SmTooltipDirective],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(TooltipTestComponent);
    overlayContainer = TestBed.inject(OverlayContainer);
    fixture.detectChanges();
  });

  beforeEach(() => {
    // Reset customOverlayConfig before each test
    fixture.componentInstance.customOverlayConfig = null;
    fixture.detectChanges();
  });

  afterEach(() => {
    // Clean up any overlays
    overlayContainer.ngOnDestroy();
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  describe('Directive Creation', () => {
    it('should create directive on element with sm-tooltip attribute', () => {
      const button = fixture.debugElement.query(By.css('#plain-tooltip'));
      const directive = button.injector.get(SmTooltipDirective);
      expect(directive).toBeTruthy();
    });

    it('should not create directive on element without sm-tooltip', () => {
      const div = fixture.debugElement.query(By.css('#no-tooltip'));
      const directive = div.injector.get(SmTooltipDirective, null);
      expect(directive).toBeNull();
    });
  });

  describe('Tooltip Visibility - Hover', () => {
    it('should show tooltip on mouseenter after delay', async () => {
      vi.useFakeTimers();
      const { hostEl } = getTooltipElements(fixture, '#plain-tooltip');

      hostEl.dispatchEvent(new MouseEvent('mouseenter', {bubbles: true}));
      fixture.detectChanges();

      // Tooltip should not be visible immediately (default delay is 0, but we need to advance timers)
      let tooltip = getTooltipFromOverlay(overlayContainer);
      expect(tooltip).toBeNull();

      // Advance time by default delay (0ms, but timers need to be advanced)
      vi.advanceTimersByTime(0);
      fixture.detectChanges();

      tooltip = getTooltipFromOverlay(overlayContainer);
      expect(tooltip).toBeTruthy();
    });

    it('should hide tooltip on mouseleave after delay', async () => {
      vi.useFakeTimers();
      const { button, hostEl } = getTooltipElements(fixture, '#plain-tooltip');

      showTooltip(fixture, hostEl, 'mouseenter', 0);

      let tooltip = getTooltipFromOverlay(overlayContainer);
      expect(tooltip).toBeTruthy();

      hostEl.dispatchEvent(new MouseEvent('mouseleave', {bubbles: true}));
      fixture.detectChanges();

      tooltip = getTooltipFromOverlay(overlayContainer);
      expect(tooltip).toBeTruthy();

      hideTooltipAndVerifyAnimation(fixture, overlayContainer, button);
    });

    it('should respect custom show delay', async () => {
      vi.useFakeTimers();
      const { hostEl } = getTooltipElements(fixture, '#custom-delay');

      showTooltip(fixture, hostEl, 'mouseenter', 100);

      const tooltip = getTooltipFromOverlay(overlayContainer);
      expect(tooltip).toBeTruthy();
    });

    it('should respect custom hide delay', async () => {
      vi.useFakeTimers();
      const { button, hostEl } = getTooltipElements(fixture, '#custom-delay');

      showTooltip(fixture, hostEl, 'mouseenter', 100);

      hideTooltipAndCompleteAnimation(fixture, button, hostEl, 200);

      const tooltip = getTooltipFromOverlay(overlayContainer);
      expect(tooltip).toBeNull();
    });
  });

  describe('Tooltip Visibility - Focus', () => {
    it('should show tooltip on focus after delay', async () => {
      vi.useFakeTimers();
      const { hostEl } = getTooltipElements(fixture, '#plain-tooltip');

      showTooltip(fixture, hostEl, 'focus', 0);

      const tooltip = getTooltipFromOverlay(overlayContainer);
      expect(tooltip).toBeTruthy();
    });

    it('should hide tooltip on blur after delay', async () => {
      vi.useFakeTimers();
      const { button, hostEl } = getTooltipElements(fixture, '#plain-tooltip');

      showTooltip(fixture, hostEl, 'focus', 0);

      hostEl.dispatchEvent(new FocusEvent('blur', {bubbles: true}));
      vi.advanceTimersByTime(1500);
      fixture.detectChanges();

      // Tooltip should be animating out
      let tooltip = getTooltipFromOverlay(overlayContainer);
      expect(tooltip).toBeTruthy();

      // Manually trigger animation end on component instance
      triggerAnimationEnd(fixture, button);

      tooltip = getTooltipFromOverlay(overlayContainer);
      expect(tooltip).toBeNull();
    });
  });

  describe('Rich Tooltip - Select', () => {
    it('should show rich tooltip on click', async () => {
      vi.useFakeTimers();
      const { hostEl } = getTooltipElements(fixture, '#rich-tooltip');

      showTooltip(fixture, hostEl, 'click', 0);

      const tooltip = getTooltipFromOverlay(overlayContainer);
      expect(tooltip).toBeTruthy();
      expect(tooltip?.getAttribute('data-type')).toBe('rich');
    });
  });

  describe('Plain Tooltip Rendering', () => {
    it('should render plain tooltip with text', async () => {
      vi.useFakeTimers();
      const { hostEl } = getTooltipElements(fixture, '#plain-tooltip');

      showTooltip(fixture, hostEl, 'mouseenter', 0);

      const tooltip = getTooltipFromOverlay(overlayContainer);
      expect(tooltip).toBeTruthy();
      expect(tooltip?.getAttribute('data-type')).toBe('plain');
      expect(tooltip?.getAttribute('role')).toBe('tooltip');

      const text = tooltip?.querySelector('.sm-tooltip-content__plain-text');
      expect(text?.textContent).toBe('Plain tooltip text');
    });
  });

  describe('Rich Tooltip Rendering', () => {
    it('should render rich tooltip with subhead, text, and buttons', async () => {
      vi.useFakeTimers();
      const { hostEl } = getTooltipElements(fixture, '#rich-tooltip');

      showTooltip(fixture, hostEl, 'click', 0);

      const tooltip = getTooltipFromOverlay(overlayContainer);
      expect(tooltip).toBeTruthy();

      const subhead = tooltip?.querySelector('.sm-tooltip-content__rich-subhead');
      expect(subhead?.textContent).toBe('Rich Tooltip Subhead');

      const supportingText = tooltip?.querySelector('.sm-tooltip-content__rich-supporting-text');
      expect(supportingText?.textContent?.trim()).toBe('This is supporting text for the rich tooltip');

      const buttons = tooltip?.querySelectorAll('.sm-tooltip-content__rich-action-button');
      expect(buttons?.length).toBe(2);
      expect(buttons?.[0]?.textContent?.trim()).toBe('Action 1');
      expect(buttons?.[1]?.textContent?.trim()).toBe('Action 2');
    });
  });

  describe('Cleanup', () => {
    it('should cleanup overlay on directive destruction', async () => {
      vi.useFakeTimers();
      const { hostEl, directive } = getTooltipElements(fixture, '#plain-tooltip');

      showTooltip(fixture, hostEl, 'mouseenter', 0);

      let tooltip = getTooltipFromOverlay(overlayContainer);
      expect(tooltip).toBeTruthy();

      directive.ngOnDestroy();
      fixture.detectChanges();

      tooltip = getTooltipFromOverlay(overlayContainer);
      expect(tooltip).toBeNull();
    });
  });

  describe('Animation Lifecycle', () => {
    it('should create tooltip with open=true for enter animation', async () => {
      vi.useFakeTimers();
      const { hostEl, directive } = getTooltipElements(fixture, '#plain-tooltip');

      showTooltip(fixture, hostEl, 'mouseenter', 0);

      const tooltip = getTooltipFromOverlay(overlayContainer);
      expect(tooltip).toBeTruthy();

      // Get the component instance to check open state
      const componentRef = directive.componentRef;
      expect(componentRef?.instance.open()).toBe(true);
    });

    it('should set open=false to trigger leave animation after hide delay', async () => {
      vi.useFakeTimers();
      const { hostEl, directive } = getTooltipElements(fixture, '#plain-tooltip');

      // Show tooltip
      showTooltip(fixture, hostEl, 'mouseenter', 0);

      let tooltip = getTooltipFromOverlay(overlayContainer);
      expect(tooltip).toBeTruthy();

      const componentRef = directive.componentRef;
      expect(componentRef?.instance.open()).toBe(true);

      // Hide tooltip
      hostEl.dispatchEvent(new MouseEvent('mouseleave', {bubbles: true}));
      fixture.detectChanges();

      // Tooltip should still be open
      expect(componentRef?.instance.open()).toBe(true);

      // Advance time by hide delay
      vi.advanceTimersByTime(1500);
      fixture.detectChanges();

      // Tooltip should now have open=false (animating out)
      expect(componentRef?.instance.open()).toBe(false);
    });

    it('should cancel hide timeout when user hovers back during hide timeout', async () => {
      vi.useFakeTimers();
      const { hostEl, directive } = getTooltipElements(fixture, '#plain-tooltip');

      showTooltip(fixture, hostEl, 'mouseenter', 0);

      const componentRef = directive.componentRef;
      expect(componentRef?.instance.open()).toBe(true);

      // Hide tooltip (starts hide timeout)
      hostEl.dispatchEvent(new MouseEvent('mouseleave', {bubbles: true}));
      fixture.detectChanges();

      // Advance time by less than hide delay
      vi.advanceTimersByTime(500);
      fixture.detectChanges();

      expect(componentRef?.instance.open()).toBe(true);

      hostEl.dispatchEvent(new MouseEvent('mouseenter', {bubbles: true}));
      fixture.detectChanges();

      // Advance time by remaining hide delay
      vi.advanceTimersByTime(1000);
      fixture.detectChanges();

      // Tooltip should still be open (timeout was cancelled)
      expect(componentRef?.instance.open()).toBe(true);
    });

    it('should immediately clean up and recreate tooltip when user hovers back during leave animation', async () => {
      vi.useFakeTimers();
      const { hostEl, directive } = getTooltipElements(fixture, '#plain-tooltip');

      showTooltip(fixture, hostEl, 'mouseenter', 0);

      let componentRef = directive.componentRef;
      expect(componentRef?.instance.open()).toBe(true);

      hostEl.dispatchEvent(new MouseEvent('mouseleave', {bubbles: true}));
      vi.advanceTimersByTime(1500); // Complete hide delay
      fixture.detectChanges();

      // Tooltip should now be animating out (open=false)
      expect(componentRef?.instance.open()).toBe(false);

      // Hover back during leave animation
      hostEl.dispatchEvent(new MouseEvent('mouseenter', {bubbles: true}));
      fixture.detectChanges();

      // Old tooltip should be cleaned up immediately
      const oldComponentRef = componentRef;
      vi.advanceTimersByTime(10);
      fixture.detectChanges();

      // New tooltip should be created after show delay
      vi.advanceTimersByTime(0);
      fixture.detectChanges();

      componentRef = directive.componentRef;
      expect(componentRef).toBeTruthy();
      expect(componentRef).not.toBe(oldComponentRef);
      expect(componentRef?.instance.open()).toBe(true);
    });

    it('should trigger cleanup when leave animation completes', async () => {
      vi.useFakeTimers();
      const { button, hostEl } = getTooltipElements(fixture, '#plain-tooltip');

      showTooltip(fixture, hostEl, 'mouseenter', 0);

      let tooltip = getTooltipFromOverlay(overlayContainer);
      expect(tooltip).toBeTruthy();

      hostEl.dispatchEvent(new MouseEvent('mouseleave', {bubbles: true}));
      hideTooltipAndVerifyAnimation(fixture, overlayContainer, button);
    });

    it('should cleanup subscription on directive destruction', async () => {
      vi.useFakeTimers();
      const { hostEl, directive } = getTooltipElements(fixture, '#plain-tooltip');

      showTooltip(fixture, hostEl, 'mouseenter', 0);

      // Check that subscription exists
      const subscription = (directive as any).animationCompleteSubscription;
      expect(subscription).toBeTruthy();

      directive.ngOnDestroy();
      fixture.detectChanges();

      const subscriptionAfterDestroy = (directive as any).animationCompleteSubscription;
      expect(subscriptionAfterDestroy).toBeNull();
    });

    it('should cleanup subscription when tooltip is hidden', async () => {
      vi.useFakeTimers();
      const { hostEl, directive } = getTooltipElements(fixture, '#plain-tooltip');

      showTooltip(fixture, hostEl, 'mouseenter', 0);

      // Check that subscription exists
      let subscription = (directive as any).animationCompleteSubscription;
      expect(subscription).toBeTruthy();

      // Hide tooltip and complete animation
      hostEl.dispatchEvent(new MouseEvent('mouseleave', {bubbles: true}));
      vi.advanceTimersByTime(1500);
      fixture.detectChanges();

      // Get the tooltip component instance
      const tooltip = getTooltipFromOverlay(overlayContainer);
      expect(tooltip).toBeTruthy();

      // Get the component instance to trigger animation end manually
      const componentRef = directive.componentRef;
      expect(componentRef).toBeTruthy();

      // Manually trigger onAnimationEnd to simulate animation completion
      // This is necessary because @if removes the element immediately in tests
      componentRef!.instance.onAnimationEnd();
      fixture.detectChanges();

      subscription = (directive as any).animationCompleteSubscription;
      expect(subscription).toBeNull();
    });
  });

  describe('Tooltip Persistence Strategy', () => {
    it('should use on-hover strategy by default for plain tooltips', async () => {
      const { hostEl, directive } = setupAndShowTooltip(fixture, '#plain-tooltip', 'mouseenter', 0);

      const tooltip = getTooltipFromOverlay(overlayContainer);
      expect(tooltip).toBeTruthy();

      // Leave host - tooltip should start hiding
      hostEl.dispatchEvent(new MouseEvent('mouseleave', {bubbles: true}));
      vi.advanceTimersByTime(1500);
      fixture.detectChanges();

      // Tooltip should be animating out (not kept visible by tooltip hover)
      const componentRef = directive.componentRef;
      expect(componentRef?.instance.open()).toBe(false);
    });

    it('should use on-hover-with-tooltip strategy by default for rich tooltips with buttons', async () => {
      const { directive } = setupShowAndHoverTooltip(fixture, overlayContainer, '#rich-tooltip', 'click');

      // Advance time by hide delay
      vi.advanceTimersByTime(1500);
      fixture.detectChanges();

      // Tooltip should still be open (kept visible by tooltip hover)
      const componentRef = directive.componentRef;
      expect(componentRef?.instance.open()).toBe(true);
    });

    it('should use on-hover strategy by default for rich tooltips without buttons', async () => {
      vi.useFakeTimers();
      const { hostEl, directive } = getTooltipElements(fixture, '#rich-tooltip-no-buttons');

      showTooltip(fixture, hostEl, 'click', 0);

      const tooltip = getTooltipFromOverlay(overlayContainer);
      expect(tooltip).toBeTruthy();

      // Click again to unselect (toggle off) so isSelected doesn't interfere
      hostEl.dispatchEvent(new MouseEvent('click', {bubbles: true}));
      fixture.detectChanges();

      // Leave host - tooltip should start hiding
      hostEl.dispatchEvent(new MouseEvent('mouseleave', {bubbles: true}));
      vi.advanceTimersByTime(1500);
      fixture.detectChanges();

      // Tooltip should be animating out (not kept visible by tooltip hover)
      const componentRef = directive.componentRef;
      expect(componentRef?.instance.open()).toBe(false);
    });

    it('should respect explicit on-hover strategy override', async () => {
      vi.useFakeTimers();
      const { hostEl, directive } = getTooltipElements(fixture, '#explicit-on-hover');

      showTooltip(fixture, hostEl, 'click', 0);

      const tooltip = getTooltipFromOverlay(overlayContainer);
      expect(tooltip).toBeTruthy();

      // Verify no event listeners are attached (on-hover strategy)
      const mouseEnterHandler = (directive as any).tooltipMouseEnterHandler;
      const mouseLeaveHandler = (directive as any).tooltipMouseLeaveHandler;
      expect(mouseEnterHandler).toBeNull();
      expect(mouseLeaveHandler).toBeNull();

      unselectAndHoverTooltip(fixture, overlayContainer, hostEl);

      // Advance time by hide delay
      vi.advanceTimersByTime(1500);
      fixture.detectChanges();

      // Tooltip should be animating out (on-hover strategy doesn't keep it visible when hovering tooltip)
      const componentRef = directive.componentRef;
      expect(componentRef?.instance.open()).toBe(false);
    });

    it('should respect explicit on-hover-with-tooltip strategy override', async () => {
      vi.useFakeTimers();
      const { hostEl, directive } = getTooltipElements(fixture, '#explicit-on-hover-with-tooltip');

      showTooltip(fixture, hostEl, 'mouseenter', 0);

      const tooltip = getTooltipFromOverlay(overlayContainer);
      expect(tooltip).toBeTruthy();

      // Leave host
      hostEl.dispatchEvent(new MouseEvent('mouseleave', {bubbles: true}));
      fixture.detectChanges();

      // Hover over tooltip container
      const overlayPane = overlayContainer.getContainerElement().querySelector('.cdk-overlay-pane');
      overlayPane?.dispatchEvent(new MouseEvent('mouseenter', {bubbles: true}));
      fixture.detectChanges();

      // Advance time by hide delay
      vi.advanceTimersByTime(1500);
      fixture.detectChanges();

      // Tooltip should still be open (on-hover-with-tooltip strategy keeps it visible)
      const componentRef = directive.componentRef;
      expect(componentRef?.instance.open()).toBe(true);
    });

    it('should hide tooltip when leaving tooltip container with on-hover strategy', async () => {
      const { hostEl } = setupAndShowTooltip(fixture, '#plain-tooltip', 'mouseenter', 0);
      const button = fixture.debugElement.query(By.css('#plain-tooltip'));

      const tooltip = getTooltipFromOverlay(overlayContainer);
      expect(tooltip).toBeTruthy();

      hostEl.dispatchEvent(new MouseEvent('mouseleave', {bubbles: true}));
      vi.advanceTimersByTime(1500);
      fixture.detectChanges();

      // Manually trigger animation end
      triggerAnimationEnd(fixture, button);

      const tooltipAfter = getTooltipFromOverlay(overlayContainer);
      expect(tooltipAfter).toBeNull();
    });

    it('should hide tooltip when leaving both host and tooltip with on-hover-with-tooltip strategy', async () => {
      vi.useFakeTimers();
      const { hostEl, directive } = getTooltipElements(fixture, '#rich-tooltip');

      // Show tooltip
      showTooltip(fixture, hostEl, 'click', 0);

      const tooltip = getTooltipFromOverlay(overlayContainer);
      expect(tooltip).toBeTruthy();

      unselectAndHoverTooltip(fixture, overlayContainer, hostEl);

      // Advance time - tooltip should still be visible
      vi.advanceTimersByTime(1500);
      fixture.detectChanges();

      let componentRef = directive.componentRef;
      expect(componentRef?.instance.open()).toBe(true);

      // Leave tooltip container
      const overlayPane = overlayContainer.getContainerElement().querySelector('.cdk-overlay-pane');
      overlayPane?.dispatchEvent(new MouseEvent('mouseleave', {bubbles: true}));
      fixture.detectChanges();

      // Advance time by hide delay
      vi.advanceTimersByTime(1500);
      fixture.detectChanges();

      // Tooltip should now be animating out
      componentRef = directive.componentRef;
      expect(componentRef?.instance.open()).toBe(false);
    });

    it('should cancel hide timeout when hovering over tooltip container with on-hover-with-tooltip strategy', async () => {
      const { directive } = setupShowAndLeaveHost(fixture, overlayContainer, '#rich-tooltip', 'click');

      // Advance time by less than hide delay
      vi.advanceTimersByTime(500);
      fixture.detectChanges();

      // Hover over tooltip container (should cancel hide timeout)
      const overlayPane = overlayContainer.getContainerElement().querySelector('.cdk-overlay-pane');
      overlayPane?.dispatchEvent(new MouseEvent('mouseenter', {bubbles: true}));
      fixture.detectChanges();

      // Advance time by remaining hide delay
      vi.advanceTimersByTime(1000);
      fixture.detectChanges();

      // Tooltip should still be open (timeout was cancelled)
      const componentRef = directive.componentRef;
      expect(componentRef?.instance.open()).toBe(true);
    });

    it('should clean up event listeners when tooltip is hidden', async () => {
      vi.useFakeTimers();
      const { button, hostEl, directive } = getTooltipElements(fixture, '#rich-tooltip');

      // Show tooltip
      showTooltip(fixture, hostEl, 'click', 0);

      // Check that event listeners are attached
      let mouseEnterHandler = (directive as any).tooltipMouseEnterHandler;
      let mouseLeaveHandler = (directive as any).tooltipMouseLeaveHandler;
      expect(mouseEnterHandler).toBeTruthy();
      expect(mouseLeaveHandler).toBeTruthy();

      // Click again to unselect (toggle off)
      hostEl.dispatchEvent(new MouseEvent('click', {bubbles: true}));
      fixture.detectChanges();

      // Leave host
      hostEl.dispatchEvent(new MouseEvent('mouseleave', {bubbles: true}));
      fixture.detectChanges();

      // Leave tooltip container
      const overlayPane = overlayContainer.getContainerElement().querySelector('.cdk-overlay-pane');
      overlayPane?.dispatchEvent(new MouseEvent('mouseleave', {bubbles: true}));
      vi.advanceTimersByTime(1500);
      fixture.detectChanges();

      // Manually trigger animation end
      triggerAnimationEnd(fixture, button);

      // Event listeners should be cleaned up
      mouseEnterHandler = (directive as any).tooltipMouseEnterHandler;
      mouseLeaveHandler = (directive as any).tooltipMouseLeaveHandler;
      expect(mouseEnterHandler).toBeNull();
      expect(mouseLeaveHandler).toBeNull();
    });
  });

  describe('Controlled Tooltip Control', () => {
    it('should open tooltip via controller', async () => {
      vi.useFakeTimers();
      const { directive } = getTooltipElements(fixture, '#programmatic-tooltip');

      directive.open();
      fixture.detectChanges();

      const tooltip = getTooltipFromOverlay(overlayContainer);
      expect(tooltip).toBeTruthy();

      // Verify tooltip is open
      const componentRef = directive.componentRef;
      expect(componentRef?.instance.open()).toBe(true);
    });

    it('should close tooltip via controller', async () => {
      vi.useFakeTimers();
      const { button, directive } = getTooltipElements(fixture, '#programmatic-tooltip');

      testControlledOpenClose(fixture, overlayContainer, button, directive);
    });

    it('should ignore all user events when controlled', async () => {
      vi.useFakeTimers();

      // Test cases: [buttonId, eventType, eventClass, advanceTimers]
      const testCases = [
        { buttonId: '#programmatic-tooltip', eventType: 'mouseenter', eventClass: MouseEvent, advanceTimers: false },
        { buttonId: '#programmatic-tooltip', eventType: 'mouseleave', eventClass: MouseEvent, advanceTimers: true },
        { buttonId: '#programmatic-tooltip', eventType: 'focus', eventClass: FocusEvent, advanceTimers: false },
        { buttonId: '#programmatic-tooltip', eventType: 'blur', eventClass: FocusEvent, advanceTimers: true },
        { buttonId: '#rich-tooltip', eventType: 'click', eventClass: MouseEvent, advanceTimers: false },
      ];

      for (const testCase of testCases) {
        const { hostEl, directive } = getTooltipElements(fixture, testCase.buttonId);

        directive.open();
        fixture.detectChanges();

        const componentRef = directive.componentRef;
        expect(componentRef?.instance.open()).toBe(true);

        // Dispatch event - should not affect tooltip
        hostEl.dispatchEvent(new testCase.eventClass(testCase.eventType, {bubbles: true}));
        if (testCase.advanceTimers) {
          vi.advanceTimersByTime(1500);
        }
        fixture.detectChanges();

        expect(componentRef?.instance.open()).toBe(true);

        // Clean up for next test case
        directive.close();
        fixture.detectChanges();
        const cleanupButton = fixture.debugElement.query(By.css(testCase.buttonId));
        if (cleanupButton) {
          triggerAnimationEnd(fixture, cleanupButton);
        }
      }

      // Test tooltip container hover separately (requires overlay pane)
      const { directive } = getTooltipElements(fixture, '#rich-tooltip');

      directive.open();
      fixture.detectChanges();

      const componentRef = directive.componentRef;
      expect(componentRef?.instance.open()).toBe(true);

      // Hover over tooltip container - should not affect tooltip
      const overlayPane = overlayContainer.getContainerElement().querySelector('.cdk-overlay-pane');
      overlayPane?.dispatchEvent(new MouseEvent('mouseenter', {bubbles: true}));
      fixture.detectChanges();

      // Leave tooltip container - should not affect tooltip
      overlayPane?.dispatchEvent(new MouseEvent('mouseleave', {bubbles: true}));
      vi.advanceTimersByTime(1500);
      fixture.detectChanges();

      // Tooltip should still be open
      expect(componentRef?.instance.open()).toBe(true);
    });

    it('should resume normal behavior after controlled close', async () => {
      vi.useFakeTimers();
      const button = fixture.debugElement.query(By.css('#programmatic-tooltip'));
      const hostEl = button.nativeElement as HTMLElement;
      const directive = button.injector.get(SmTooltipDirective);

      directive.open();
      fixture.detectChanges();

      directive.close();
      fixture.detectChanges();

      // Manually trigger animation end
      triggerAnimationEnd(fixture, button);

      let tooltip = getTooltipFromOverlay(overlayContainer);
      expect(tooltip).toBeNull();

      // Now hover should work normally
      hostEl.dispatchEvent(new MouseEvent('mouseenter', {bubbles: true}));
      vi.advanceTimersByTime(0);
      fixture.detectChanges();

      tooltip = getTooltipFromOverlay(overlayContainer);
      expect(tooltip).toBeTruthy();
    });

    it('should allow controlled open after normal hover close', async () => {
      vi.useFakeTimers();
      const button = fixture.debugElement.query(By.css('#programmatic-tooltip'));
      const hostEl = button.nativeElement as HTMLElement;
      const directive = button.injector.get(SmTooltipDirective);

      hostEl.dispatchEvent(new MouseEvent('mouseenter', {bubbles: true}));
      vi.advanceTimersByTime(0);
      fixture.detectChanges();

      let tooltip = getTooltipFromOverlay(overlayContainer);
      expect(tooltip).toBeTruthy();

      hostEl.dispatchEvent(new MouseEvent('mouseleave', {bubbles: true}));
      vi.advanceTimersByTime(1500);
      fixture.detectChanges();

      // Manually trigger animation end
      triggerAnimationEnd(fixture, button);

      tooltip = getTooltipFromOverlay(overlayContainer);
      expect(tooltip).toBeNull();

      // Now controlled open should work
      directive.open();
      fixture.detectChanges();

      tooltip = getTooltipFromOverlay(overlayContainer);
      expect(tooltip).toBeTruthy();
    });
  });

  describe('Tooltip Trigger Mode', () => {
    it('should not trigger tooltip on hover when trigger mode is manual', async () => {
      vi.useFakeTimers();
      const { hostEl } = getTooltipElements(fixture, '#manual-tooltip');

      // Hover over host - should not trigger tooltip
      showTooltip(fixture, hostEl, 'mouseenter', 0);

      const tooltip = getTooltipFromOverlay(overlayContainer);
      expect(tooltip).toBeNull();
    });

    it('should not trigger tooltip on focus when trigger mode is manual', async () => {
      vi.useFakeTimers();
      const { hostEl } = getTooltipElements(fixture, '#manual-tooltip');

      // Focus host - should not trigger tooltip
      showTooltip(fixture, hostEl, 'focus', 0);

      const tooltip = getTooltipFromOverlay(overlayContainer);
      expect(tooltip).toBeNull();
    });

    it('should not trigger tooltip on click when trigger mode is manual', async () => {
      vi.useFakeTimers();
      const { hostEl } = getTooltipElements(fixture, '#manual-tooltip');

      // Click host - should not trigger tooltip
      showTooltip(fixture, hostEl, 'click', 0);

      const tooltip = getTooltipFromOverlay(overlayContainer);
      expect(tooltip).toBeNull();
    });

    it('should allow controlled open when trigger mode is manual', async () => {
      vi.useFakeTimers();
      const { directive } = getTooltipElements(fixture, '#manual-tooltip');

      directive.open();
      fixture.detectChanges();

      const tooltip = getTooltipFromOverlay(overlayContainer);
      expect(tooltip).toBeTruthy();

      // Verify tooltip is open
      const componentRef = directive.componentRef;
      expect(componentRef?.instance.open()).toBe(true);
    });

    it('should allow controlled close when trigger mode is manual', async () => {
      vi.useFakeTimers();
      const { button, directive } = getTooltipElements(fixture, '#manual-tooltip');

      testControlledOpenClose(fixture, overlayContainer, button, directive);
    });

    it('should trigger tooltip on hover when trigger mode is default', async () => {
      vi.useFakeTimers();
      const { hostEl } = getTooltipElements(fixture, '#default-tooltip');

      // Hover over host - should trigger tooltip
      showTooltip(fixture, hostEl, 'mouseenter', 0);

      const tooltip = getTooltipFromOverlay(overlayContainer);
      expect(tooltip).toBeTruthy();
    });

    it('should allow controlled open/close when trigger mode is default', async () => {
      vi.useFakeTimers();
      const { button, directive } = getTooltipElements(fixture, '#default-tooltip');

      testControlledOpenClose(fixture, overlayContainer, button, directive);
    });
  });

  describe('Custom Overlay Config', () => {
    it('should use default overlay config when custom config is not provided', async () => {
      vi.useFakeTimers();
      const { hostEl, directive } = getTooltipElements(fixture, '#plain-tooltip');

      // Show tooltip
      showTooltip(fixture, hostEl, 'mouseenter', 0);

      const overlayRef = directive.overlayRef;
      expect(overlayRef).toBeTruthy();

      const config = getOverlayConfig(directive);
      expect(config).toBeTruthy();
      expect(config!.maxWidth).toBe('14.2857rem');
      expect(config!.hasBackdrop).toBe(false);
      expect(config!.disposeOnNavigation).toBe(true);
      expect(config!.positionStrategy).toBeTruthy();
    });

    it('should use custom overlay config explicit values when provided', async () => {
      const customConfig = new OverlayConfig({
        panelClass: ['custom-panel-class'],
        hasBackdrop: true,
        maxWidth: '500px',
      });

      const { directive } = setupCustomOverlayConfigTest(TestBed, TooltipTestComponent, customConfig);

      const overlayRef = directive.overlayRef;
      expect(overlayRef).toBeTruthy();

      const config = getOverlayConfig(directive);
      expect(config).toBeTruthy();
      expect(config!.panelClass).toContain('custom-panel-class');
      expect(config!.hasBackdrop).toBe(true);
      expect(config!.maxWidth).toBe('500px');
    });

    it('should use default values for undefined properties in custom config', async () => {
      // Create config with only some properties set, others undefined
      const customConfig = new OverlayConfig({
        panelClass: ['custom-panel-class'],
        // maxWidth is undefined, should use default
        // hasBackdrop is undefined, should use default
      });

      const { directive } = setupCustomOverlayConfigTest(TestBed, TooltipTestComponent, customConfig);

      const overlayRef = directive.overlayRef;
      expect(overlayRef).toBeTruthy();

      const config = getOverlayConfig(directive);
      expect(config).toBeTruthy();
      // Custom property should be used
      expect(config!.panelClass).toContain('custom-panel-class');
      // Undefined properties should use defaults
      expect(config!.maxWidth).toBe('14.2857rem'); // default for plain tooltip
      expect(config!.hasBackdrop).toBe(false); // default
    });

    it('should use explicitly set null/empty values from custom config', async () => {
      const customConfig = new OverlayConfig({
        panelClass: [], // empty array - should be used
        hasBackdrop: null as any, // null - should be used
        maxWidth: null as any, // null - should be used
      });

      const { directive } = setupCustomOverlayConfigTest(TestBed, TooltipTestComponent, customConfig);

      const overlayRef = directive.overlayRef;
      expect(overlayRef).toBeTruthy();

      const config = getOverlayConfig(directive);
      expect(config).toBeTruthy();
      // Explicitly set values should be used, even if null/empty
      expect(config!.panelClass).toEqual([]);
      expect(config!.hasBackdrop).toBeNull();
      expect(config!.maxWidth).toBeNull();
    });

    it('should allow user to override positionStrategy', async () => {
      const overlayService = TestBed.inject(Overlay);
      const customPositionStrategy = overlayService.position().global().centerHorizontally().centerVertically();

      const customConfig = new OverlayConfig({
        positionStrategy: customPositionStrategy,
      });

      const { directive } = setupCustomOverlayConfigTest(TestBed, TooltipTestComponent, customConfig);

      const overlayRef = directive.overlayRef;
      expect(overlayRef).toBeTruthy();

      const config = getOverlayConfig(directive);
      expect(config).toBeTruthy();
      // Custom position strategy should be used
      expect(config!.positionStrategy).toBe(customPositionStrategy);
    });
  });

  describe('Disabled State Handling', () => {
    it('should not show tooltip on hover when host has disabled attribute', () => {
      vi.useFakeTimers();
      const { hostEl } = getTooltipElements(fixture, '#disabled-button');

      hostEl.dispatchEvent(new MouseEvent('mouseenter', {bubbles: true}));
      fixture.detectChanges();

      vi.advanceTimersByTime(1000);
      fixture.detectChanges();

      const tooltip = getTooltipFromOverlay(overlayContainer);
      expect(tooltip).toBeNull();
    });

    it('should not show tooltip on focus when host is disabled', () => {
      vi.useFakeTimers();
      const { hostEl } = getTooltipElements(fixture, '#disabled-button');

      hostEl.dispatchEvent(new FocusEvent('focus', {bubbles: true}));
      fixture.detectChanges();

      vi.advanceTimersByTime(1000);
      fixture.detectChanges();

      const tooltip = getTooltipFromOverlay(overlayContainer);
      expect(tooltip).toBeNull();
    });

    it('should not show tooltip on click when host is disabled', () => {
      vi.useFakeTimers();
      const { hostEl } = getTooltipElements(fixture, '#disabled-button');

      hostEl.dispatchEvent(new MouseEvent('click', {bubbles: true}));
      fixture.detectChanges();

      vi.advanceTimersByTime(1000);
      fixture.detectChanges();

      const tooltip = getTooltipFromOverlay(overlayContainer);
      expect(tooltip).toBeNull();
    });

    it('should allow manual open when host is disabled', () => {
      vi.useFakeTimers();
      const { directive } = getTooltipElements(fixture, '#disabled-programmatic-tooltip');

      directive.open();
      fixture.detectChanges();

      const tooltip = getTooltipFromOverlay(overlayContainer);
      expect(tooltip).toBeTruthy();
      expect(tooltip?.textContent?.trim()).toBe('Disabled controlled tooltip');
    });

    it('should allow manual close when host is disabled', () => {
      vi.useFakeTimers();
      const { button, directive } = getTooltipElements(fixture, '#disabled-programmatic-tooltip');

      // Open tooltip first
      directive.open();
      fixture.detectChanges();

      let tooltip = getTooltipFromOverlay(overlayContainer);
      expect(tooltip).toBeTruthy();

      // Close tooltip
      directive.close();
      fixture.detectChanges();

      // Trigger animation end to complete cleanup
      triggerAnimationEnd(fixture, button);

      tooltip = getTooltipFromOverlay(overlayContainer);
      expect(tooltip).toBeNull();
    });
  });

  describe('Default Position', () => {
    it('should default to "above" for plain tooltips when position is not specified', async () => {
      const { positionData } = getPositionDataForTooltip(fixture, '#plain-tooltip', 'mouseenter');
      expect(positionData).toBeTruthy();
      expect(positionData!.positions).toBeTruthy();
      expect(positionData!.positions.length).toBeGreaterThan(0);

      const firstPosition = positionData!.positions[0];
      // For 'above' position, first position should have negative offsetY
      expect(firstPosition.offsetY).toBeLessThan(0);
      // Verify it's using 'above' by checking the origin/overlay positions
      expect(firstPosition.originY).toBe('top');
      expect(firstPosition.overlayY).toBe('bottom');
    });

    it('should default to "below" for rich tooltips when position is not specified', async () => {
      const { positionData } = getPositionDataForTooltip(fixture, '#rich-tooltip', 'click');
      expect(positionData).toBeTruthy();
      expect(positionData!.positions).toBeTruthy();
      expect(positionData!.positions.length).toBeGreaterThan(0);

      const firstPosition = positionData!.positions[0];
      // For 'below' position, first position should have positive offsetY
      expect(firstPosition.offsetY).toBeGreaterThan(0);
      // Verify it's using 'below' by checking the origin/overlay positions
      expect(firstPosition.originY).toBe('bottom');
      expect(firstPosition.overlayY).toBe('top');
    });

    it('should use explicit position override for plain tooltips', async () => {
      const { positionData } = getPositionDataForTooltip(fixture, '#position-below', 'mouseenter');
      expect(positionData).toBeTruthy();
      expect(positionData!.positions).toBeTruthy();

      // Should use 'below' position even though it's a plain tooltip
      const firstPosition = positionData!.positions[0];
      expect(firstPosition.originY).toBe('bottom');
      expect(firstPosition.overlayY).toBe('top');
    });

    it('should use explicit position override for rich tooltips', async () => {
      const { positionData } = getPositionDataForTooltip(fixture, '#rich-above', 'click');
      expect(positionData).toBeTruthy();
      expect(positionData!.positions).toBeTruthy();

      // Should use 'above' position even though it's a rich tooltip (which would default to 'below')
      const firstPosition = positionData!.positions[0];
      expect(firstPosition.originY).toBe('top');
      expect(firstPosition.overlayY).toBe('bottom');
    });
  });

  describe('Position Offset', () => {
    it('should use default offset of 4 for plain tooltips when not provided', async () => {
      const { offset } = getOffsetForTooltip(fixture, '#plain-tooltip', 'mouseenter');
      // Check that offset is 4 (for 'above' position, first position has -4 offset)
      // The offset is applied as the 4th parameter in ConnectionPositionPair
      expect(offset).toBe(4);
    });

    it('should use default offset of 8 for rich tooltips when not provided', async () => {
      const { offset } = getOffsetForTooltip(fixture, '#rich-tooltip', 'click');
      // Check that offset is 8 for rich tooltip
      expect(offset).toBe(8);
    });

    it('should use custom offset when provided', async () => {
      const { offset } = getOffsetForTooltip(fixture, '#custom-offset-plain', 'mouseenter');
      // Check that custom offset of 12 is used
      expect(offset).toBe(12);
    });

    it('should use custom offset for rich tooltips when provided', async () => {
      const { offset } = getOffsetForTooltip(fixture, '#custom-offset-rich', 'click');
      // Check that custom offset of 16 is used (overrides default 8 for rich)
      expect(offset).toBe(16);
    });
  });
});

describe('TooltipContentComponent', () => {
  let component: TooltipContentComponent;
  let fixture: ComponentFixture<TooltipContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TooltipContentComponent, SmButtonComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(TooltipContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render plain tooltip when type is plain', () => {
    fixture.componentRef.setInput('type', 'plain');
    fixture.componentRef.setInput('text', 'Test text');
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('.sm-tooltip-content__plain-container');
    expect(container).toBeTruthy();
    const text = fixture.nativeElement.querySelector('.sm-tooltip-content__plain-text');
    expect(text?.textContent).toBe('Test text');
  });

  it('should render rich tooltip when type is rich', () => {
    const config: RichTooltipConfig = {
      subhead: 'Subhead',
      supportingText: 'Supporting text',
      buttons: [{label: 'Button 1'}],
    };
    fixture.componentRef.setInput('type', 'rich');
    fixture.componentRef.setInput('config', config);
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('.sm-tooltip-content__rich-container');
    expect(container).toBeTruthy();
    const subhead = fixture.nativeElement.querySelector('.sm-tooltip-content__rich-subhead');
    expect(subhead?.textContent).toBe('Subhead');
      const supportingText = fixture.nativeElement.querySelector('.sm-tooltip-content__rich-supporting-text');
      expect(supportingText?.textContent?.trim()).toBe('Supporting text');
  });

  it('should call button action on click', () => {
    const actionSpy = vi.fn();
    const config: RichTooltipConfig = {
      supportingText: 'Text',
      buttons: [{label: 'Button', action: actionSpy}],
    };
    fixture.componentRef.setInput('type', 'rich');
    fixture.componentRef.setInput('config', config);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('.sm-tooltip-content__rich-action-button');
    button?.click();
    expect(actionSpy).toHaveBeenCalledTimes(1);
  });

  it('should have role="tooltip" attribute', () => {
    const element = fixture.nativeElement;
    expect(element.getAttribute('role')).toBe('tooltip');
  });

    it('should emit closingAnimationComplete when open is false and animation ends', () => {
      // First set open to true so the div exists
      fixture.componentRef.setInput('open', true);
      fixture.detectChanges();

      const emitSpy = vi.spyOn(component.closingAnimationComplete, 'emit');

      // Get the div before setting open to false
      let div = fixture.nativeElement.querySelector('div[role="tooltip"]');
      expect(div).toBeTruthy();

      // Then trigger leave animation by setting open to false
      // Note: In Angular, @if removes the element immediately when open() becomes false
      // So we need to dispatch the event before the change detection removes it
      // For this test, we'll manually call onAnimationEnd with open=false
      component.open.set(false);
      fixture.detectChanges();

      // Since the div is removed by @if, we need to test the method directly
      // or simulate the scenario where the animation end happens while open is false
      component.onAnimationEnd();
      fixture.detectChanges();

      expect(emitSpy).toHaveBeenCalledTimes(1);
    });

    it('should not emit closingAnimationComplete when open is true and animation ends', () => {
      fixture.componentRef.setInput('open', true);
      fixture.detectChanges();

      const emitSpy = vi.spyOn(component.closingAnimationComplete, 'emit');

      // Simulate animation end
      const div = fixture.nativeElement.querySelector('div[role="tooltip"]');
      const animationEndEvent = new Event('animationend', {bubbles: true});
      div?.dispatchEvent(animationEndEvent);
      fixture.detectChanges();

      expect(emitSpy).not.toHaveBeenCalled();
  });
});
