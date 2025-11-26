# Extended Floating Action Button (Extended FAB)

## Overview

The Extended FAB is used for the most common or important action on a screen.
It includes a label alongside an icon and should be used when text is necessary to clarify the action.

**Sizes:**

* Small
* Medium
* Large

**Color combinations:**
Extended FABs can use several combinations of color and on-color styles.
All mappings provide the same level of contrast and functionality, and the choice is based on visual preference.

**Color roles for light and dark schemes:**

* Primary container & On primary container *(default)*
* Secondary container & On secondary container
* Tertiary container & On tertiary container
* Primary & On primary
* Secondary & On secondary
* Tertiary & On tertiary

---

## Structure

* **Container:** Floating rounded surface containing both an icon and a text label.
* **Icon:** Represents the action visually.
* **Label:** Provides descriptive text for the action.
* **State layer:** Communicates interaction states through color and opacity changes.

---

## Behavior

* **States:** Visual representations communicate the component’s current status (e.g., enabled, focused, pressed).
* **Color behavior:**

  * When using a non-default color mapping, the **state layer color** must match the **icon color**.
  * Example: For the primary mapping, the state layer color should be `md.sys.color.primary`.

---

## Accessibility

People using assistive technology should be able to:

* Navigate to and activate the extended FAB.

**Focus behavior:**

* The extended FAB should be prioritized in the overall focus order for efficient navigation.
* On mobile, focus order may begin with the app bar, move to the navigation bar, then skip other content to land on the extended FAB.
* The visible label and icon are treated as a single focusable element.

**Tooltip:**

* A tooltip is not needed because the extended FAB already includes a visible label.

**Labels:**

* An accessibility label must be present on the extended FAB.

---
