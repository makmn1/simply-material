# Split Button

## Overview

A split button presents a primary action along with a menu of related actions.
It shares the same size range as buttons and icon buttons: **extra small, small, medium, large, and extra large.**

A split button consists of:

* A **leading button** (common button)
* A **trailing button** (menu icon button)

**Color configurations:** Elevated, filled, tonal, outlined
**Size configurations:** XS, S, M, L, XL

The leading button can contain an **icon**, **label text**, or **both**.
The trailing button should always contain a **menu icon**.

Color values are implemented through design tokens.
Split buttons use the same color schemes as standard buttons.
Unlike toggle buttons, a split button’s color does not change when selected—only a **state layer** is applied.

Split buttons share the same colors and state layers as buttons and icon buttons.

---

## Structure

* **Leading button:** Performs the main action. Can display an icon, label, or both.
* **Trailing button:** Opens a related menu. Always contains a menu icon.
* **State layers:** Applied to communicate interaction states such as hover, focus, or press.

---

## Behavior

**States:**
Split buttons use the same state colors and layers as buttons and icon buttons.

### Leading button shape

The inner corners of the leading button change shape for the following states:

* Enabled
* Disabled
* Hovered
* Focused
* Pressed
* Pressed with focus

### Trailing button shape

The inner corners of the trailing button change shape for the following states:

* Enabled
* Disabled
* Hovered
* Focused
* Pressed
* Pressed with focus
* Selected
* Selected with focus

When selected, the trailing icon becomes centered.

---

## Accessibility

People using assistive technology should be able to:

* Navigate to and interact with both buttons.
* Navigate to any element opened by the trailing button.
* Understand the current selection state of the split button.

**Focus behavior:**

* Initial focus should land on the **leading button** and then move to the **trailing button**.
* The order can vary depending on the operating system.

**Keyboard interactions:**

* **Tab:** Navigate between the two buttons.
* **Space or Enter:** Activate the focused button.

**Labeling:**

* The accessibility label for the **leading button** is the same as standard buttons.
* The **trailing icon button** should include an additional state or similar label indicating whether the menu is **expanded or collapsed.**
* Label the trailing button clearly to indicate that it provides **additional related options.**

  * Example: If the main button says “Watch later,” the secondary button might say “More watch options.”
* Label the opened menu according to **menu accessibility guidance.**

---
