# Progress Indicator

## Overview

Progress indicators display the status of an ongoing process.
They use **motion** to capture attention and communicate progress.

There are two types:

* **Linear progress indicator**
* **Circular progress indicator**

Use the same configuration for all instances of a process (such as loading).
An optional **wave effect** can be applied to the active track for cases where increased expressiveness is desired.

---

## Structure

* **Active indicator:** The moving element that represents ongoing progress.
* **Track:** The background surface behind the active indicator.
* **Stop indicator:** Marks the beginning or end of the progress range.

---

## Configurations

* **Behavior:** Determinate and indeterminate
* **Thickness:** Default (4dp) and variable
* **Shape:** Flat and wavy

---

## Measurements

**Wavy indicators** use amplitude and wavelength to define the wave pattern.

* **Amplitude:** The distance from the center of the resting position to the center of a peak.
* **Wavelength:** The distance between two adjacent peaks.
* **Height:** Matches the overall container height.

---

## Accessibility

People using assistive technology should be able to:

* Navigate to the progress indicator.
* Understand what progress or process is being communicated.

**Labeling elements:**

* The progress indicator requires an **accessibility label** to describe its purpose and progress.
* Use the **progress bar** accessibility role.
* The label should describe both the process and the content affected.
  Examples:

  * “Loading news article”
  * “Refreshing page”

---
