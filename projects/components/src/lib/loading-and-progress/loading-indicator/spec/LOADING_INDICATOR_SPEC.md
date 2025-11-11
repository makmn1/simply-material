# Loading Indicator

## Overview

The loading indicator is recommended as a replacement for **indeterminate circular progress indicators.**
It visually reflects an ongoing process and should **never be purely decorative.**

Loading indicators are commonly used for **pull-to-refresh interactions** and to capture attention through motion.
They should **not** be used for processes that transition from indeterminate to determinate progress.

---

## Structure

* **Active indicator:** The moving element that visually represents ongoing activity.
* **Container:** Holds the active indicator and defines its size and position within the interface.

---

## Behavior

* Reflects an **active, ongoing process** (for example, loading or refreshing content).
* Should not be static or decorative.
* Commonly appears during **pull-to-refresh** actions.
* Not used for mixed progress types (indeterminate → determinate).

---

## Accessibility

People using assistive technology should be able to:

* Navigate to the loading indicator.
* Understand what process or progress the indicator is communicating.
* Initiate a content refresh without relying solely on gestures.

**Labeling elements:**

* Because the loading indicator is a **visual cue**, it requires an **accessibility label** for users who cannot rely on visuals.
* Use the **progress bar** accessibility role.
* Provide a descriptive label that communicates the purpose of the indicator, such as:

  * “Loading news article”
  * “Refreshing page”

---
