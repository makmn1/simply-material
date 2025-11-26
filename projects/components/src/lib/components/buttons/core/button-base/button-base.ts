import {
  computed, Directive, ElementRef, forwardRef,
  inject, output
} from '@angular/core';
import {
  BUTTON_SHAPE_MORPH_ROLE,
  ButtonShapeMorphConfig,
  MorphConfig
} from '../button-shape-morph/button-shape-morph-type.token';
import {ButtonShapeMorph} from '../button-shape-morph/button-shape-morph';
import {BaseConfig, BUTTON_BASE_CONFIG, ButtonBaseConfig} from './button-base.token';
import {Option} from '@angular/aria/listbox';
import {SimplyMatButtonGroupBase} from '../../button-group/button-group-base';
import {SimplyMatButtonGroupSelection} from '../../button-group/button-group-selection';
import {BUTTON_GROUP_BASE_CONFIG, ButtonGroupBaseConfig, BaseConfig as GroupBaseConfig} from '../../button-group/button-group-base.token';

@Directive({
  selector: 'button[simplyMatButtonBase]:not([ngOption]), a[simplyMatButtonBase]',
  providers: [
    {provide: BUTTON_SHAPE_MORPH_ROLE, useExisting: forwardRef(() => ButtonBase)},
  ],
  hostDirectives: [
    {
      directive: ButtonShapeMorph
    }
  ],
  host: {
    '[attr.data-sm-variant]': 'baseConfig.buttonVariant()',
    '[attr.data-sm-size]': 'effectiveButtonSize()',
    '[attr.data-sm-toggle]': 'baseConfig.togglable()',
    '[attr.data-sm-selected]': 'baseConfig.isSelected()',
    '[attr.data-sm-shape]': 'baseConfig.buttonShape() ? baseConfig.buttonShape() : effectiveButtonShape()',

    '[attr.aria-pressed]': 'baseConfig.togglable() ? baseConfig.isSelected() : null',

    '[attr.disabled]': 'isNativeButton() && isHardDisabled ? "" : null',
    '[attr.aria-disabled]': 'isDisabledLike ? "true" : null',
    '[attr.aria-readonly]': 'effectiveButtonReadonly() ? "true" : null',
    '[attr.tabindex]': 'isAnchor() ? (isHardDisabled ? -1 : 0) : null',

    // For optional styling
    '[attr.data-sm-disabled-hard]': 'isHardDisabled ? "" : null',
    '[attr.data-sm-disabled-soft]': 'isSoftDisabled ? "" : null',
    '[attr.data-sm-readonly]': 'effectiveButtonReadonly() ? "" : null',

    // activation
    '(click)': 'void onClick($event)',

    // pointer press
    '(pointerdown)': 'void onPointerDown($event)',

    '(window:pointerup)': 'void onWindowPointerUp($event)',
    '(window:pointercancel)': 'void onWindowPointerCancel($event)',

    // keyboard press
    '(keydown.enter)': 'void onKeyDownEnter($event)',
    '(keydown.space)': 'void onKeyDownSpace($event)',
    '(keyup.enter)': 'void onKeyUpEnter($event)',

    // Space release
    '(keyup.space)': 'void onKeyUpSpace($event)',
  },
})
export class ButtonBase implements ButtonShapeMorphConfig {
  public readonly baseConfig: BaseConfig<string> =
    inject<ButtonBaseConfig>(BUTTON_BASE_CONFIG, { host: true, optional: false }).baseConfig

  public readonly ngOption: Option<any> | null = inject(Option, { optional: true })

  private readonly el: ElementRef<HTMLElement> = inject(ElementRef<HTMLElement>);

  public readonly selectedChange = output<boolean>();

  private shapeMorphDirective: ButtonShapeMorph | undefined;

  private readonly buttonGroup = inject(SimplyMatButtonGroupBase, { optional: true });

  // Extra config for the button group that can't be well represented through inheritance
  public readonly buttonGroupConfig: GroupBaseConfig | undefined =
    inject<ButtonGroupBaseConfig>(BUTTON_GROUP_BASE_CONFIG, { optional: true })?.baseConfig

  // Return the user-supplied size if present, otherwise fallback to button group size if present, otherwise default to small.
  public readonly effectiveButtonSize = computed<string>(() => {
    if (this.baseConfig.buttonSize()) return this.baseConfig.buttonSize()!;
    else if (this.buttonGroup?.size()) return this.buttonGroup.size()!;
    else return "small";
  });

  // Return the user-supplied shape if present, otherwise fallback to button group default shape if present, otherwise default to round.
  public readonly effectiveButtonShape = computed<string>(() => {
    if (this.baseConfig.buttonShape()) return this.baseConfig.buttonShape()!;
    else if (this.buttonGroup?.defaultButtonShape()) return this.buttonGroup.defaultButtonShape()!;
    else return "round";
  });

  public readonly effectiveButtonDisabled = computed<boolean>(() => {
    if (this.baseConfig.buttonDisabled() !== undefined) return this.baseConfig.buttonDisabled()!;
    else if (this.buttonGroupConfig?.groupDisabled() !== undefined) return this.buttonGroupConfig.groupDisabled()!;
    else return false;
  });

  public readonly effectiveButtonSoftDisabled = computed<boolean>(() => {
    if (this.baseConfig.buttonSoftDisabled() !== undefined) return this.baseConfig.buttonSoftDisabled()!;
    else if (this.buttonGroupConfig?.groupSoftDisabled() !== undefined) return this.buttonGroupConfig.groupSoftDisabled()!;
    else return false;
  });

