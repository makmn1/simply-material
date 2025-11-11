# Dialog

## Overview

Dialogs require users to act on presented information.
They are dedicated to completing a **single task** and can also display **supporting information** relevant to that task.
Dialogs are commonly used to confirm **high-risk actions**, such as deleting progress.

**Types:**

* **Basic dialog**
* **Full-screen dialog**

---

## Structure

### Basic Dialog Anatomy

* **Container**
* **Icon (optional)**
* **Headline (optional)**
* **Supporting text**
* **Divider (optional)**
* **Button label text**
* **Scrim**

### Full-Screen Dialog Anatomy

* **Container**
* **Header**
* **Icon (close affordance)**
* **Headline (optional)**
* **Text button**
* **Divider (optional)**

---

## Accessibility

People using assistive technology should be able to:

* Open and close a dialog.
* Provide and submit input if the dialog is interactive (for example, with a text field or selectable list).
* Scroll through dialog content when it extends beyond the container.

**Initial focus:**

* When a dialog appears, focus automatically lands on the **first interactive element** within the dialog.

**Keyboard navigation:**

| Key               | Action                                                                                               |
|-------------------|------------------------------------------------------------------------------------------------------|
| **Tab**           | Moves focus to the next interactive element in the dialog, or cycles back to the first if at the end |
| **Shift + Tab**   | Moves focus to the previous interactive element, or cycles to the last if at the beginning           |
| **Space / Enter** | Triggers or commits the action of the focused element                                                |
| **Escape**        | Closes the dialog                                                                                    |

**Labeling elements:**

* The accessibility label for a dialog is typically the same as its **title or headline.**
* On web, **basic dialogs** should have the **“alertdialog” role.**

---
