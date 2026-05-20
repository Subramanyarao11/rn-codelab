# RN Debug Labs

A browser-based React Native bug-fixing challenge platform, inspired by [Chai reactLabs](https://react.chaicode.com). Read the bug report, fix the code in Monaco, preview it live, and pass automated tests — no native toolchain required.

## Quick start

```bash
npm install --legacy-peer-deps
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the challenge grid, or jump to a problem at `/problems/1`.

**Desktop only** — the workspace layout requires a viewport width of at least 1024px.

## Features

- **10 RN debugging challenges** — FlatList, TextInput, flexbox, ScrollView, AsyncStorage, Navigation, KeyboardAvoidingView, pointer events, `useCallback`, Context API
- **Monaco editor** — syntax highlighting, RN snippets, multiple themes, font size / wrap / minimap, autosaved drafts
- **Live preview** — runs your code in-browser via `react-native-web` (updates as you type)
- **Expo Snack** — optional link to open the current code in [Expo Snack](https://snack.expo.dev) in a new tab
- **Automated tests** — headless `react-native-web` + Testing Library checks via `testID`
- **Progress tracking** — completion and editor preferences persisted in `localStorage`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server with **Turbopack** (fast HMR) |
| `npm run dev:webpack` | Dev server with Webpack (fallback if Turbopack has issues) |
| `npm run dev:clean` | Clear `.next` cache and start Turbopack dev |
| `npm run build` | Production build (Webpack) |
| `npm run fresh` | Full reinstall (`node_modules` + `.next`) then dev |

## Stack

- **Next.js 16** (App Router) + **React 19**, TypeScript, Tailwind CSS
- Zustand 5 + `localStorage` for progress and editor settings
- `@monaco-editor/react` + `monaco-editor`
- `@babel/standalone` for JSX in the preview/test runner
- `react-native-web` for preview and tests
- `react-resizable-panels` for the 4-panel workspace layout

## Project layout

```
app/                 # Routes (home + /problems/[id])
components/          # Workspace UI (editor, preview, tests, layout)
lib/problems.ts      # Challenge definitions, starter code, solutions, tests
lib/                 # Store, eval sandbox, Monaco setup, themes
hooks/               # Client hooks (e.g. store hydration)
```

## License

Private / internal use — see repository owner for terms.
