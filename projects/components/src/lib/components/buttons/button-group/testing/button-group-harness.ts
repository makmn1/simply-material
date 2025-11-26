import {
  ComponentHarnessConstructor,
  ContentContainerComponentHarness,
  HarnessPredicate,
} from '@angular/cdk/testing';
import {
  ButtonGroupHarnessFilters,
  ButtonGroupType,
  ButtonGroupSize,
  ButtonGroupDefaultShape,
} from './button-group-harness-filters';
import {SimplyMatButtonHarness} from '../../button/testing/button-harness';
import {SimplyMatIconButtonHarness} from '../../icon-button/testing/icon-button-harness';

/** Harness for interacting with a SimplyMatButtonGroup in tests. */
export class SimplyMatButtonGroupHarness extends ContentContainerComponentHarness {
  /** Selector for the harness. */
  static hostSelector = 'simply-mat-button-group:not([ngListbox])';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a button group with specific attributes.
   * @param options Options for narrowing the search:
   *   - `selector` finds a button group whose host element matches the given selector.
   *   - `type` finds button groups matching a specific type.
   *   - `size` finds button groups matching a specific size.
   *   - `defaultButtonShape` finds button groups matching a specific default button shape.
   *   - `disableWidthAnimations` finds button groups matching a specific disabled width animations state.
   * @return a `HarnessPredicate` configured with the given options.
   */
  static with<T extends SimplyMatButtonGroupHarness>(
    this: ComponentHarnessConstructor<T>,
    options: ButtonGroupHarnessFilters = {},
  ): HarnessPredicate<T> {
    return new HarnessPredicate(this, options)
      .addOption('type', options.type, (harness, type) =>
        HarnessPredicate.stringMatches(harness.getType(), type),
      )
      .addOption('size', options.size, (harness, size) =>
        HarnessPredicate.stringMatches(harness.getSize(), size),
      )
      .addOption('defaultButtonShape', options.defaultButtonShape, (harness, shape) =>
        HarnessPredicate.stringMatches(harness.getDefaultButtonShape(), shape),
      )
      .addOption('disableWidthAnimations', options.disableWidthAnimations, async (harness, disabled) => {
        return (await harness.hasDisabledWidthAnimations()) === disabled;
      });
  }

  /** Gets the type of the button group. */
  async getType(): Promise<ButtonGroupType | null> {
    const host = await this.host();
    const type = await host.getAttribute('data-sm-type');
    
    if (type === 'standard' || type === 'connected') {
      return type;
    }
    
    return null;
  }

  /** Gets the size of the button group. */
  async getSize(): Promise<ButtonGroupSize | null> {
    const host = await this.host();
    const size = await host.getAttribute('data-sm-size');
    
    if (size === 'xsmall' || size === 'small' || size === 'medium' || 
        size === 'large' || size === 'xlarge') {
      return size;
    }
    
    return null;
  }

  /** Gets the default button shape of the button group. */
  async getDefaultButtonShape(): Promise<ButtonGroupDefaultShape | null> {
    const host = await this.host();
    const shape = await host.getAttribute('data-sm-default-shape');
    
    if (shape === 'round' || shape === 'square') {
      return shape;
    }
    
    return null;
  }

  /** Gets whether the button group has disabled width animations. */
  async hasDisabledWidthAnimations(): Promise<boolean> {
    const host = await this.host();
    const disabled = await host.getAttribute('data-sm-disable-width-animations');
    return disabled === 'true';
  }

  /** Gets all SimplyMatButton instances in the button group. */
  async getButtons(): Promise<SimplyMatButtonHarness[]> {
    return this.locatorForAll(SimplyMatButtonHarness)();
  }

  /** Gets all SimplyMatIconButton instances in the button group. */
  async getIconButtons(): Promise<SimplyMatIconButtonHarness[]> {
    return this.locatorForAll(SimplyMatIconButtonHarness)();
  }

  /**
   * Gets all button instances (both SimplyMatButton and SimplyMatIconButton) in the button group.
   * @returns An array containing both button and icon button harnesses.
   */
  async getAllButtons(): Promise<Array<SimplyMatButtonHarness | SimplyMatIconButtonHarness>> {
    const [buttons, iconButtons] = await Promise.all([
      this.getButtons(),
      this.getIconButtons()
    ]);
    return [...buttons, ...iconButtons];
  }
}

