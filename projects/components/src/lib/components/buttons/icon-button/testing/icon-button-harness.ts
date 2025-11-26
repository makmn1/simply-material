import {
  ComponentHarnessConstructor,
  ContentContainerComponentHarness,
  HarnessPredicate,
} from '@angular/cdk/testing';
import {
  IconButtonHarnessFilters,
  IconButtonShape,
  IconButtonSize,
  IconButtonVariant,
  IconButtonWidth,
} from './icon-button-harness-filters';

/** Harness for interacting with a SimplyMatIconButton in tests. */
export class SimplyMatIconButtonHarness extends ContentContainerComponentHarness {
  /** Selector for the harness. */
  static hostSelector = 'button[simplyMatIconButton], a[simplyMatIconButton]';

  /**
   * Gets a `HarnessPredicate` that can be used to search for an icon button with specific attributes.
   * @param options Options for narrowing the search:
   *   - `selector` finds an icon button whose host element matches the given selector.
   *   - `text` finds an icon button with specific text content.
   *   - `variant` finds icon buttons matching a specific variant.
   *   - `size` finds icon buttons matching a specific size.
   *   - `shape` finds icon buttons matching a specific shape.
   *   - `width` finds icon buttons matching a specific width.
   *   - `disabled` finds icon buttons matching a specific disabled state.
   *   - `togglable` finds icon buttons matching a specific togglable state.
   *   - `selected` finds icon buttons matching a specific selected state.
   * @return a `HarnessPredicate` configured with the given options.
   */
  static with<T extends SimplyMatIconButtonHarness>(
    this: ComponentHarnessConstructor<T>,
    options: IconButtonHarnessFilters = {},
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
      .addOption('width', options.width, (harness, width) =>
        HarnessPredicate.stringMatches(harness.getWidth(), width),
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
   * Clicks the icon button at the given position relative to its top-left.
   * @param relativeX The relative x position of the click.
   * @param relativeY The relative y position of the click.
   */
  click(relativeX: number, relativeY: number): Promise<void>;
  /** Clicks the icon button at its center. */
  click(location: 'center'): Promise<void>;
  /** Clicks the icon button. */
  click(): Promise<void>;
  async click(...args: [] | ['center'] | [number, number]): Promise<void> {
    return (await this.host()).click(...(args as []));
  }

  /** Gets a boolean promise indicating if the icon button is disabled. */
  async isDisabled(): Promise<boolean> {
    const host = await this.host();
    const disabled = await host.getAttribute('disabled');
    const ariaDisabled = await host.getAttribute('aria-disabled');
    return disabled !== null || ariaDisabled === 'true';
  }

  /** Gets a promise for the icon button's label text. */
  async getText(): Promise<string> {
    return (await this.host()).text();
  }

  /** Focuses the icon button and returns a void promise that indicates when the action is complete. */
  async focus(): Promise<void> {
    return (await this.host()).focus();
  }

  /** Blurs the icon button and returns a void promise that indicates when the action is complete. */
  async blur(): Promise<void> {
    return (await this.host()).blur();
  }

  /** Whether the icon button is focused. */
  async isFocused(): Promise<boolean> {
    return (await this.host()).isFocused();
  }

  /** Gets the variant of the icon button. */
  async getVariant(): Promise<IconButtonVariant | null> {
    const host = await this.host();
    const variant = await host.getAttribute('data-sm-variant');
    
    if (variant === 'filled' || variant === 'tonal' || 
        variant === 'outlined' || variant === 'standard') {
      return variant;
    }
    
    return null;
  }

  /** Gets the size of the icon button. */
  async getSize(): Promise<IconButtonSize | null> {
    const host = await this.host();
    const size = await host.getAttribute('data-sm-size');
    
    if (size === 'xsmall' || size === 'small' || size === 'medium' || 
        size === 'large' || size === 'xlarge') {
      return size;
    }
    
    return null;
  }

  /** Gets the shape of the icon button. */
  async getShape(): Promise<IconButtonShape | null> {
    const host = await this.host();
    const shape = await host.getAttribute('data-sm-shape');
    
    if (shape === 'round' || shape === 'square') {
      return shape;
    }
    
    return null;
  }

  /** Gets the width of the icon button. */
  async getWidth(): Promise<IconButtonWidth | null> {
    const host = await this.host();
    const width = await host.getAttribute('data-sm-width');
    
    if (width === 'narrow' || width === 'default' || width === 'wide') {
      return width;
    }
    
    return null;
  }

  /** Gets whether the icon button is togglable. */
  async isTogglable(): Promise<boolean> {
    const host = await this.host();
    const togglable = await host.getAttribute('data-sm-toggle');
    return togglable === 'true';
  }

  /** Gets whether the icon button is selected (only applicable if togglable). */
  async isSelected(): Promise<boolean> {
    const host = await this.host();
    const selected = await host.getAttribute('data-sm-selected');
    return selected === 'true';
  }

  /**
   * Toggles the icon button's selected state by clicking it.
   * Only works if the icon button is togglable.
   */
  async toggle(): Promise<void> {
    if (!(await this.isTogglable())) {
      throw new Error('Cannot toggle a non-togglable icon button');
    }
    await this.click();
  }
}

