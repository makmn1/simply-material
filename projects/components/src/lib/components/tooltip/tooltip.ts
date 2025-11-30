import {
  ComponentRef,
  TemplateRef,
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
  CdkOverlayOrigin,
} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import {TooltipContainerComponent} from './tooltip-container';

export type TooltipPosition = 'above' | 'below' | 'start' | 'end';

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
    '(mousedown)': 'onPointerInput()',
    '(pointerdown)': 'onPointerInput()',
    '(keydown)': 'onKeydown($event)',
  },
})
export class SimplyMatTooltip implements OnDestroy {
  private readonly overlay = inject(Overlay);
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  public overlayRef: OverlayRef | null = null;
  public componentRef: ComponentRef<TooltipContainerComponent> | null = null;

  private showTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private hideTimeoutId: ReturnType<typeof setTimeout> | null = null;

  private isHovered = signal(false);
  private isFocused = signal(false);
  private isTooltipHovered = signal(false);
  private isControlled = signal(false);
  private lastInteractionWasKeyboard = true;

  private animationCompleteSubscription: {unsubscribe: () => void} | null = null;
  private tooltipMouseEnterHandler: ((event: MouseEvent) => void) | null = null;
  private tooltipMouseLeaveHandler: ((event: MouseEvent) => void) | null = null;

  /**
   * Tooltip content provided by the consumer as a ng-template.
   *
   * Example:
   *   <ng-template #tooltipTpl> ... </ng-template>
   *   <button sm-tooltip [tooltip]="tooltipTpl" [tooltipType]="'rich'">...</button>
   */
  public tooltip = input.required<TemplateRef<unknown>>();

  /**
   * Tooltip type: 'plain' or 'rich'.
   *
   * The type of tooltip changes the styles applied and the default interaction behavior.
   *
   * For example, rich tooltips will remain on-screen if the user hovers on the tooltip, allowing
   * users to interact with any action in the tooltip (e.g., a button).
   */
  public tooltipType = input<'plain' | 'rich'>('plain');

  /**
   * Optional configuration object for tooltip behavior. Contains position, delays, persistence strategy, trigger mode, overlay config, and position offset.
   *
   * Defaults follow Material Design guidelines.
   *
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
   * Effective position:
   * - Use `config.position` when provided
   * - Otherwise default based on tooltipType: rich → below, plain → above
   */
  private effectivePosition = computed<TooltipPosition>(() => {
    const explicitPosition = this.config().position;
    if (explicitPosition !== null && explicitPosition !== undefined) {
      return explicitPosition;
    }

    return this.tooltipType() === 'rich' ? 'below' : 'above';
  });

  public ngOnDestroy(): void {
    this.clearTimeouts();
    this.hideTooltip();
  }

  /** Imperative open (manual trigger). */
  public open(): void {
    if (!this.tooltip()) {
      return;
    }

    this.isControlled.set(true);
    this.clearTimeouts();

    if (this.isTooltipAnimatingOut()) {
      this.hideTooltip();
    }

    this.toggleShowTooltip();
  }

  /** Imperative close (manual trigger). */
  public close(): void {
    this.isControlled.set(false);
    this.clearTimeouts();

    if (this.componentRef && this.overlayRef?.hasAttached()) {
      // Trigger leave animation
      this.componentRef.instance.open.set(false);
    }
  }

  public onMouseEnter(): void {
    if (this.isHostDisabled()) return;
    if (this.config().trigger === 'manual') return;
    if (this.isControlled()) return;

    this.isHovered.set(true);
    this.scheduleShow();
  }

  public onMouseLeave(): void {
    if (this.isHostDisabled()) return;
    if (this.config().trigger === 'manual') return;
    if (this.isControlled()) return;

    this.isHovered.set(false);
    this.scheduleHide();
  }

  public onFocus(): void {
    if (this.isHostDisabled()) return;
    if (this.config().trigger === 'manual') return;
    if (this.isControlled()) return;

    if (!this.lastInteractionWasKeyboard) {
      return;
    }

    this.isFocused.set(true);
    this.scheduleShow();
  }

  public onBlur(): void {
    if (this.isHostDisabled()) return;
    if (this.config().trigger === 'manual') return;
    if (this.isControlled()) return;

    this.isFocused.set(false);
    this.scheduleHide();
  }

  private isHostDisabled(): boolean {
    const element = this.elementRef.nativeElement;
    return element.hasAttribute('disabled');
  }

