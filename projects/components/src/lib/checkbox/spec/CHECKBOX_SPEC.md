# Checkbox

## Overview

Checkboxes allow users to select multiple options from a list.
They should be used instead of switches or radio buttons when more than one selection can be made.

The checkbox label should be **scannable**, and selected items should appear **more prominent** than unselected items.

---

## Structure

* **Container:** Holds the checkbox and its label.
* **Checkbox:** Displays one of three possible states.
* **Label:** Text associated with the checkbox that describes its option.

---

## Behavior

* **States:**

  * **Selected**
  * **Unselected**
  * **Indeterminate**

Checkboxes can be selected or unselected independently of others in a group.
If some, but not all, child checkboxes are selected, the **parent checkbox** becomes **indeterminate**.
Selecting an indeterminate parent checkbox will check all its child checkboxes.

Users should be able to select an option by interacting with either the **text label** or the **checkbox** itself.

---

## Accessibility

People using assistive technology should be able to:

* Navigate to a checkbox.
* Toggle the checkbox on and off.
* Receive appropriate feedback based on the type of input used.

**Labeling elements:**

* When the UI text is correctly linked to the checkbox, assistive technology (such as a screen reader) will read the **UI text** followed by the component’s **role**.
* The accessibility label for an individual checkbox is typically the same as its **adjacent text label.**

---
