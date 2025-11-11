# Side Sheet

## Overview

Side sheets provide **optional content and actions** without interrupting the main content.
They can contain navigation elements such as a **back icon** that allow users to move between regions within the sheet.

**Types:**

* **Standard side sheet:**
  Displays content without blocking access to the screen’s main content, such as an audio player on the side of a music app.
  Commonly used in **medium** and **expanded** window sizes (tablet or desktop).
* **Modal side sheet:**
  Appears in front of app content, **disabling all other app functionality** until confirmed, dismissed, or a required action is completed.
  Commonly used in **compact** window sizes (mobile).

---

## Structure

### Standard Side Sheet

* **Divider (optional)**
* **Headline**
* **Container**
* **Close affordance**

### Modal Side Sheet

* **Back icon button (optional)**
* **Header**
* **Container**
* **Close icon button**
* **Divider (optional)**
* **Action (optional)**
* **Scrim**

---

## Accessibility

People using assistive technology should be able to:

* **Dismiss** the side sheet.

**Interaction and style:**

* A **close icon** must always be present within a side sheet.

**Initial focus:**

* Actions within the side sheet can be focused using **Tab order** via **keyboard** or **switch control.**

**Keyboard navigation:**

| Key               | Action                                    |
|-------------------|-------------------------------------------|
| **Tab**           | Focus lands on a non-disabled icon button |
| **Space / Enter** | Activates the focused icon button         |

**Labeling:**

* The accessibility **role** for a side sheet is **“Dialog.”**

---
