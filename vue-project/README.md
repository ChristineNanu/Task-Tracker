# My Tasks

A small task app made with Vue 3, Vue Router, and Vite. It has a Tasks page and an About page.

## Run the app

In a terminal, open this folder and run:

```sh
npm install
npm run dev
```

Open the local address printed by Vite. The app starts in `src/main.ts`. The routes are in `src/router.ts`, the shared navigation is in `src/App.vue`, and the pages are in `src/views/`.

## Where things live

- `src/main.ts` starts Vue and connects the router.
- `src/App.vue` is the shared layout used around every page.
- `src/router.ts` maps URLs to pages.
- `src/views/` contains full pages, such as Tasks and About.
- `src/components/` contains smaller reusable pieces, such as the header, task form, and task row.
- `src/assets/main.css` contains the app's styles.
