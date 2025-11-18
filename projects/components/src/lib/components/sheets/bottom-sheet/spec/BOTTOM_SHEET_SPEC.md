# Bottom Sheet

## Overview

Bottom sheets display supplementary content in **compact** and **medium** window sizes.
They present **additional or secondary** information, not the app’s main content.
Bottom sheets can be **dismissed** to allow interaction with the primary content.

**Types:**

* **Standard bottom sheet:** Displays content without blocking the main screen; for example, an audio player at the bottom of a music app.
* **Modal bottom sheet:** Appears in front of app content with a **scrim**, disabling all other app functionality until it is confirmed, dismissed, or a required action is completed.

Both types share the same specifications, except for the scrim.

---

## Structure

* **Container:** Holds the bottom sheet’s content.
* **Drag handle (optional):** Allows resizing or toggling between sheet heights.
* **Scrim:** Present only in modal bottom sheets to block background interaction.

---

## Accessibility

Users should be able to:

* Resize bottom sheets without relying on touch gestures.

**Touch target area:**

* The top **48dp** portion of the bottom sheet is interactive when resizing is available and the drag handle is visible.

**Initial focus:**

* The **drag handle**, if present, can be focused in the tab order and interacted with using **keyboard** or **switch controls.**

**Dragging:**

* Provide a **single-pointer alternative** for drag actions.
* Selecting the **drag handle** should cycle through available sheet heights.
* If a drag handle cannot be used, include a **button** that performs the same action.

**Keyboard navigation:**

| Key               | Action                            |
|-------------------|-----------------------------------|
| **Tab**           | Focus lands on drag handle        |
| **Space / Enter** | Toggles between available heights |

**Labeling:**

* Label only the **drag handle.**
* The accessibility **role** for the drag handle is **“button.”**

---
