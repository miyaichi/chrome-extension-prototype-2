# chrome-extension-prototype-2
Prototype of a chrome extension using side panel.

# Directory Structure

```
├── dist/                        # Compiled files (git ignored)
├── node_modules/                # Node modules (git ignored)
├── public/
│   └── sidepanel.html
├── src/
│   ├── background.ts
│   ├── components/
│   │   ├── DOMSelector.css
│   │   ├── DOMSelector.tsx
│   │   ├── SettingPanel.css
│   │   ├── SettingPanel.tsx
│   │   ├── TagInjection.css
│   │   └── TagInjection.tsx
│   ├── contentScript.ts
│   ├── lib/
│   │   └── connectionManager.ts
│   ├── sidepanel/
│   │   ├── App.css
│   │   ├── App.tsx
│   │   └── index.tsx
│   └── styles/
│       └── common.css
├── manifest.json
├── package-lock.json
├── package.json
├── postcss.config.js
├── tsconfig.json
└── webpack.config.js
```