import {
  ComponentRef,
  computed,
  Directive,
  ElementRef,
  inject,
  input,
  OnDestroy,
  signal,
} from '@angular/core';
import {
  ConnectionPositionPair,
  Overlay,
  OverlayConfig,
  OverlayRef,
  CdkOverlayOrigin
} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import {TooltipContentComponent, RichTooltipConfig} from './tooltip-content.component';

export type TooltipPosition = 'above' | 'below' | 'left' | 'right';

export interface TooltipConfig {
  position?: TooltipPosition | null;
  showDelay?: number;
  hideDelay?: number;
  persistStrategy?: 'on-hover' | 'on-hover-with-tooltip' | null;
  trigger?: 'manual' | 'default';
  overlayConfig?: OverlayConfig | null;
  positionOffset?: number | null;
}

@Directive({
  selector: '[sm-tooltip]',
  exportAs: 'smTooltip',
  hostDirectives: [CdkOverlayOrigin],
  host: {
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
    '(focus)': 'onFocus()',
    '(blur)': 'onBlur()',
    '(click)': 'onClick()',
  },
})
export class SmTooltipDirective implements OnDestroy {
  private readonly overlay = inject(Overlay);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  public overlayRef: OverlayRef | null = null;
  public componentRef: ComponentRef<TooltipContentComponent> | null = null;
  private showTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private hideTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private isHovered = signal(false);
  private isFocused = signal(false);
  private isSelected = signal(false);
  private isTooltipHovered = signal(false);
  private isControlled = signal(false);
  private animationCompleteSubscription: { unsubscribe: () => void } | null = null;
  private tooltipMouseEnterHandler: ((event: MouseEvent) => void) | null = null;
  private tooltipMouseLeaveHandler: ((event: MouseEvent) => void) | null = null;

  /**
   * Required tooltip content (string for plain tooltip, RichTooltipConfig for rich tooltip)
   */
  public tooltip = input.required<string | RichTooltipConfig>();

  /**
   * Optional configuration object for tooltip behavior. Contains position, delays, persistence strategy, trigger mode, overlay config, and position offset.
   * Defaults: showDelay=0, hideDelay=1500, trigger='default', others null.
   * Note: `position` and `positionOffset` are ignored if `overlayConfig.positionStrategy` is provided.
   */
  public config = input<TooltipConfig>({
    position: null,
    showDelay: 0,
    hideDelay: 1500,
    persistStrategy: null,
    trigger: 'default',
    overlayConfig: null,
    positionOffset: null,
  });

  /**
   * Computed tooltip type based on tooltip content (string = plain, object = rich)
   */
  public type = computed<'plain' | 'rich'>(() => {
    return typeof this.tooltip() === 'string' ? 'plain' : 'rich';
  });

  private effectivePosition = computed<TooltipPosition>(() => {
    const explicitPosition = this.config().position;
    if (explicitPosition !== null && explicitPosition !== undefined) {
      return explicitPosition;
    }

    return this.type() === 'rich' ? 'below' : 'above';
  });

  public ngOnDestroy(): void {
    this.clearTimeouts();
    this.hideTooltip();
  }

  public open(): void {
    if (!this.tooltip()) {
      return;
    }

    this.isControlled.set(true);
    this.clearTimeouts();

    // If tooltip is animating out, clean it up first
    if (this.isTooltipAnimatingOut()) {
      this.hideTooltip();
    }

    // Show tooltip immediately (no delay)
    this.toggleShowTooltip();
  }

  public close(): void {
    this.isControlled.set(false);
    this.clearTimeouts();

    if (this.componentRef && this.overlayRef?.hasAttached()) {
      // Trigger leave animation
      this.componentRef.instance.open.set(false);
    }
  }

  public onMouseEnter(): void {
    if (this.isHostDisabled()) {
      return; // Don't show tooltip on hover when disabled
    }
    if (this.config().trigger === 'manual') {
      return; // Manual mode: ignore hover events
    }
    if (this.isControlled()) {
      return; // Ignore hover events when controlled
    }
    this.isHovered.set(true);
    this.scheduleShow();
  }

