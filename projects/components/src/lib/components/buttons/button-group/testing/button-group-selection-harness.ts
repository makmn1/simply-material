import {SimplyMatButtonGroupHarness} from './button-group-harness';
import {SimplyMatButtonHarness} from '../../button/testing';
import {SimplyMatIconButtonHarness} from '../../icon-button/testing';

/** Harness for interacting with a SimplyMatButtonGroupSelection (with listbox) in tests. */
export class SimplyMatButtonGroupSelectionHarness extends SimplyMatButtonGroupHarness {
  /** Selector for the harness. */
  static override hostSelector = 'simply-mat-button-group-selection';

  /** Gets whether the button group is in multi-selection mode. */
  async isMultiSelection(): Promise<boolean> {
    const host = await this.host();
    const ariaMultiselectable = await host.getAttribute('aria-multiselectable');
    return ariaMultiselectable === 'true';
  }

  /** Gets the orientation of the listbox. */
  async getOrientation(): Promise<'horizontal' | 'vertical'> {
    const host = await this.host();
    const ariaOrientation = await host.getAttribute('aria-orientation');
    return ariaOrientation === 'horizontal' ? 'horizontal' : 'vertical';
  }

  /** Gets whether the button group is disabled. */
  async isDisabled(): Promise<boolean> {
    const host = await this.host();
    const ariaDisabled = await host.getAttribute('aria-disabled');
    // aria-disabled might be 'true', 'false', or null
    return ariaDisabled === 'true';
  }

  /** Gets whether the button group is readonly. */
  async isReadonly(): Promise<boolean> {
    const host = await this.host();
    const ariaReadonly = await host.getAttribute('aria-readonly');
    return ariaReadonly === 'true';
  }

  /**
   * Gets all selected button instances in the button group.
   * @returns An array of selected button harnesses.
   */
  async getSelectedButtons(): Promise<Array<SimplyMatButtonHarness | SimplyMatIconButtonHarness>> {
    const allButtons = await this.getAllButtons();
    const selectedButtons: Array<SimplyMatButtonHarness | SimplyMatIconButtonHarness> = [];

    for (const button of allButtons) {
      if (await button.isSelected()) {
        selectedButtons.push(button);
      }
    }

    return selectedButtons;
  }

  /**
   * Selects a button by clicking it.
   * @param index The index of the button to select.
   */
  async selectButtonByIndex(index: number): Promise<void> {
    const buttons = await this.getAllButtons();
    if (index < 0 || index >= buttons.length) {
      throw new Error(`Button index ${index} is out of bounds. Available buttons: ${buttons.length}`);
    }
    await buttons[index].click();
  }

  /**
   * Deselects a button by clicking it (only works in multi-selection mode).
   * @param index The index of the button to deselect.
   */
  async deselectButtonByIndex(index: number): Promise<void> {
    const isMulti = await this.isMultiSelection();
    if (!isMulti) {
      throw new Error('Cannot deselect in single-selection mode');
    }

    const buttons = await this.getAllButtons();
    if (index < 0 || index >= buttons.length) {
      throw new Error(`Button index ${index} is out of bounds. Available buttons: ${buttons.length}`);
    }

    const button = buttons[index];
    if (await button.isSelected()) {
      await button.click();
    }
  }

  /**
   * Selects a button by its text content.
   * @param text The text content of the button to select.
   */
  async selectButtonByText(text: string | RegExp): Promise<void> {
    const buttons = await this.getAllButtons();

    for (const button of buttons) {
      const buttonText = await button.getText();
      const matches = typeof text === 'string'
        ? buttonText === text
        : text.test(buttonText);

      if (matches) {
        await button.click();
        return;
      }
    }

    throw new Error(`Button with text "${text}" not found`);
  }

  /**
   * Deselects a button by its text content (only works in multi-selection mode).
   * @param text The text content of the button to deselect.
   */
  async deselectButtonByText(text: string | RegExp): Promise<void> {
    const isMulti = await this.isMultiSelection();
    if (!isMulti) {
      throw new Error('Cannot deselect in single-selection mode');
    }

    const buttons = await this.getAllButtons();

    for (const button of buttons) {
      const buttonText = await button.getText();
      const matches = typeof text === 'string'
        ? buttonText === text
        : text.test(buttonText);

      if (matches && await button.isSelected()) {
        await button.click();
        return;
      }
    }

    throw new Error(`Selected button with text "${text}" not found`);
  }
}

