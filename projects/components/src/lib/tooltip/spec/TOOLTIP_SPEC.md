# Tooltip

## Overview

Tooltips provide **additional context** to a button or other UI element.
They display short text or detailed descriptions to help users understand the purpose or value of an element.

**Types:**

* **Plain tooltip:** Describes elements or actions, typically for icon buttons.
* **Rich tooltip:** Provides additional details such as feature descriptions or contextual information, and can include an optional title, link, and buttons.

---

## Structure

### Plain Tooltip Anatomy

* **Supporting text**
* **Container**

### Rich Tooltip Anatomy

* **Subhead**
* **Container**
* **Supporting text**

**Rich Tooltip Configurations:**

* Subhead, supporting text, and two buttons
* Subhead, supporting text, and one button
* Subhead and supporting text
* Supporting text and one button
* Supporting text and two buttons

Rich tooltips can have a **headline**, **body**, and **up to two buttons**.
The headline and number of buttons are configurable.

---

## Accessibility

People using assistive technology should be able to:

* Receive a tooltip message.
* Activate a tooltip with a keyboard or switch input.

**Focus order:**

* Tooltip containers should **not block important information** or prevent interaction.
* Focus within a rich tooltip moves **top to bottom** through interactive elements.
* Avoid trapping screen reader or keyboard focus inside tooltips.
* Users must be able to move **linearly through the page** after interacting with a tooltip.

**Keyboard navigation:**

| Key               | Action                                |
|-------------------|---------------------------------------|
| **Tab**           | Moves focus to a button, if available |
| **Space / Enter** | Activates the focused element         |

**Labeling elements:**

* Tooltips should have the **Tooltip** role or a similar accessible role.
* All elements within a tooltip must be labeled according to their **own accessibility guidance.**

---

## Interaction & Style

* Plain and rich tooltips without required actions should remain on screen **long enough** for users to read them without disrupting their current task.
* Tooltips appear when an actionable element (such as a button or navigation rail) is **hovered or focused**, but they must not obscure critical information.
* **Rich tooltips** can also appear by **selecting an element**, not just by hovering or focusing.

---