  public onMouseLeave(): void {
    if (this.isHostDisabled()) {
      return; // Don't handle mouseleave when disabled
    }
    if (this.config().trigger === 'manual') {
      return; // Manual mode: ignore hover events
    }
    if (this.isControlled()) {
      return; // Ignore hover events when controlled
    }
    this.isHovered.set(false);
    this.scheduleHide();
  }

  public onFocus(): void {
    if (this.isHostDisabled()) {
      return; // Don't show tooltip on focus when disabled
    }
    if (this.config().trigger === 'manual') {
      return; // Manual mode: ignore focus events
    }
    if (this.isControlled()) {
      return; // Ignore focus events when controlled
    }
    this.isFocused.set(true);
    this.scheduleShow();
  }

  public onBlur(): void {
    if (this.isHostDisabled()) {
      return; // Don't handle blur when disabled
    }
    if (this.config().trigger === 'manual') {
      return; // Manual mode: ignore blur events
    }
    if (this.isControlled()) {
      return; // Ignore blur events when controlled
    }
    this.isFocused.set(false);
    this.scheduleHide();
  }

  public onClick(): void {
    if (this.isHostDisabled()) {
      return; // Don't show tooltip on click when disabled
    }
    if (this.config().trigger === 'manual') {
      return; // Manual mode: ignore click events
    }
    if (this.isControlled()) {
      return; // Ignore click events when controlled
    }
    const tooltipValue = this.tooltip();
    if (typeof tooltipValue === 'object' && tooltipValue !== null) {
      // Rich tooltip can appear on select - toggle selection
      this.isSelected.set(!this.isSelected());
      if (this.isSelected()) {
        this.scheduleShow();
      } else {
        this.scheduleHide();
      }
    }
  }

  private isHostDisabled(): boolean {
    const element = this.elementRef.nativeElement;
    return element.hasAttribute('disabled');
  }

  private scheduleShow(): void {
    this.clearTimeouts();

    // If tooltip is animating out, immediately clean it up
    if (this.isTooltipAnimatingOut()) {
      this.hideTooltip();
    }

    if (!this.tooltip() || (this.overlayRef?.hasAttached() && !this.isTooltipAnimatingOut())) {
      return;
    }

    this.showTimeoutId = setTimeout(() => {
      this.toggleShowTooltip();
    }, this.config().showDelay ?? 0);
  }

  private scheduleHide(): void {
    this.clearTimeouts();
    if (!this.overlayRef?.hasAttached() || !this.componentRef) {
      return;
    }

    // Only schedule hide if tooltip is still open (not already animating out)
    if (!this.componentRef.instance.open()) {
      return;
    }

    this.hideTimeoutId = setTimeout(() => {
      if (!this.isHovered() && !this.isFocused() && !this.isSelected() && !this.shouldKeepTooltipVisible() && this.componentRef) {
        // Only set open to false if tooltip is still attached and open
        if (this.overlayRef?.hasAttached() && this.componentRef.instance.open()) {
          this.componentRef.instance.open.set(false);
        }
      }
    }, this.config().hideDelay ?? 1500);
  }

  private clearTimeouts(): void {
    if (this.showTimeoutId !== null) {
      clearTimeout(this.showTimeoutId);
      this.showTimeoutId = null;
    }
    if (this.hideTimeoutId !== null) {
      clearTimeout(this.hideTimeoutId);
      this.hideTimeoutId = null;
    }
  }

  private toggleShowTooltip(): void {
    // If tooltip is already attached and not animating out, don't create a new one
    if (this.overlayRef?.hasAttached() && !this.isTooltipAnimatingOut()) {
      return;
    }

    if (!this.tooltip()) {
      return;
    }

    const isRich = this.type() === 'rich';
    const maxWidth = isRich ? '22.8571rem' : '14.2857rem';

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.elementRef)
      .withFlexibleDimensions(false) // if not set to false, bounding box becomes too big and goes off center
      .withPositions(this.getPositions())
      .withViewportMargin(8)
      .withTransformOriginOn('[role="tooltip"]')

