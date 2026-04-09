# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Static landing page for **КИНКЭ** (Союз общин КМНС Хабаровского края) — a Far East seafood supplier. Target domain: **kinke.ru**.

No build tools, no framework, no package manager. Pure HTML + CSS + JS.

## Development

Open `index.html` directly in a browser, or use VS Code **Live Server** extension for auto-reload on save.

## Architecture

Single-page site (`index.html`) with external stylesheet and script:

```
index.html          — all sections and markup
css/style.css       — all styles (design tokens → components → sections → responsive)
js/main.js          — clock, burger menu, scroll reveal, product tabs, smooth scroll
assets/images/      — product photos (hero-crab.png and others go here)
```

**CSS structure:** CSS custom properties at `:root` define the full design system (`--bg`, `--navy`, `--accent`, `--ff-serif`, `--ff-sans`, etc.). Sections follow the order they appear in the HTML.

**JS:** No libraries. Uses `IntersectionObserver` for `.reveal` scroll animations, `IntersectionObserver` is the only modern API used — no polyfills.

## Design system

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#F2EDE8` | Main background (cream) |
| `--bg-alt` | `#EAE4DC` | Alternate sections |
| `--navy` | `#1B3A5C` | Primary accent, buttons, headings |
| `--accent` | `#C8A96E` | Gold accent (bullets, decorative) |
| `--ff-serif` | Cormorant Garamond | All section titles, hero |
| `--ff-sans` | Inter | Body text, labels, buttons |

## Sections order

`header` → `hero` → `#about` → `#trust` → `.features` → `#products` → `.cooperation` → `#contact` → `footer`

## Planned (not yet built)

- Contact form with **EmailJS** (no backend) sending to `5047112@mail.ru`
- **Telegram Bot API** notification to a group channel on form submit
- Deploy to **kinke.ru** — security audit before deploy
