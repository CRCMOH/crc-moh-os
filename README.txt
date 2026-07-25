CRC MOH OS — V1 Mobile App Final

Run locally with Live Server or deploy the folder root to GitHub Pages.

Final cleanup in this build:
- No demo buttons and no demo seed users.
- Sign-up does not auto-create an account unless the form is submitted.
- Sign-in persists the session so users stay signed in.
- Leadership PIN is required for Group Leader and above.
- Leadership page has an on-screen PIN gate.
- Mobile landing uses one image so it feels cleaner on phones.
- Mobile responsive layer added: responsive-app.css.
- PWA install helpers included: manifest.json, sw.js, pwa.js.

Leadership PINs for V1 testing before database:
Pastor: 7777
Ministry Leader: 6666
Service Leader: 5555
Area Leader: 4444
Group Leader: 3333

Phone notifications:
This build can request browser notification permission and display local app notifications. True background push notifications like WhatsApp/SMS require a backend push service and user subscriptions when you connect the database/backend.