  private scheduleShow(): void {
    this.clearTimeouts();

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

    // Only schedule hide if the tooltip is still open (not already animating out)
    if (!this.componentRef.instance.open()) {
      return;
    }

    this.hideTimeoutId = setTimeout(() => {
      if (
        !this.isHovered() &&
        !this.isFocused() &&
        !this.shouldKeepTooltipVisible() &&
        this.componentRef
      ) {
        // Only set open to false if the tooltip is still attached and open
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
    // If a tooltip is already attached and not animating out, don't create a new one
    if (this.overlayRef?.hasAttached() && !this.isTooltipAnimatingOut()) {
      return;
    }

    if (!this.tooltip()) {
      return;
    }

    const isRich = this.tooltipType() === 'rich';
    const maxWidth = isRich ? '22.8571rem' : '14.2857rem';

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.elementRef)
      .withFlexibleDimensions(false) // if not set to false, the bounding box becomes too big and goes off-center
      .withPositions(this.getPositions())
      .withViewportMargin(8)
      .withTransformOriginOn('[role="tooltip"]');

    const defaultConfig = new OverlayConfig({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      minHeight: this.tooltipType() === 'plain' ? "1.5rem" : undefined, // Source: https://m3.material.io/components/tooltips/specs#b09b973b-4f0e-4f07-800a-1fa114dcb322
      maxWidth,
      hasBackdrop: false,
      disposeOnNavigation: true,
    });

    // Merge with user config if provided
    const userConfig = this.config().overlayConfig;
    let finalConfig: OverlayConfig;

    if (userConfig) {
      const mergedConfigData: any = {};

      const defaultConfigObj = defaultConfig as any;
      for (const key in defaultConfigObj) {
        if (defaultConfigObj.hasOwnProperty(key)) {
          mergedConfigData[key] = defaultConfigObj[key];
        }
      }

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

    const portal = new ComponentPortal(TooltipContainerComponent);
    this.componentRef = this.overlayRef.attach(portal);

    this.componentRef.setInput('type', this.tooltipType());
    this.componentRef.setInput('open', true);
    this.componentRef.setInput('contentTemplate', this.tooltip());

    if (this.animationCompleteSubscription) {
      this.animationCompleteSubscription.unsubscribe();
      this.animationCompleteSubscription = null;
    }

    this.animationCompleteSubscription =
      this.componentRef.instance.closingAnimationComplete.subscribe(() => {
        this.hideTooltip();
      });

    if (this.getEffectivePersistStrategy() === 'on-hover-with-tooltip') {
      this.attachTooltipHoverListeners();
    }
  }

  private isTooltipAnimatingOut(): boolean {
    return this.componentRef?.instance.open() === false &&
      this.overlayRef?.hasAttached() === true;
  }

  private getEffectivePersistStrategy(): 'on-hover' | 'on-hover-with-tooltip' {
    return this.config().persistStrategy ?? 'on-hover';
  }

  private shouldKeepTooltipVisible(): boolean {
    return this.getEffectivePersistStrategy() === 'on-hover' ? false : this.isTooltipHovered();
  }

  private attachTooltipHoverListeners(): void {
    if (!this.overlayRef) {
      return;
    }

    const overlayElement = this.overlayRef.overlayElement;

    this.tooltipMouseEnterHandler = () => {
      if (this.isControlled()) {
        return;
      }
      this.isTooltipHovered.set(true);
      this.clearTimeouts();
    };

    this.tooltipMouseLeaveHandler = () => {
      if (this.isControlled()) {
        return;
      }
      this.isTooltipHovered.set(false);
      this.scheduleHide();
    };

    overlayElement.addEventListener('mouseenter', this.tooltipMouseEnterHandler);
    overlayElement.addEventListener('mouseleave', this.tooltipMouseLeaveHandler);
  }

  private detachTooltipHoverListeners(): void {
    const overlayElement = this.overlayRef?.overlayElement;

    if (overlayElement && this.tooltipMouseEnterHandler) {
      overlayElement.removeEventListener('mouseenter', this.tooltipMouseEnterHandler);
    }

    if (overlayElement && this.tooltipMouseLeaveHandler) {
      overlayElement.removeEventListener('mouseleave', this.tooltipMouseLeaveHandler);
    }

    this.tooltipMouseEnterHandler = null;
    this.tooltipMouseLeaveHandler = null;
    this.isTooltipHovered.set(false);
  }

  private hideTooltip(): void {
    this.detachTooltipHoverListeners();

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
  }

  private getPositions(): ConnectionPositionPair[] {
    const position = this.effectivePosition();

    // Calculate offset: use provided value, or default based on the tooltip type
    let offset: number;
    const providedOffset = this.config().positionOffset;
    if (providedOffset !== null && providedOffset !== undefined) {
      offset = providedOffset;
    } else {
      offset = this.tooltipType() === 'rich' ? 8 : 4;
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
      case 'start':
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
      case 'end':
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

  public onPointerInput(): void {
    this.lastInteractionWasKeyboard = false;
  }

  public onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Tab' || event.key === 'Shift') {
      this.lastInteractionWasKeyboard = true;
    }
  }
}