    const defaultConfig = new OverlayConfig({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.close(),
      maxWidth,
      hasBackdrop: false,
      disposeOnNavigation: true,
    });

    // Merge with user config if provided
    const userConfig = this.config().overlayConfig;

    let finalConfig: OverlayConfig;

    if (userConfig) {
      // Merge user config with defaults
      // Properties that are undefined in user config will use defaults
      // Properties that are explicitly set (even null/empty) will use user's value
      // Create a new config starting with defaults, then apply user config
      // OverlayConfig constructor merges properties, with later properties taking precedence
      const mergedConfigData: any = {};

      // Copy all properties from default config
      const defaultConfigObj = defaultConfig as any;
      for (const key in defaultConfigObj) {
        if (defaultConfigObj.hasOwnProperty(key)) {
          mergedConfigData[key] = defaultConfigObj[key];
        }
      }

      // Override with user config properties that are not undefined
      const userConfigObj = userConfig as any;
      for (const key in userConfigObj) {
        if (userConfigObj.hasOwnProperty(key) && userConfigObj[key] !== undefined) {
          mergedConfigData[key] = userConfigObj[key];
        }
      }

      finalConfig = new OverlayConfig(mergedConfigData);
    } else {
      finalConfig = defaultConfig;
    }

    this.overlayRef = this.overlay.create(finalConfig);

    const tooltipValue = this.tooltip();
    const tooltipType = this.type();
    const text = typeof tooltipValue === 'string' ? tooltipValue : '';
    const configValue = typeof tooltipValue === 'object' ? tooltipValue : null;

    const portal = new ComponentPortal(TooltipContentComponent);
    this.componentRef = this.overlayRef.attach(portal);
    this.componentRef.setInput('type', tooltipType);
    this.componentRef.setInput('text', text);
    this.componentRef.setInput('open', true);

    // Clean up any existing subscription before creating a new one
    if (this.animationCompleteSubscription) {
      this.animationCompleteSubscription.unsubscribe();
      this.animationCompleteSubscription = null;
    }

    // Subscribe to animation complete event
    this.animationCompleteSubscription = this.componentRef.instance.closingAnimationComplete.subscribe(() => {
      this.hideTooltip();
    });

    if (configValue) {
      this.componentRef.setInput('config', configValue);
    }

