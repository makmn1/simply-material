import {BaseHarnessFilters} from '@angular/cdk/testing';

/** A set of criteria that can be used to filter a list of icon harness instances. */
export interface IconHarnessFilters extends BaseHarnessFilters {
  /** Only find instances which match the given aria-hidden state. */
  ariaHidden?: boolean;

  /** Only find instances whose aria-label matches the given value. */
  ariaLabel?: string | RegExp;

  /** Only find instances whose role matches the given value. */
  role?: string | RegExp;
}

