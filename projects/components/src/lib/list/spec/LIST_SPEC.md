# List

## Overview

Lists help users **find a specific item** and act on it efficiently.
List items should be ordered in a **logical way**, such as alphabetically or numerically, and should remain **short and easy to scan.**

**Sizes:**

* One-line
* Two-line
* Three-line

List items can include icons, text, or actions, which should be displayed in a **consistent format.**

---

## Structure

### List Item Anatomy

* **Leading video thumbnail (optional)**
* **Container**
* **Headline**
* **Supporting text (optional)**
* **Trailing supporting text (optional)**
* **Leading icon (optional)**
* **Leading avatar label text (optional)**
* **Trailing icon (optional)**
* **Leading avatar container (optional)**
* **Divider (optional)**

---

## Accessibility

Users should be able to:

* Navigate to a list item using assistive technology.
* Select a list item.

**Focus:**

* The **first element** in a list should receive focus by default.
* If a list contains a **selected element**, focus should land on that selected item instead.
* Once focused, users can navigate within the list using **arrow keys.**
* All list items must be **selectable** using the **Space** or **Enter** keys.

**Keyboard navigation:**

| Key               | Action                                                 |
|-------------------|--------------------------------------------------------|
| **Tab**           | Moves focus to the first list item or selected element |
| **Arrows**        | Moves focus up or down between list items              |
| **Space / Enter** | Selects a list item not yet selected                   |

**Labeling elements:**

* The accessibility label for a list is typically the same as its **headline text label.**

| Element       | Accessibility label       | Role (Web) |
|---------------|---------------------------|------------|
| **List item** | Headline, Supporting text | Option     |

---
