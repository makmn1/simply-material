# Floating Action Button (FAB)

## Overview

A Floating Action Button (FAB) represents the most common or important action on a screen.
The icon within a FAB should be clear and easily understandable.

FABs remain visible when content is scrolling.

**Sizes:**

* FAB
* Medium FAB
* Large FAB

**Color combinations:**
FABs can use several combinations of color and on-color styles.
These mappings provide the same legibility and functionality, and the choice depends on style preference.

* Primary container & On primary container *(default)*
* Secondary container & On secondary container
* Tertiary container & On tertiary container
* Primary & On primary
* Secondary & On secondary
* Tertiary & On tertiary

---

## Structure

* **Container:** Floating circular or rounded surface that holds the icon.
* **Icon:** Represents the action clearly and meaningfully.
* **State layer:** Provides visual feedback for interactions (e.g., hover, pressed, focus).

---

## Behavior

* **States:** Visual representations communicate the status of the FAB (e.g., enabled, focused, pressed).
* **Color behavior:**

  * When using a non-default color mapping, the **state layer color** must match the **icon color**.
  * Example: For the primary color style, the state layer color should be `md.sys.color.primary`.

FABs persist during scrolling and can remain visible above content.

---

## Accessibility

People using assistive technology should be able to:

* Navigate to and activate the FAB.
* Perform the FAB’s action.
* Expand and minimize an extended FAB.

**Focus behavior:**

* The FAB should be prioritized in the overall focus order for efficient navigation.
* On mobile, focus order may begin with the app bar, move to the navigation bar, then skip other content to land on the FAB.

**Tooltips:**

* Consider displaying a tooltip when the FAB is focused.
* This behavior is supported on web.

**Labels:**

* The accessibility label should describe the action the button performs, such as “Compose a new message.”

---
