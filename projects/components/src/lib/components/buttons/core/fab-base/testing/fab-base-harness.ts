import {
  ComponentHarnessConstructor,
  ContentContainerComponentHarness,
  HarnessPredicate,
} from '@angular/cdk/testing';
import {FabBaseHarnessFilters} from './fab-base-harness-filters';
import {FabColor, FabSize} from '../fab-base.types';

/** Harness for interacting with a FabBase in tests. */
export class FabBaseHarness extends ContentContainerComponentHarness {
  /** Selector for the harness. */
  static hostSelector = '[simplyMatFabBase]';

  /**
   * Gets a `HarnessPredicate` that can be used to search for a FAB base with specific attributes.
   * @param options Options for narrowing the search:
   *   - `selector` finds a FAB base whose host element matches the given selector.
   *   - `text` finds a FAB base with specific text content.
   *   - `color` finds FAB bases matching a specific color.
   *   - `size` finds FAB bases matching a specific size.
   *   - `tonal` finds FAB bases matching a specific tonal state.
   *   - `disabled` finds FAB bases matching a specific disabled state.
   *   - `ariaLabel` finds FAB bases matching a specific aria-label.
   *   - `ariaLabelledby` finds FAB bases matching a specific aria-labelledby.
   * @return a `HarnessPredicate` configured with the given options.
   */
  static with<T extends FabBaseHarness>(
    this: ComponentHarnessConstructor<T>,
    options: FabBaseHarnessFilters = {},
  ): HarnessPredicate<T> {
    return new HarnessPredicate(this, options)
      .addOption('text', options.text, (harness, text) =>
        HarnessPredicate.stringMatches(harness.getText(), text),
      )
      .addOption('color', options.color, (harness, color) =>
        HarnessPredicate.stringMatches(harness.getColor(), color),
      )
      .addOption('size', options.size, (harness, size) =>
        HarnessPredicate.stringMatches(harness.getSize(), size),
      )
      .addOption('tonal', options.tonal, async (harness, tonal) => {
        return (await harness.isTonal()) === tonal;
      })
      .addOption('disabled', options.disabled, async (harness, disabled) => {
        return (await harness.isDisabled()) === disabled;
      })
      .addOption('ariaLabel', options.ariaLabel, (harness, ariaLabel) =>
        HarnessPredicate.stringMatches(harness.getAriaLabel(), ariaLabel),
      )
      .addOption('ariaLabelledby', options.ariaLabelledby, (harness, ariaLabelledby) =>
        HarnessPredicate.stringMatches(harness.getAriaLabelledby(), ariaLabelledby),
      );
  }

  /**
   * Clicks the FAB at the given position relative to its top-left.
   * @param relativeX The relative x position of the click.
   * @param relativeY The relative y position of the click.
   */
  click(relativeX: number, relativeY: number): Promise<void>;
  /** Clicks the FAB at its center. */
  click(location: 'center'): Promise<void>;
  /** Clicks the FAB. */
  click(): Promise<void>;
  async click(...args: [] | ['center'] | [number, number]): Promise<void> {
    return (await this.host()).click(...(args as []));
  }

  /** Gets a boolean promise indicating if the FAB is disabled. */
  async isDisabled(): Promise<boolean> {
    const host = await this.host();
    const disabled = await host.getAttribute('disabled');
    const ariaDisabled = await host.getAttribute('aria-disabled');
    return disabled !== null || ariaDisabled === 'true';
  }

  /** Gets a promise for the FAB's label text. */
  async getText(): Promise<string> {
    return (await this.host()).text();
  }

  /** Focuses the FAB and returns a void promise that indicates when the action is complete. */
  async focus(): Promise<void> {
    return (await this.host()).focus();
  }

  /** Blurs the FAB and returns a void promise that indicates when the action is complete. */
  async blur(): Promise<void> {
    return (await this.host()).blur();
  }

  /** Whether the FAB is focused. */
  async isFocused(): Promise<boolean> {
    return (await this.host()).isFocused();
  }

  /** Gets the color of the FAB. */
  async getColor(): Promise<FabColor | null> {
    const host = await this.host();
    const color = await host.getAttribute('data-sm-color');

    if (color === 'primary' || color === 'secondary' || color === 'tertiary') {
      return color;
    }

    return null;
  }

  /** Gets the size of the FAB. */
  async getSize(): Promise<FabSize | null> {
    const host = await this.host();
    const size = await host.getAttribute('data-sm-size');

    if (size === 'small' || size === 'medium' || size === 'large') {
      return size;
    }

    return null;
  }

  /** Gets whether the FAB is tonal. */
  async isTonal(): Promise<boolean> {
    const host = await this.host();
    const tonal = await host.getAttribute('data-sm-tonal');
    return tonal !== null;
  }

  /** Gets the aria-label of the FAB. */
  async getAriaLabel(): Promise<string | null> {
    const host = await this.host();
    return await host.getAttribute('aria-label');
  }

  /** Gets the aria-labelledby of the FAB. */
  async getAriaLabelledby(): Promise<string | null> {
    const host = await this.host();
    return await host.getAttribute('aria-labelledby');
  }
}

