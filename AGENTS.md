# WellnessConnect Architectural Guidelines

This file captures core architectural principles and technical guardrails for the WellnessConnect project to ensure smooth transitions from MVP to production.

## 1. Environment Policy: PWA-First, Mobile-Optimized
- **Focus**: Deliver a high-quality "Add to Home Screen" (PWA) experience for rapid MVP validation.
- **Viewport**: Design strictly for a **375px wide** (iPhone size) mobile viewport.
- **Interactions**: Use touch-friendly targets (min 44px), swipe gestures (framer-motion), and bottom sheets for depth.

## 2. Technical Guardrail: Capacitor-Ready Code
The codebase should be built to transition seamlessly to a native shell (Capacitor) in the future.
- **Component-Based**: Logic and styling should live inside React components.
- **Avoid Web Traps**: Do not use browser-only APIs that don't have a native equivalent without abstracting them.
- **Styling**: Stick to **standard Tailwind CSS utility classes**. Avoid custom CSS files or complex web-only layout engines.
- **Animations**: Prefer `framer-motion` (motion/react) for consistent interaction states.
- **Navigation**: Keep the navigation logic strictly inside the React app (Client-side routing/state) rather than relying on browser history APIs directly.

## 3. Feature Limitations (PWA Stage)
- **Push Notifications (FCM)**: Acknowledge that iOS Safari support is limited and requires home-screen installation. Design fallback UI (e.g., in-app alert badges) for critical triggers.
- **Wearable Sync**: Postpone native HealthKit/Google Fit integration until the Capacitor transition.
- **Background Sync**: Operations must happen in the foreground during MVP.

## 4. UI/UX Continuity
- **OTP-First**: Minimize friction with phone/OTP logins.
- **Progressive Disclosure**: Break complex forms (like Health Profile) into manageable, multi-input, non-mandatory steps where possible.
- **Human Touch**: Include reassurance banners about the "Assessment Team" to lower the barrier for data entry.
