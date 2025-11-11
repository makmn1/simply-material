# Material Design 3 (Expressive) — App Bar (Top App Bar)

> **Goal:** Clearly describe the current page and expose **1–2 essential actions**.
> 
> **Placement:** Pinned to the top of the viewport; spans the full window width.
> 
> **Scroll behavior:** Starts visually merged with the background; **fills** with a contrasting color on scroll to separate from body content. Can **hide/reveal** on scroll and **coexist/animate** with a secondary controls bar (e.g., chip row).

---

## 1) Variants (choose one)

1. **Search app bar** — Use on home pages where **search is primary**. Replaces headline with a search field.
2. **Small** — Use in **dense layouts** or when the page is scrolled.
3. **Medium flexible** — Emphasizes headline; **can collapse** to Small on scroll.
4. **Large flexible** — Strongest headline emphasis; **can collapse** to Small on scroll.

> **Deprecated:** “Medium” and “Large” (non-flexible). Replace with the corresponding **flexible** variants.

---

## 2) Anatomy (slots / parts)

* **Container** (structural host; full-width; default height only; straight corners)
* **Leading button** (Menu or Back; page navigation)
* **Headline** (page/section/product label)
* **Subtitle** (optional; adds context; changes container height for flexible variants)
* **Trailing elements** (up to **two** icon buttons; consider a single **filled/tonal** button for the primary action)
* **Search container** *(Search variant only)* with:

  * Leading icon button
  * **Hinted search text** (must include the word “Search”)
  * Optional trailing icon(s) and/or avatar

**Allowed customizations**

* **Image/logo** — Small app bars may **replace label text** entirely. Other variants can place image **above** text.
* **Filled trailing icon** — Replace the trailing group with **one** primary or tonal **filled** icon button (default or wide).

**Avoid**

* Custom heading/subtitle sizes
* Too many actions; **never** multiple filled/tonal buttons

---

## 3) Content & Actions

* Prefer **one** action; **two if necessary**.
* The **primary action** should affect the whole page (e.g., **Send**, **Save**, **Edit**).
* If you have many actions, move them to a **toolbar** below—avoid overflow menus in the app bar itself.
* Order trailing actions **most-used → least-used** (left → right in LTR).

---

## 4) Search App Bar specifics

**Placeholder text (must include Search)**

* “Search”
* “Search inbox”
* “Search Photos”

**Buttons**

* Mobile: up to **two** trailing icons **plus** an avatar (icons **inside or outside** the search field).
* **Don’t** use three icons + avatar.
* Large screens: up to **four** trailing icons.

**Branding**

* The **leading element** may be a **product logo** (cosmetic or actionable).
  Don’t use the logo to open expanded navigation.

**Color**

* Default search container: **surface-container**. On darker backgrounds, use **surface-bright** to maintain ≥ **3:1** contrast between text and container.

**Behavior**

* Focusing/selecting the search bar **opens the Search View** component.

---

## 5) Adaptive & Responsive

* **Width:** Container always spans **100%** window width.
* **Trailing actions** may **collapse** to overflow on smaller widths; reappear when space allows.
* **Search field sizing:**
  Fill **100%** of the space between leading & trailing until **312dp**; after that, grow only to **50%** of that space.
* **RTL:** Layout mirrors automatically (leading/trailing swap).

---

## 6) Scroll & Transform Behavior

* On scroll, **apply a fill** (contrasting with body) to the container; optionally add **elevation**.
* Option A: Keep container visible.
* Option B: **Transparent container on scroll** + convert actions to **filled** icon buttons to preserve legibility (narrow-width icon buttons recommended for compactness).
* **Flexible variants (Medium/Large):** On scroll down, **compress** to **Small** and **stay Small** until scrolled back to top. **Never** morph into the Search variant.
* **Hide/Reveal:** May hide on scroll up; reveal on scroll down.
* Works alongside a **secondary control bar** (e.g., chip row); both may animate on/off screen.

---

## 7) Accessibility

**Outcomes**

* Users can identify **where they are**, **act**, and **reach actions** even when content scrolls.

**Focus**

* Initial focus lands on the **leading button**.
* **Keyboard:**

  * `Tab` → next interactive element
  * `Shift+Tab` → previous
  * `Space` / `Enter` → activate
* **Focus visible** with a focus indicator.
* **Labels**

  * The app bar’s title **accessible name** matches its visible text; add contextual suffix if needed (e.g., “— Settings”).
  * Screen readers announce UI text + role.

**Interaction feedback**

* **Hover** → hover state
* **Press/Click** → ripple / state layer

---

## 8) Theming: Token guidance

Refer to `APP_BAR_TOKENS.md` for token info.

## 9) Motion (Expressive)

* **Slide in/out** with the **default spatial spring**; pair with the secondary controls bar for synchronized entrance/exit.
* **Compress** (flexible→small) using a **slow spatial spring** for height/typography transitions.
* **Icon button** state transitions may use **fast effects** springs.
* Respect user **reduced motion** preferences (disable large translations/elasticity).

---

## 10) Do / Don’t

**Do**

* Use **one** high-visibility action (filled/tonal) if needed.
* Keep content **page-specific**; put global overflow in a toolbar.
* Let the container **fill** on scroll and **compress** flexible bars.

**Don’t**

* Add multiple filled/tonal buttons.
* Shorten the app bar below its default height or curve its container corners.
* Morph any variant into a **Search** bar on scroll.

---
