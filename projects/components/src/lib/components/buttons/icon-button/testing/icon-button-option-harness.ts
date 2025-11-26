import {SimplyMatIconButtonHarness} from './icon-button-harness';

/** Harness for interacting with a SimplyMatIconButtonOption in tests. */
export class SimplyMatIconButtonOptionHarness extends SimplyMatIconButtonHarness {
  /** Selector for the harness. */
  static override hostSelector = 'button[simplyMatIconButton][ngOption]';
}

