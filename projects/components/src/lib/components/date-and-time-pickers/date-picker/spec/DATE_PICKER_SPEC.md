# Date Picker

## Overview

Date pickers allow users to select past, present, or future dates.
They clearly indicate important dates such as the current and selected days, following common calendar patterns.

**Types:**

* Docked
* Modal
* Modal input

---

## Structure

* **Container:** Displays a calendar view for selecting dates.
* **Text field:** Allows direct manual date entry.
* **Edit icon:** Provides access to the modal date input.
* **Calendar icon:** The exclusive entry point for opening the date picker.
* **Clear button (optional):** Removes the current date input.
* **Tooltips:** Provide additional information, such as shortcut keys or truncated label text.

---

## Behavior

* **Date entry methods:**

  * **Direct text entry:** Users can manually input a date into the text field.
  * **Picker selection:** Users can choose a date from the calendar view.

* The **calendar icon** is the only entry point for the date picker.
  This improves efficiency for screen reader and keyboard users by reducing required interactions.

* Each input (such as the text field, calendar icon, or edit icon) is a **separate tab stop**, improving discoverability.

* **Docked date picker:** The text field can be used directly for input.

* **Modal date picker:** Date input can be accessed using the **edit icon.**

* **Edit icon:** Indicates the ability to switch to the modal date input.

**Accessible date input:**

* Automatically format the date **after** the user presses Enter or leaves the text field.
* Do **not** automatically insert characters (such as slashes) while typing, as this can cause confusion for screen reader users.
* Accept multiple formats, including **dashes, spaces, slashes, dots**, and optional leading zeros.
* These flexible formats reduce input errors, especially for assistive technology users.

**Optional Clear button:**

* If not required, remove the Clear button to reduce unnecessary tab stops for keyboard users.

**Keyboard shortcuts:**

* Provide shortcut key information in **tooltips** and **hint descriptions**, ensuring they are read by screen readers.
* The **previous year button** and other interactive controls must be focusable by keyboard, with tooltips explaining behavior and shortcuts.

**Truncated labels and tooltips:**

* Tooltips should reveal the full label text on **hover** or **keyboard focus** when truncation occurs.
* **Days of the week** are not interactive or focusable, but tooltips may still appear on hover.
* The date picker relies on conventional abbreviations for day labels.

---

## Accessibility

People using assistive technology should be able to:

* Enter dates manually by typing.
* Use multiple input methods (text entry or picker selection).
* Navigate between months and years using the keyboard.
* Understand the full context of a selected date.

**Keyboard navigation:**

| Key                             | Function                                             |
|---------------------------------|------------------------------------------------------|
| **Enter / Return**              | Closes the calendar and saves the selected date      |
| **Page Up / Page Down**         | Moves to the same date in the next or previous month |
| **Home / End**                  | Moves to the first or last day of the month          |
| **Shift + Page Up / Page Down** | Moves to the same date in the next or previous year  |
| **Shift + M**                   | Opens the month list dropdown                        |
| **Shift + Y**                   | Opens the year list dropdown                         |

**Labeling elements:**

| Element                        | Accessibility label | Role   |
|--------------------------------|---------------------|--------|
| Previous / next month and year | “{label}”           | Button |
| Month and year dropdowns       | “{label}”           | Button |
| Days of the week               | Column header       | Button |
| Month grid                     | Grid                | Button |

**Text field labeling:**

* The text field’s accessibility label should clearly state its purpose (e.g., “Event date” or “Reservation date”).
* The label should match the placeholder text when the field is empty.
* The **helper text** below the field specifies the expected date format (e.g., “MM/DD/YYYY”) and serves as the field’s description.
* The default helper text is **“MM/DD/YYYY”**, but it can be customized.

**Screen reader support:**

* Labels must enumerate the **complete date** for clarity, e.g.,
  “Monday, August 17.”
  This ensures users hear the full date context instead of a partial reference.

---