    // Attach mouse event listeners for 'on-hover-with-tooltip' strategy
    if (this.getEffectivePersistStrategy() === 'on-hover-with-tooltip') {
      this.attachTooltipHoverListeners();
    }
  }
  private isTooltipAnimatingOut(): boolean {
    return this.componentRef?.instance.open() === false &&
           this.overlayRef?.hasAttached() === true;
  }

  private hasTooltipButtons(): boolean {
    const tooltipValue = this.tooltip();
    if (typeof tooltipValue === 'object' && tooltipValue !== null) {
      return !!(tooltipValue.buttons && tooltipValue.buttons.length > 0);
    }
    return false;
  }

  private getEffectivePersistStrategy(): 'on-hover' | 'on-hover-with-tooltip' {
    const explicit = this.config().persistStrategy;
    if (explicit !== null && explicit !== undefined) {
      return explicit;
    }

    // Default: check if tooltip has buttons
    if (this.hasTooltipButtons()) {
      return 'on-hover-with-tooltip';
    }

    return 'on-hover'; // Plain tooltip or rich tooltip without buttons
  }

  private shouldKeepTooltipVisible(): boolean {
    const strategy = this.getEffectivePersistStrategy();
    if (strategy === 'on-hover') {
      return false;
    }
    return this.isTooltipHovered();
  }

  private attachTooltipHoverListeners(): void {
    if (!this.overlayRef) {
      return;
    }

    const overlayElement = this.overlayRef.overlayElement;

    // Create bound handler functions
    this.tooltipMouseEnterHandler = () => {
      if (this.isControlled()) {
        return; // Ignore tooltip container hover when controlled
      }
      this.isTooltipHovered.set(true);
      this.clearTimeouts();
    };

    this.tooltipMouseLeaveHandler = () => {
      if (this.isControlled()) {
        return; // Ignore tooltip container hover when controlled
      }
      this.isTooltipHovered.set(false);
      this.scheduleHide();
    };

    overlayElement.addEventListener('mouseenter', this.tooltipMouseEnterHandler);
    overlayElement.addEventListener('mouseleave', this.tooltipMouseLeaveHandler);
  }

  private detachTooltipHoverListeners(): void {
    // Store overlay element before overlayRef might be disposed
    const overlayElement = this.overlayRef?.overlayElement;

    if (overlayElement && this.tooltipMouseEnterHandler) {
      overlayElement.removeEventListener('mouseenter', this.tooltipMouseEnterHandler);
    }

    if (overlayElement && this.tooltipMouseLeaveHandler) {
      overlayElement.removeEventListener('mouseleave', this.tooltipMouseLeaveHandler);
    }

    // Clear handler references
    this.tooltipMouseEnterHandler = null;
    this.tooltipMouseLeaveHandler = null;
    this.isTooltipHovered.set(false);
  }

  private hideTooltip(): void {
    // Detach tooltip hover listeners
    this.detachTooltipHoverListeners();

    // Unsubscribe from animation complete event
    if (this.animationCompleteSubscription) {
      this.animationCompleteSubscription.unsubscribe();
      this.animationCompleteSubscription = null;
    }

    if (this.overlayRef?.hasAttached()) {
      this.overlayRef.detach();
    }
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }

    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }

    this.isSelected.set(false);
  }

  private getPositions(): ConnectionPositionPair[] {
    const position = this.effectivePosition();

    // Calculate offset: use provided value, or default based on tooltip type
    let offset: number;
    const providedOffset = this.config().positionOffset;
    if (providedOffset !== null && providedOffset !== undefined) {
      offset = providedOffset;
    } else {
      // Determine if tooltip is rich for default offset
      offset = this.type() === 'rich' ? 8 : 4;
    }

    switch (position) {
      case 'above':
        return [
          new ConnectionPositionPair(
            {originX: 'center', originY: 'top'},
            {overlayX: 'center', overlayY: 'bottom'},
            0,
            -offset,
          ),
          new ConnectionPositionPair(
            {originX: 'center', originY: 'bottom'},
            {overlayX: 'center', overlayY: 'top'},
            0,
            offset,
          ),
        ];
      case 'below':
        return [
          new ConnectionPositionPair(
            {originX: 'center', originY: 'bottom'},
            {overlayX: 'start', overlayY: 'top'},
            0,
            offset,
          ),
          new ConnectionPositionPair(
            {originX: 'center', originY: 'top'},
            {overlayX: 'start', overlayY: 'bottom'},
            0,
            -offset,
          ),
        ];
      case 'left':
        return [
          new ConnectionPositionPair(
            {originX: 'start', originY: 'center'},
            {overlayX: 'end', overlayY: 'center'},
            -offset,
            0,
          ),
          new ConnectionPositionPair(
            {originX: 'end', originY: 'center'},
            {overlayX: 'start', overlayY: 'center'},
            offset,
            0,
          ),
        ];
      case 'right':
        return [
          new ConnectionPositionPair(
            {originX: 'end', originY: 'center'},
            {overlayX: 'start', overlayY: 'center'},
            offset,
            0,
          ),
          new ConnectionPositionPair(
            {originX: 'start', originY: 'center'},
            {overlayX: 'end', overlayY: 'center'},
            -offset,
            0,
          ),
        ];
    }
  }
}
