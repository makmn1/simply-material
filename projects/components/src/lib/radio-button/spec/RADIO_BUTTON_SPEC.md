# Radio Button

## Overview

Radio buttons allow users to select a single option from a list.
They should be used instead of switches when only one item can be selected at a time.
Labels should be **scannable**, and selected items should appear **more prominent** than unselected ones.

---

## Structure

* **Container:** Holds one or more radio buttons within a group.
* **Radio button:** Displays one of two states — selected or unselected.
* **Label:** Text associated with the radio button describing the option.

---

## Accessibility

People using assistive technology should be able to:

* Navigate to a radio button.
* Select a radio button.
* Receive appropriate feedback based on input type.

**Initial focus:**

* When focus moves into the radio group:

  * **Tab** moves focus to the selected radio button, or the first one if none are selected.
  * **Shift + Tab** moves focus to the selected radio button, or the last one if none are selected.

**Keyboard navigation:**

| Key             | Action                                                                                                                   |
|-----------------|--------------------------------------------------------------------------------------------------------------------------|
| **Tab**         | Moves focus into the group to the selected radio button, or the first if none are selected                               |
| **Shift + Tab** | Moves focus into the group to the selected radio button, or the last if none are selected                                |
| **Arrows**      | Moves focus and selection to the previous or next radio button; wraps focus and selection between first and last options |
| **Space**       | Selects the focused radio button; if already selected, no action occurs                                                  |

**Labeling elements:**

* When UI text is properly linked, assistive technology (such as a screen reader) reads the **UI text** followed by the **component’s role**.
* The accessibility label for a **group of radio buttons** is typically the same as its **title**, with the role **“Radio group.”**
* The accessibility label for an **individual radio button** is typically the same as its **adjacent text label.**

---
