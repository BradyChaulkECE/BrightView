# BrightView
BrightView is a Chrome extension that analyzes and summarizes Brightspace (D2L) grade data locally in the browser to provide students with clearer performance insights.

Built using Chrome Manifest V3 and architected for cross-institution /d2l/ compatibility.

# Problem
Brightspace displays raw grade data but does not provide structured insight into:
- Required scores to reach target grades
- Overall standing clarity
- Aggregated performance interpretation

BrightView bridges that gap through client-side analysis without transmitting user data.

# Technical Architecture
- Manifest V3 extension
- Scoped host permissions targeting /d2l/ paths
- Modular DOM parsing logic for grade extraction
- Client-side computation (no backend)
- Chrome Web Store compliance considerations

# Scalability & Compliance
Expanding host permissions beyond a single institutional domain increased potential reach but also raised Chrome Web Store review scrutiny. The extension’s architecture was refined to balance portability, security, and platform policy constraints.

## Privacy
BrightView does not collect, transmit, or store personal data externally.  
All analysis is performed locally within the user's browser session.  
No external servers or analytics services are used.

## Disclaimer
BrightView is an independent, student-built project and is not affiliated with, endorsed by, or sponsored by D2L or Brightspace. The extension is read-only and only analyzes grade information already visible to the user.

## Author
Developed by **Brady Chaulk**, a Computer Engineering student focused on building practical, user-facing systems with attention to security, compliance, and architectural clarity.
