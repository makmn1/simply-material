# Icon Button

## Overview

Icon buttons display system icons that represent actions with clear meaning.
They can appear as a **default** button or a **toggle** button.

Icon buttons can vary in **color**, **size**, **width**, and **shape**.
There are four built-in color styles:

* **Filled**
* **Tonal**
* **Outlined**
* **Standard**

Default and toggle buttons use different color roles for each style.

On web, a tooltip should be displayed while hovering to describe the button’s action.

In toggle buttons, the **outlined** style of an icon is used for the **unselected** state, and the **filled** style for the **selected** state.

Color values are implemented through design tokens. Designers work with color values that correspond with tokens, and in implementation, these are represented by tokens that reference those values.

---

## Structure

* **Container:** Defines the interactive area of the button.
* **Icon:** Displays a system icon with clear meaning.
* **Tooltip:** Describes the action when hovered (on web).
* **State layer:** Slightly changes button color to communicate state.

---

## Behavior

* **Types:** Default and toggle.
* **Color styles:** Filled, tonal, outlined, standard.
* **States:** Visual representations that communicate the status of the button.

  * State layers are applied to slightly change the button color.
  * Disabled states use different base colors.

In toggle buttons, icon style changes between outlined and filled to represent selection.

---

## Accessibility

People using assistive technology should be able to:

* Understand the meaning of the icon.
* Navigate to and activate an icon button.
* Access a tooltip (when available) to understand the button’s purpose.

Accessibility labels must describe the action performed by the button, such as:

> “Add to favorites,” “Bookmark,” or “Send message.”

On web, icon buttons should display a tooltip containing the same accessibility label.

---
