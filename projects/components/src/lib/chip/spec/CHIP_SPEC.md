# Chip

## Overview

Chips represent compact elements that allow users to make selections, filter content, or trigger actions within a specific context.

**Types:**

* **Assist chips:** Represent smart or automated actions that can span multiple apps, such as opening a calendar event from the home screen.
* **Filter chips:** Use tags or descriptive words to filter content. They can serve as alternatives to toggle buttons or checkboxes.
* **Input chips:** Represent discrete pieces of user-entered information, such as contacts or selected filters.
* **Suggestion chips:** Present dynamically generated suggestions, such as search filters or suggested responses.

Chip elevation defaults to **0**, but chips can be **elevated** when additional visual separation is needed.

---

## Structure

* **Container:** Compact surface that holds the chip’s content and icons.
* **Label:** Describes the chip’s purpose or value.
* **Icon (optional):** Represents an associated action or image.
* **Remove icon (optional):** Allows removal of the chip.

---

## Behavior

Each chip can be used to perform an action, navigate, or represent a selected state.
Chips are **focusable elements** and may contain one or two focusable actions, depending on configuration.

* If a chip has **only a remove icon**, the chip and icon act as a **single focusable element.**
* If a chip has **a second action** (e.g., select + remove), the **chip content** and **remove icon** are **two separate focusable elements.**

**Input chip remove action:**

* Display the remove icon whenever a chip can be removed.
* On mobile, if **remove** is the only chip action, the icon is not required — the chip can be removed by selecting it and pressing the **Delete** key on the keyboard.

---

## Accessibility

People using assistive technology should be able to:

* Use a chip to perform an action.
* Navigate to a chip.
* Activate a chip.

**Labeling elements:**

| Element                             | Accessibility label                             | Role (Web)         |
|-------------------------------------|-------------------------------------------------|--------------------|
| Image / Icon within chip            | Hide image                                      | –                  |
| Basic chip (one action)             | “{chip content}”                                | gridcell           |
| Selectable chip                     | “{chip content}”                                | gridcell           |
| Remove icon (no other action)       | “Remove {chip content}”                         | –                  |
| Two actions (e.g., select + remove) | “{chip content}.” Then “Remove {chip content}.” | button or checkbox |

The accessibility label for a chip is its **label text**.
Additional actions, such as **remove**, are labeled separately.
Accessibility tags should include both the **label** and the **role.**

---
