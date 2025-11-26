import {
  ComponentHarness,
  ComponentHarnessConstructor,
  HarnessPredicate,
} from '@angular/cdk/testing';
import {TooltipHarnessFilters} from './tooltip-harness-filters';

/** Harness for interacting with a sm-tooltip in tests. */
export class SmTooltipHarness extends ComponentHarness {
  static hostSelector = '[sm-tooltip]';

  private _optionalPanel = this.documentRootLocatorFactory().locatorForOptional('[role="tooltip"]');

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
    const panel = await this._optionalPanel();
    return !!panel;
  }

  /** Gets whether the tooltip is disabled. */
  async isDisabled(): Promise<boolean> {
    const host = await this.host();
    return (await host.getAttribute('disabled')) !== null;
  }

  /** Gets the type of the tooltip (plain or rich). */
  async getType(): Promise<'plain' | 'rich'> {
    const panel = await this._optionalPanel();
    if (!panel) {
      throw new Error('Cannot get tooltip type when tooltip is closed');
    }
    const type = await panel.getAttribute('data-sm-type');
    return (type as 'plain' | 'rich') || 'plain';
  }

  /** Gets the text content of a plain tooltip. Returns empty string if tooltip is closed. */
  async getTooltipText(): Promise<string> {
    const panel = await this._optionalPanel();
    if (!panel) {
      return '';
    }
    
    const type = await this.getType();
    if (type === 'plain') {
      const textElement = await this.documentRootLocatorFactory()
        .locatorForOptional('.sm-tooltip-content__plain-text')();
      return textElement ? await textElement.text() : '';
    }
    
    return '';
  }

  /** Gets the subhead text of a rich tooltip. Returns null if no subhead exists. */
  async getSubhead(): Promise<string | null> {
    const panel = await this._optionalPanel();
    if (!panel) {
      throw new Error('Cannot get subhead when tooltip is closed');
    }
    
    const subheadElement = await this.documentRootLocatorFactory()
      .locatorForOptional('.sm-tooltip-content__rich-subhead')();
    
    return subheadElement ? await subheadElement.text() : null;
  }

  /** Gets the supporting text of a rich tooltip. */
  async getSupportingText(): Promise<string> {
    const panel = await this._optionalPanel();
    if (!panel) {
      throw new Error('Cannot get supporting text when tooltip is closed');
    }
    
    const textElement = await this.documentRootLocatorFactory()
      .locatorFor('.sm-tooltip-content__rich-supporting-text')();
    
    return await textElement.text();
  }

  /** Gets an array of button labels from a rich tooltip. */
  async getButtons(): Promise<string[]> {
    const panel = await this._optionalPanel();
    if (!panel) {
      return [];
    }
    
    const buttonElements = await this.documentRootLocatorFactory()
      .locatorForAll('.sm-tooltip-content__rich-action-button')();
    
    const labels: string[] = [];
    for (const button of buttonElements) {
      labels.push(await button.text());
    }
    
    return labels;
  }

  /**
   * Clicks a button in a rich tooltip.
   * @param indexOrLabel The index or label text of the button to click.
   */
  async clickButton(indexOrLabel: number | string): Promise<void> {
    const panel = await this._optionalPanel();
    if (!panel) {
      throw new Error('Cannot click button when tooltip is closed');
    }
    
    const buttonElements = await this.documentRootLocatorFactory()
      .locatorForAll('.sm-tooltip-content__rich-action-button')();
    
    if (typeof indexOrLabel === 'number') {
      if (indexOrLabel < 0 || indexOrLabel >= buttonElements.length) {
        throw new Error(`Button index ${indexOrLabel} is out of bounds`);
      }
      await buttonElements[indexOrLabel].click();
    } else {
      let found = false;
      for (const button of buttonElements) {
        const text = await button.text();
        if (text === indexOrLabel) {
          await button.click();
          found = true;
          break;
        }
      }
      if (!found) {
        throw new Error(`Button with label "${indexOrLabel}" not found`);
      }
    }
  }
}