  public readonly effectiveButtonReadonly = computed<boolean>(() => {
    if (this.baseConfig.buttonReadonly() !== undefined) return this.baseConfig.buttonReadonly()!;
    else if (this.buttonGroupConfig?.groupReadonly() !== undefined) return this.buttonGroupConfig.groupReadonly()!;
    else return false;
  });

  private _pendingUserSelectionAnimation = false;

  private markUserSelectionFromUser(): void {
    this._pendingUserSelectionAnimation = true;
  }

  private consumeUserSelectionFromUser(): boolean {
    const was = this._pendingUserSelectionAnimation;
    this._pendingUserSelectionAnimation = false;
    return was;
  }

  public setSelected(selected: boolean): void {
    const prevSelected = this.baseConfig.isSelected();

    // Already at target state: nothing to do.
    if (prevSelected === selected) {
      return;
    }

    // Was this value change triggered by this button's own pointer/keyboard
    // interaction (i.e., user click/press)? If so, the pointer pipeline should
    // already be animating, and we only need to update state.
    const triggeredByUser = this.consumeUserSelectionFromUser();

    // Keep internal state + outputs in sync with the Listbox model.
    this.baseConfig.isSelected.set(selected);
    this.selectedChange.emit(selected);

    if (!this.shapeMorphDirective) {
      return;
    }

    if (triggeredByUser) {
      // User action: pointer/keyboard already started press-in plus rest with width
      // via animatePointerDown/animateClick. Don't double-animate here.
      return;
    }

    // Programmatic change (including auto-deselect from Listbox):
    // do a press-in + rest, but with width animations disabled.
    const press = this.shapeMorphDirective.animatePressIn(prevSelected, {
      skipWidth: true,
    });

    if (press) {
      press.then(() => {
        void this.shapeMorphDirective!.animateToRest({ skipWidth: true });
      });
    } else {
      void this.shapeMorphDirective!.animateToRest({ skipWidth: true });
    }
  }

  private root(): HTMLElement {
    return this.el.nativeElement;
  }

  public isNativeButton(): boolean {
    return this.root().tagName.toLowerCase() === 'button';
  }

  public isAnchor(): boolean {
    return this.root().tagName.toLowerCase() === 'a';
  }

  get morphConfig(): MorphConfig {
    return {
      ...this.baseConfig,
      buttonGroupType: this.buttonGroup?.type,
      buttonShape: this.effectiveButtonShape,
      buttonSize: this.effectiveButtonSize,
      disableWidthAnimations: this.buttonGroup ? this.buttonGroup.disableWidthAnimations : () => false
    }
  }

  registerShapeMorphHost(shapeMorphDirective: ButtonShapeMorph){
    this.shapeMorphDirective = shapeMorphDirective;
  }

  private isSelectionControlled(): boolean {
    return this.buttonGroup instanceof SimplyMatButtonGroupSelection
  }

  // Disabled and NOT focusable
  get isHardDisabled(): boolean {
    return this.effectiveButtonDisabled() && !this.effectiveButtonSoftDisabled();
  }

  // Disabled but focusable
  get isSoftDisabled(): boolean {
    return this.effectiveButtonDisabled() && this.effectiveButtonSoftDisabled();
  }

  // Any disable state where the user can't interact with the button at all
  get isDisabledLike(): boolean {
    return this.isHardDisabled || this.isSoftDisabled;
  }

  get isStateChangeBlocked(): boolean {
    return this.isDisabledLike || this.effectiveButtonReadonly();
  }

  /* EVENT HANDLERS */
  async onClick(event: Event) {
    if (this.isDisabledLike) {
      event.preventDefault();
      return;
    }

    if (this.baseConfig.togglable() && !this.isSelectionControlled() && !this.isStateChangeBlocked) {
      const next = !this.baseConfig.isSelected();
      this.baseConfig.isSelected.set(next);
      this.selectedChange.emit(next);
    }

    await this.shapeMorphDirective?.animateClick();
  }

  async onPointerDown(e: Event) {
    if (this.isDisabledLike) return;
    if (this.isSelectionControlled()) {
      this.markUserSelectionFromUser();
    }

    await this.shapeMorphDirective?.animatePointerDown(e);
  }

  async onWindowPointerUp(e: Event) {
    if (this.isSelectionControlled()) return;
    await this.shapeMorphDirective?.animateWindowPointerUp(e)
  }

  async onWindowPointerCancel(e: Event) {
    if (this.isSelectionControlled()) return;
    await this.shapeMorphDirective?.animateWindowPointerCancel(e)
  }

  async onKeyDownEnter(e: Event) {
    if (this.isDisabledLike) return;

    if (this.isSelectionControlled()) {
      this.markUserSelectionFromUser();
    }

    await this.shapeMorphDirective?.animateKeyDownEnter(e);
  }

  async onKeyDownSpace(e: Event) {
    if (this.isDisabledLike) return;

    if (this.isSelectionControlled()) {
      this.markUserSelectionFromUser();
    }

    await this.shapeMorphDirective?.animateKeyDownSpace(e);
  }

  // TODO: For some reason, when the selection is controlled by Angular's Aria listbox,
  // the on key down enter and on key space up events don't trigger the click event.
  // Below is a workaround where we always trigger the click event when the selection is controlled by Angular's Aria listbox.'
  // At least until we can figure out why this is happening.
  // (Note, the anchor tag check was here originally and is not related to the above issue. It's for convenience)

  async onKeyUpSpace(_e: Event) {
    if (this.isAnchor() || this.isSelectionControlled()) {
      this.root().click();
    }
  }

  async onKeyUpEnter(_e: Event) {
    if (this.isSelectionControlled()) {
      this.root().click();
    }
  }
}
