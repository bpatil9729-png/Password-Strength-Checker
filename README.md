# Password Strength Checker

A responsive beginner-friendly web project built with HTML, CSS and vanilla JavaScript.

## Features
- Real-time password length and complexity checks
- Common/predictable pattern detection
- Strength score and actionable recommendations
- Strong random password generator using the browser Web Crypto API
- Copy generated password and analyze it
- Responsive dark dashboard UI

## How to run
1. Extract `Password_Strength_Checker.zip`.
2. Open the `password_strength_checker` folder.
3. Double-click `index.html` to open it in a modern browser.
4. Type a sample password or click **Generate password**.

No installation or server is required. Internet is only used for the optional Google Fonts import; the project works without it using fallback fonts.

## Project structure
- `index.html` — page structure
- `style.css` — layout and visual styling
- `script.js` — password analysis and generator logic

## Security and limitations
- Password analysis happens locally in your browser; this project does not send passwords to a server or save them.
- The score is an educational heuristic, not a formal security guarantee or a substitute for a breach-password screening service.
- The optional old-password-reuse feature is not implemented because a safe implementation requires a backend, authenticated users, and careful handling of password hashes. Never store plaintext passwords. For real applications, use a trusted authentication framework and a secure server-side password-hashing algorithm such as Argon2id, scrypt, or bcrypt with appropriate parameters.
- Do not use a password entered into a classroom demo for a real account.

## Concepts demonstrated
- Character classes and regular expressions
- Password entropy intuition and length
- Randomness through `crypto.getRandomValues()`
- Client-side validation and user feedback
