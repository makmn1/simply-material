import {ComponentFixture} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {OverlayContainer, OverlayConfig} from '@angular/cdk/overlay';
import {vi} from 'vitest';
import {expect} from 'vitest';
import {SmTooltipDirective} from './tooltip';

// Helper functions for tooltip tests

export function getTooltipElements<T>(
  fixture: ComponentFixture<T>,
  selector: string
) {
  const button = fixture.debugElement.query(By.css(selector));
  const hostEl = button.nativeElement as HTMLElement;
  const directive = button.injector.get(SmTooltipDirective);
  return {button, hostEl, directive};
}

export function getTooltipFromOverlay(overlayContainer: OverlayContainer): Element | null {
  return overlayContainer.getContainerElement().querySelector('sm-tooltip-content');
}

export function showTooltip<T>(
  fixture: ComponentFixture<T>,
  hostEl: HTMLElement,
  eventType: 'mouseenter' | 'focus' | 'click',
  delay: number = 0
) {
  if (eventType === 'mouseenter') {
    hostEl.dispatchEvent(new MouseEvent('mouseenter', {bubbles: true}));
  } else if (eventType === 'focus') {
    hostEl.dispatchEvent(new FocusEvent('focus', {bubbles: true}));
  } else if (eventType === 'click') {
    hostEl.dispatchEvent(new MouseEvent('click', {bubbles: true}));
  }
  vi.advanceTimersByTime(delay);
  fixture.detectChanges();
}

export function triggerAnimationEnd<T>(
  fixture: ComponentFixture<T>,
  button: any
) {
  const directive = button.injector.get(SmTooltipDirective);
  const componentRef = directive.componentRef;
  if (componentRef) {
    componentRef.instance.onAnimationEnd();
    fixture.detectChanges();
  }
}

export function hideTooltipAndCompleteAnimation<T>(
  fixture: ComponentFixture<T>,
  button: any,
  hostEl: HTMLElement,
  hideDelay: number = 1500
) {
  hostEl.dispatchEvent(new MouseEvent('mouseleave', {bubbles: true}));
  vi.advanceTimersByTime(hideDelay);
  fixture.detectChanges();
  triggerAnimationEnd(fixture, button);
}

export function getOverlayConfig(directive: SmTooltipDirective) {
  const overlayRef = directive.overlayRef;
  if (!overlayRef) {
    return null;
  }
  return overlayRef.getConfig();
}

export function getPositionStrategy(directive: SmTooltipDirective) {
  const config = getOverlayConfig(directive);
  if (!config) {
    return null;
  }
  const positionStrategy = config.positionStrategy as any;
  const positions = positionStrategy._preferredPositions || positionStrategy._positions;
  return {positionStrategy, positions};
}

export function createFixtureWithOverlayConfig<T>(
  TestBed: any,
  componentClass: new (...args: any[]) => T,
  overlayConfig: OverlayConfig
): ComponentFixture<T> {
  const customFixture = TestBed.createComponent(componentClass);
  (customFixture.componentInstance as any).customOverlayConfig = overlayConfig;
  customFixture.detectChanges();
  return customFixture;
}

export function getTooltipElementsFromCustomFixture<T>(
  customFixture: ComponentFixture<T>,
  selector: string
) {
  const button = customFixture.debugElement.query(By.css(selector));
  const hostEl = button.nativeElement as HTMLElement;
  const directive = button.injector.get(SmTooltipDirective);
  return {button, hostEl, directive};
}

export function showTooltipInCustomFixture<T>(
  customFixture: ComponentFixture<T>,
  hostEl: HTMLElement
) {
  hostEl.dispatchEvent(new MouseEvent('mouseenter', {bubbles: true}));
  vi.advanceTimersByTime(0);
  customFixture.detectChanges();
}

export function testControlledOpenClose<T>(
  fixture: ComponentFixture<T>,
  overlayContainer: OverlayContainer,
  button: any,
  directive: SmTooltipDirective
) {
  directive.open();
  fixture.detectChanges();

  let tooltip = getTooltipFromOverlay(overlayContainer);
  expect(tooltip).toBeTruthy();

  directive.close();
  fixture.detectChanges();

  // Tooltip should be animating out
  const componentRef = directive.componentRef;
  expect(componentRef?.instance.open()).toBe(false);

  // Manually trigger animation end
  triggerAnimationEnd(fixture, button);

  // Tooltip should be cleaned up
  tooltip = getTooltipFromOverlay(overlayContainer);
  expect(tooltip).toBeNull();
}

export function unselectAndHoverTooltip<T>(
  fixture: ComponentFixture<T>,
  overlayContainer: OverlayContainer,
  hostEl: HTMLElement
) {
  // Click again to unselect (toggle off) so isSelected doesn't interfere
  hostEl.dispatchEvent(new MouseEvent('click', {bubbles: true}));
  fixture.detectChanges();

  // Leave host
  hostEl.dispatchEvent(new MouseEvent('mouseleave', {bubbles: true}));
  fixture.detectChanges();

  // Hover over tooltip container
  const overlayPane = overlayContainer.getContainerElement().querySelector('.cdk-overlay-pane');
  overlayPane?.dispatchEvent(new MouseEvent('mouseenter', {bubbles: true}));
  fixture.detectChanges();
}

