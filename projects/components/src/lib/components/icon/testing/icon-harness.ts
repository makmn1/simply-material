import {
  ComponentHarness,
  ComponentHarnessConstructor,
  HarnessPredicate,
} from '@angular/cdk/testing';
import {IconHarnessFilters} from './icon-harness-filters';

/** Harness for interacting with a SimplyMatIcon in tests. */
export class SimplyMatIconHarness extends ComponentHarness {
  /** Selector for the harness. */
  static hostSelector = 'simply-mat-icon';

  /**
   * Gets a `HarnessPredicate` that can be used to search for an icon with specific attributes.
   * @param options Options for narrowing the search:
   *   - `selector` finds an icon whose host element matches the given selector.
   *   - `ariaHidden` finds icons matching a specific aria-hidden state.
   *   - `ariaLabel` finds icons with a specific aria-label value.
   *   - `role` finds icons with a specific role value.
   * @return a `HarnessPredicate` configured with the given options.
   */
  static with<T extends SimplyMatIconHarness>(
    this: ComponentHarnessConstructor<T>,
    options: IconHarnessFilters = {},
  ): HarnessPredicate<T> {
    return new HarnessPredicate(this, options)
      .addOption('ariaHidden', options.ariaHidden, async (harness, ariaHidden) => {
        return (await harness.getAriaHidden()) === ariaHidden;
      })
      .addOption('ariaLabel', options.ariaLabel, (harness, ariaLabel) =>
        HarnessPredicate.stringMatches(harness.getAriaLabel(), ariaLabel),
      )
      .addOption('role', options.role, (harness, role) =>
        HarnessPredicate.stringMatches(harness.getRole(), role),
      );
  }

  /** Gets a boolean promise indicating if the icon has aria-hidden="true". */
  async getAriaHidden(): Promise<boolean> {
    const host = await this.host();
    const ariaHidden = await host.getAttribute('aria-hidden');
    return ariaHidden === 'true';
  }

  /** Gets a promise for the icon's aria-label value, or null if not set. */
  async getAriaLabel(): Promise<string | null> {
    const host = await this.host();
    return await host.getAttribute('aria-label');
  }

  /** Gets a promise for the icon's role attribute value, or null if not set. */
  async getRole(): Promise<string | null> {
    const host = await this.host();
    return await host.getAttribute('role');
  }

  /** Gets a promise for the icon's text content from projected content. */
  async getText(): Promise<string> {
    return (await this.host()).text();
  }
}

