# Search

## Overview

Search bars and views are used for navigating a product through search queries.
Search bars can display **suggested keywords or phrases** as the user types, and results should always be shown in a **search view.**

Search bars can include a **leading Search icon** and an **optional trailing icon.**

---

## Structure

### Search Bar

1. **Container**
2. **Leading icon button**
3. **Supporting text**
4. **Avatar or trailing icon (optional)**

**Search bar configurations:**

* With avatar
* With one trailing icon button
* With two trailing icon buttons
* With avatar and trailing icon button

---

### Search View

* **Container**
* **Header**
* **Leading icon button**
* **Supporting text**
* **Input text**
* **Trailing icon button**
* **Divider**

**Search view configurations:**

* **Full-screen search view**
* **Docked search view**

---

## Accessibility

People using assistive technology should be able to:

* Navigate to and activate a search bar.
* View the search hint or persistent label.
* Input text and complete a search.
* Interact with an expanded search view that presents suggestions.
* Interact with search results.
* Clear the search text.

**Autosuggest:**

* Screen readers should announce that the search bar is an **autocomplete field.**
* Screen readers should also announce when autocomplete results appear.
* On web, **arrow keys** should navigate to the first suggestion.

**Initial focus:**

* Focus lands on the **first interactive element**, usually the **leading icon button** or **text input field.**
* On desktop, **Tab** moves focus to other interactive elements such as trailing icons.

**Keyboard navigation:**

| Key                   | Action                                   |
|-----------------------|------------------------------------------|
| **Tab / Shift + Tab** | Navigate between interactive elements    |
| **Space / Enter**     | Activate the search text field for input |
| **Arrows**            | Navigate between search results          |

**Labeling elements:**

* The **placeholder** or **hinted text** serves as the **accessibility label** that describes the search bar.

---
