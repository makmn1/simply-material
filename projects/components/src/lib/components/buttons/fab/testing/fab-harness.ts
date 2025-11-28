import {FabBaseHarness} from '../../core/fab-base/testing';

/** Harness for interacting with a SimplyMatFab in tests. */
export class SimplyMatFabHarness extends FabBaseHarness {
  /** Selector for the harness. */
  static override hostSelector = 'button[simplyMatFab]';
}

