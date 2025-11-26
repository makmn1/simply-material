import {
  ComponentHarnessConstructor,
  HarnessPredicate,
} from '@angular/cdk/testing';
import {SimplyMatButtonHarness} from './button-harness';
import {ButtonOptionHarnessFilters} from './button-option-harness-filters';

/** Harness for interacting with a SimplyMatButtonOption in tests. */
export class SimplyMatButtonOptionHarness extends SimplyMatButtonHarness {
  /** Selector for the harness. */
  static override hostSelector = 'button[simplyMatButton][ngOption]';
}

