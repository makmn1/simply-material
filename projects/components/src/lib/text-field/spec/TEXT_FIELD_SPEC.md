# Text Field

## Overview

Text fields allow users to input, edit, and review text.
They should appear clearly **interactive**, with the current state (blank, filled, or error) **visible at a glance.**
Keep **labels** and **error messages** brief and easy to act on.
Text fields commonly appear in **forms** and **dialogs.**

**Types:**

* **Filled text field**
* **Outlined text field**

---

## Structure

### Filled Text Field Anatomy

* **Container**
* **Leading icon (optional)**
* **Label text (empty)**
* **Label text (populated)**
* **Trailing icon (optional)**
* **Active indicator (focused)**
* **Caret**
* **Input text**
* **Supporting text (optional)**
* **Active indicator (enabled)**

**Filled text field configurations:**

* With supporting text
* With trailing icon
* With leading icon
* With leading and trailing icon
* With prefix
* With suffix
* Multi-line text field

---

### Outlined Text Field Anatomy

* **Container outline (enabled)**
* **Leading icon (optional)**
* **Label text (unpopulated)**
* **Label text (populated)**
* **Trailing icon (optional)**
* **Container outline (focused)**
* **Caret**
* **Input text**
* **Supporting text (optional)**

**Outlined text field configurations:**

* With supporting text
* With trailing icon
* With leading icon
* With leading and trailing icon
* With prefix
* With suffix
* Multi-line text field

---

## Accessibility

Users should be able to:

* Navigate to and activate a text field using assistive technology.
* Input and edit information.
* Receive and understand supporting text and error messages.
* Navigate to and select interactive icons.

**Keyboard navigation:**

| Key     | Action                                          |
|---------|-------------------------------------------------|
| **Tab** | Moves focus to the text field (if not disabled) |

**Labeling elements:**

* When UI text is correctly linked, assistive technology (such as a screen reader) reads the **UI text** followed by the **component’s role.**
* The accessibility label for a text field is the same as its **visible label.**

**Trailing icons:**

* For interactive icons, the label should clarify the function.

  * Example:

    * Hidden password: **“Show password.”**
    * Visible password: **“Hide password.”**
* For non-actionable icons, like an error icon, the label should be **“Error.”**

**Prefix and suffix:**

* Provide symbols or abbreviations to help users enter correct values.
* Accessibility labels for prefixes or suffixes should have **unique ID attributes**, such as the currency name for a currency symbol prefix.

**Error handling:**

* When a text field has an error:

  * The **role “alert”** is applied.
  * The **error message** is included in the text label.
* If both supporting text and error text are present, the label should include **supporting text first**, followed by **error text.**

**Character counter:**

* The accessibility label clarifies the number of characters that can be entered.

**Supporting text:**

* The displayed supporting text is also used for its accessibility label.

**Required fields:**

* If a text field requires to be input, an **asterisk (*)** should appear at the end of the label.
* The accessibility label must include the asterisk.

---
