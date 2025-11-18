# Snackbar

## Overview

Snackbars display brief messages that inform users of a process or action without interrupting their experience.
They usually appear at the **bottom** of the interface and can either **disappear automatically** or **remain on screen** until the user takes action.

---

## Structure

* **Container**
* **Supporting text**
* **Action (optional)**
* **Icon (optional close affordance)**

**Configurations:**

* Single line
* Single line with action
* Two lines
* Two lines with action
* Two lines with longer action

---

## Accessibility

Users should be able to:

* Be alerted, but not disrupted, when a snackbar appears.
* Move focus to an actionable snackbar.
* Take action on a snackbar using assistive technology.

**Focus behavior:**

* When a snackbar appears, the **message is announced**, but focus does **not** automatically move.
* Focus should **not be trapped** inside the snackbar.
* Users should be able to **navigate freely** in and out of the snackbar.
* On web, a shortcut (such as **Alt+G**) should be available to move focus directly to actionable snackbars.
  This shortcut should be clearly documented (for example, in a help article).
* After dismissal, focus should return to the element that triggered the snackbar or the next logical element on the page.

**Keyboard navigation:**

| Key     | Action                                   |
|---------|------------------------------------------|
| **Tab** | Moves focus between interactive elements |
| **Esc** | Dismisses the snackbar when in focus     |

**Web accessibility requirements:**

1. **Add inline feedback:**
   For auto-dismissing snackbars, the same information must also appear inline or near the element that triggered it.
   Example: Change a “Save” button label to “Saved” and also show a snackbar confirming the action.

2. **Make the snackbar actionable:**
   Actionable snackbars **should not auto-dismiss**. They remain visible until the user interacts with them.

**Labeling elements:**

* Snackbars should be **announced** when they appear, but should **not take focus** or interrupt the current task.
* On web, use a **live region** with a **polite (queued)** announcement instead of an assertive one.
* If a snackbar appears when the app is launched, it should be **announced after the page title**, but should **not receive focus.**

---
