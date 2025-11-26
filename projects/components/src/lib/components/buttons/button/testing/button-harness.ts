import {
  ComponentHarnessConstructor,
  ContentContainerComponentHarness,
  HarnessPredicate,
} from '@angular/cdk/testing';
import {
  ButtonHarnessFilters,
  ButtonShape,
  ButtonSize,
  ButtonVariant,
} from './button-harness-filters';

/** Harness for interacting with a SimplyMatButton in tests. */
export class SimplyMatButtonHarness extends ContentContainerComponentHarness {
  /** Selector for the harness. */
  static hostSelector = 'button[simplyMatButton], a[simplyMatButton]';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a button with specific attributes.
   * @param options Options for narrowing the search:
   *   - `selector` finds a button whose host element matches the given selector.
   *   - `text` finds a button with specific text content.
   *   - `variant` finds buttons matching a specific variant.
   *   - `size` finds buttons matching a specific size.
   *   - `shape` finds buttons matching a specific shape.
   *   - `disabled` finds buttons matching a specific disabled state.
   *   - `togglable` finds buttons matching a specific togglable state.
   *   - `selected` finds buttons matching a specific selected state.
   * @return a `HarnessPredicate` configured with the given options.
   */
  static with<T extends SimplyMatButtonHarness>(
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
      .addOption('disabled', options.disabled, async (harness, disabled) => {
        return (await harness.isDisabled()) === disabled;
      })
      .addOption('togglable', options.togglable, async (harness, togglable) => {
        return (await harness.isTogglable()) === togglable;
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

  /** Gets a boolean promise indicating if the button is disabled. */
  async isDisabled(): Promise<boolean> {
    const host = await this.host();
    const disabled = await host.getAttribute('disabled');
    const ariaDisabled = await host.getAttribute('aria-disabled');
    return disabled !== null || ariaDisabled === 'true';
  }

  /** Gets a promise for the button's label text. */
  async getText(): Promise<string> {
    return (await this.host()).text();
  }

  /** Focuses the button and returns a void promise that indicates when the action is complete. */
  async focus(): Promise<void> {
    return (await this.host()).focus();
  }

  /** Blurs the button and returns a void promise that indicates when the action is complete. */
  async blur(): Promise<void> {
    return (await this.host()).blur();
  }

  /** Whether the button is focused. */
  async isFocused(): Promise<boolean> {
    return (await this.host()).isFocused();
  }

  /** Gets the variant of the button. */
  async getVariant(): Promise<ButtonVariant | null> {
    const host = await this.host();
    const variant = await host.getAttribute('data-sm-variant');
    
    if (variant === 'filled' || variant === 'elevated' || variant === 'tonal' || 
        variant === 'outlined' || variant === 'text') {
      return variant;
    }
    
    return null;
  }

  /** Gets the size of the button. */
  async getSize(): Promise<ButtonSize | null> {
    const host = await this.host();
    const size = await host.getAttribute('data-sm-size');
    
    if (size === 'xsmall' || size === 'small' || size === 'medium' || 
        size === 'large' || size === 'xlarge') {
      return size;
    }
    
    return null;
  }

  /** Gets the shape of the button. */
  async getShape(): Promise<ButtonShape | null> {
    const host = await this.host();
    const shape = await host.getAttribute('data-sm-shape');
    
    if (shape === 'round' || shape === 'square') {
      return shape;
    }
    
    return null;
  }

  /** Gets whether the button is togglable. */
  async isTogglable(): Promise<boolean> {
    const host = await this.host();
    const togglable = await host.getAttribute('data-sm-toggle');
    return togglable === 'true';
  }

  /** Gets whether the button is selected (only applicable if togglable). */
  async isSelected(): Promise<boolean> {
    const host = await this.host();
    const selected = await host.getAttribute('data-sm-selected');
    return selected === 'true';
  }

  /**
   * Toggles the button's selected state by clicking it.
   * Only works if the button is togglable.
   */
  async toggle(): Promise<void> {
    if (!(await this.isTogglable())) {
      throw new Error('Cannot toggle a non-togglable button');
    }
    await this.click();
  }
}

