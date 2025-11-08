import {booleanAttribute} from '@angular/core';
import {
  ComponentHarnessConstructor,
  ContentContainerComponentHarness,
  HarnessPredicate,
} from '@angular/cdk/testing';
import {
  ButtonHarnessFilters,
  ButtonVariant,
  ButtonSize,
  ButtonShape,
} from './button-harness-filters';

/** Harness for interacting with a sm-button in tests. */
export class SmButtonHarness extends ContentContainerComponentHarness {
  static hostSelector = 'button[sm-button], a[sm-button]';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a button with specific attributes.
   * @param options Options for narrowing the search:
   *   - `selector` finds a button whose host element matches the given selector.
   *   - `text` finds a button with specific text content.
   *   - `variant` finds buttons matching a specific variant.
   *   - `size` finds buttons matching a specific size.
   *   - `shape` finds buttons matching a specific shape.
   *   - `toggle` finds buttons matching a specific toggle state.
   *   - `disabled` finds buttons matching a specific disabled state.
   *   - `selected` finds buttons matching a specific selected state.
   * @return a `HarnessPredicate` configured with the given options.
   */
  static with<T extends SmButtonHarness>(
    this: ComponentHarnessConstructor<T>,
    options: ButtonHarnessFilters = {},
  ): HarnessPredicate<T> {
    return new HarnessPredicate(this, options)
      .addOption('text', options.text, (harness, text) =>
        HarnessPredicate.stringMatches(harness.getText(), text),
      )
      .addOption('variant', options.variant, (harness, variant) =>
        HarnessPredicate.stringMatches(harness.getVariant(), variant),
      )
      .addOption('size', options.size, (harness, size) =>
        HarnessPredicate.stringMatches(harness.getSize(), size),
      )
      .addOption('shape', options.shape, (harness, shape) =>
        HarnessPredicate.stringMatches(harness.getShape(), shape),
      )
      .addOption('toggle', options.toggle, async (harness, toggle) => {
        return (await harness.isToggle()) === toggle;
      })
      .addOption('disabled', options.disabled, async (harness, disabled) => {
        return (await harness.isDisabled()) === disabled;
      })
      .addOption('selected', options.selected, async (harness, selected) => {
        return (await harness.isSelected()) === selected;
      });
  }

  /**
   * Clicks the button at the given position relative to its top-left.
   * @param relativeX The relative x position of the click.
   * @param relativeY The relative y position of the click.
   */
  click(relativeX: number, relativeY: number): Promise<void>;
  /** Clicks the button at its center. */
  click(location: 'center'): Promise<void>;
  /** Clicks the button. */
  click(): Promise<void>;
  async click(...args: [] | ['center'] | [number, number]): Promise<void> {
    return (await this.host()).click(...(args as []));
  }

  async isDisabled(): Promise<boolean> {
    const host = await this.host();
    // Check disabled attribute for native buttons
    const disabledAttr = await host.getAttribute('disabled');
    if (disabledAttr !== null) {
      return booleanAttribute(disabledAttr);
    }
    // Check aria-disabled for anchor elements
    const ariaDisabled = await host.getAttribute('aria-disabled');
    if (ariaDisabled !== null) {
      return ariaDisabled === 'true';
    }
    return false;
  }

  async getText(): Promise<string> {
    return (await this.host()).text();
  }

  async focus(): Promise<void> {
    return (await this.host()).focus();
  }

  async blur(): Promise<void> {
    return (await this.host()).blur();
  }

  async isFocused(): Promise<boolean> {
    return (await this.host()).isFocused();
  }

  async getVariant(): Promise<ButtonVariant | null> {
    const host = await this.host();
    const variant = await host.getAttribute('data-variant');
    if (
      variant === 'filled' ||
      variant === 'elevated' ||
      variant === 'tonal' ||
      variant === 'outlined' ||
      variant === 'text'
    ) {
      return variant;
    }
    return null;
  }

  async getSize(): Promise<ButtonSize | null> {
    const host = await this.host();
    const size = await host.getAttribute('data-size');
    if (
      size === 'xsmall' ||
      size === 'small' ||
      size === 'medium' ||
      size === 'large' ||
      size === 'xlarge'
    ) {
      return size;
    }
    return null;
  }

  async getShape(): Promise<ButtonShape | null> {
    const host = await this.host();
    const shape = await host.getAttribute('data-shape');
    if (shape === 'round' || shape === 'square') {
      return shape;
    }
    return null;
  }

  async isToggle(): Promise<boolean> {
    const host = await this.host();
    const toggle = await host.getAttribute('data-toggle');
    return toggle === 'true';
  }

  /** Gets whether the button is selected. Only applicable for toggle buttons. */
  async isSelected(): Promise<boolean> {
    const host = await this.host();
    const selected = await host.getAttribute('data-selected');
    return selected === 'true';
  }

  /**
   * Gets the type of the button. Supported values are 'button', 'submit', and 'reset'.
   * Returns null for anchor elements.
   */
  async getType(): Promise<'button' | 'submit' | 'reset' | null> {
    const host = await this.host();
    const buttonType = await host.getAttribute('type');
    if (buttonType === 'button' || buttonType === 'submit' || buttonType === 'reset') {
      return buttonType;
    }
    return null;
  }
}

