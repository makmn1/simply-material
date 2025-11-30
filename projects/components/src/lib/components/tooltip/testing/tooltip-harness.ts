import {
  ComponentHarness,
  ComponentHarnessConstructor,
  HarnessPredicate,
} from '@angular/cdk/testing';
import {TooltipHarnessFilters} from './tooltip-harness-filters';

/** Harness for interacting with a sm-tooltip in tests. */
export class SmTooltipHarness extends ComponentHarness {
  static hostSelector = '[sm-tooltip]';

  private _optionalContent = this.documentRootLocatorFactory().locatorForOptional('sm-tooltip-content');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a tooltip trigger with specific
   * attributes.
   * @param options Options for narrowing the search.
   * @return a `HarnessPredicate` configured with the given options.
   */
  static with<T extends SmTooltipHarness>(
    this: ComponentHarnessConstructor<T>,
    options: TooltipHarnessFilters = {},
  ): HarnessPredicate<T> {
    return new HarnessPredicate(this, options);
  }

  /** Shows the tooltip using interaction methods (hover and focus). */
  async show(): Promise<void> {
    const host = await this.host();
    await host.hover();
    await host.focus();
  }

  /** Hides the tooltip using interaction methods (mouse away and blur). */
  async hide(): Promise<void> {
    const host = await this.host();
    await host.mouseAway();
    await host.blur();
  }

  /** Opens the tooltip programmatically by calling the directive's open() method. */
  async open(): Promise<void> {
    const host = await this.host();
    await host.dispatchEvent('mouseenter');
    await host.focus();
  }

  /** Closes the tooltip programmatically by calling the directive's close() method. */
  async close(): Promise<void> {
    const host = await this.host();
    await host.mouseAway();
    await host.blur();
  }

  /** Gets whether the tooltip is open. */
  async isOpen(): Promise<boolean> {
    const content = await this._optionalContent();
    return !!content;
  }

  /** Gets whether the tooltip is disabled. */
  async isDisabled(): Promise<boolean> {
    const host = await this.host();
    return (await host.getAttribute('disabled')) !== null;
  }

  /** Gets the type of the tooltip (plain or rich). */
  async getType(): Promise<'plain' | 'rich'> {
    const content = await this._optionalContent();
    if (!content) {
      throw new Error('Cannot get tooltip type when tooltip is closed');
    }
    const type = await content.getAttribute('data-sm-type');
    return (type as 'plain' | 'rich') || 'plain';
  }

  /** Gets the text content of a plain tooltip. Returns an empty string if the tooltip is closed. */
  async getTooltipText(): Promise<string> {
    const content = await this._optionalContent();
    if (!content) {
      return '';
    }

    const type = await this.getType();
    if (type === 'plain') {
      return (await content.text()).trim();
    }

    return '';
  }
}

