import {BaseHarnessFilters} from '@angular/cdk/testing';
import {FabColor, FabSize} from '../fab-base.types';

/** A set of criteria that can be used to filter a list of FAB base harness instances. */
export interface FabBaseHarnessFilters extends BaseHarnessFilters {
  /** Only find instances whose text matches the given value. */
  text?: string | RegExp;

  /** Only find instances with a specific color. */
  color?: FabColor;

  /** Only find instances with a specific size. */
  size?: FabSize;

  /** Only find instances which match the given tonal state. */
  tonal?: boolean;

  /** Only find instances which match the given disabled state. */
  disabled?: boolean;

  /** Only find instances whose aria-label matches the given value. */
  ariaLabel?: string | RegExp;

  /** Only find instances with a specific aria-labelledby value. */
  ariaLabelledby?: string;
}