// New helper functions for duplicated patterns

export function setupAndShowTooltip<T>(
  fixture: ComponentFixture<T>,
  selector: string,
  eventType: 'mouseenter' | 'focus' | 'click' = 'mouseenter',
  delay: number = 0
) {
  vi.useFakeTimers();
  const {hostEl, directive} = getTooltipElements(fixture, selector);
  showTooltip(fixture, hostEl, eventType, delay);
  return {hostEl, directive};
}

export function setupCustomOverlayConfigTest<T>(
  TestBed: any,
  componentClass: new (...args: any[]) => T,
  overlayConfig: OverlayConfig,
  selector: string = '#custom-config-tooltip'
) {
  vi.useFakeTimers();
  const customFixture = createFixtureWithOverlayConfig(TestBed, componentClass, overlayConfig);
  const {hostEl, directive} = getTooltipElementsFromCustomFixture(customFixture, selector);
  showTooltipInCustomFixture(customFixture, hostEl);
  return {customFixture, hostEl, directive};
}

export function getPositionDataForTooltip<T>(
  fixture: ComponentFixture<T>,
  selector: string,
  eventType: 'mouseenter' | 'focus' | 'click' = 'mouseenter'
) {
  vi.useFakeTimers();
  const {hostEl, directive} = getTooltipElements(fixture, selector);
  showTooltip(fixture, hostEl, eventType, 0);
  const positionData = getPositionStrategy(directive);
  return {hostEl, directive, positionData};
}

export function getOffsetForTooltip<T>(
  fixture: ComponentFixture<T>,
  selector: string,
  eventType: 'mouseenter' | 'focus' | 'click' = 'mouseenter'
) {
  vi.useFakeTimers();
  const {hostEl, directive} = getTooltipElements(fixture, selector);
  showTooltip(fixture, hostEl, eventType, 0);
  const positionData = getPositionStrategy(directive);
  if (!positionData || !positionData.positions || positionData.positions.length === 0) {
    return {hostEl, directive, positionData: null, firstPosition: null, offset: null};
  }
  const firstPosition = positionData.positions[0];
  const offset = Math.abs(firstPosition.offsetY || firstPosition.offsetX || 0);
  return {hostEl, directive, positionData, firstPosition, offset};
}

export function hideTooltipAndVerifyAnimation<T>(
  fixture: ComponentFixture<T>,
  overlayContainer: OverlayContainer,
  button: any,
  hideDelay: number = 1500
) {
  // Advance time by hide delay
  vi.advanceTimersByTime(hideDelay);
  fixture.detectChanges();

  // Tooltip should now be animating out (open=false)
  let tooltip = getTooltipFromOverlay(overlayContainer);
  expect(tooltip).toBeTruthy();

  // Manually trigger animation end on component instance
  triggerAnimationEnd(fixture, button);

  tooltip = getTooltipFromOverlay(overlayContainer);
  expect(tooltip).toBeNull();
}

function setupShowAndVerifyTooltip<T>(
  fixture: ComponentFixture<T>,
  overlayContainer: OverlayContainer,
  selector: string,
  eventType: 'mouseenter' | 'focus' | 'click' = 'click'
) {
  vi.useFakeTimers();
  const {hostEl, directive} = getTooltipElements(fixture, selector);
  showTooltip(fixture, hostEl, eventType, 0);
  const tooltip = getTooltipFromOverlay(overlayContainer);
  expect(tooltip).toBeTruthy();
  return {hostEl, directive};
}

export function setupShowAndHoverTooltip<T>(
  fixture: ComponentFixture<T>,
  overlayContainer: OverlayContainer,
  selector: string,
  eventType: 'mouseenter' | 'focus' | 'click' = 'click'
) {
  const {hostEl, directive} = setupShowAndVerifyTooltip(fixture, overlayContainer, selector, eventType);
  hostEl.dispatchEvent(new MouseEvent('mouseleave', {bubbles: true}));
  fixture.detectChanges();
  // Hover over tooltip container
  const overlayPane = overlayContainer.getContainerElement().querySelector('.cdk-overlay-pane');
  expect(overlayPane).toBeTruthy();
  overlayPane?.dispatchEvent(new MouseEvent('mouseenter', {bubbles: true}));
  fixture.detectChanges();
  return {hostEl, directive};
}

export function setupShowAndLeaveHost<T>(
  fixture: ComponentFixture<T>,
  overlayContainer: OverlayContainer,
  selector: string,
  eventType: 'mouseenter' | 'focus' | 'click' = 'click'
) {
  const {hostEl, directive} = setupShowAndVerifyTooltip(fixture, overlayContainer, selector, eventType);
  // Leave host (starts hide timeout)
  hostEl.dispatchEvent(new MouseEvent('mouseleave', {bubbles: true}));
  fixture.detectChanges();
  return {hostEl, directive};
}

