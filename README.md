# Mihir Bhatt — Portfolio

A responsive personal portfolio built with React and Vite. The repositories section loads public, non-fork repositories for [`mihirhbhatt`](https://github.com/mihirhbhatt) from GitHub's public REST API.

## Features

- Original dark engineering-inspired design
- Responsive navigation and layout
- Persistent dark and light themes
- Live public GitHub repository list
- Repository search and programming-language filter
- Loading, error, and empty states
- "Ask Agent" portfolio assistant with suggested questions and no external AI service
- GitHub Pages deployment with GitHub Actions
- Accessible labels and reduced-motion support

## Requirements

- Node.js 22 LTS recommended
- npm
- Git

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

Create a production build and preview it:

```bash
npm run build
npm run preview
```

## Publish to GitHub Pages

1. Create a **public** repository named exactly `mihirhbhatt.github.io` under the `mihirhbhatt` GitHub account.
2. Copy these project files into that repository.
3. Commit and push to the `main` branch:

   ```bash
   git init
   git add .
   git commit -m "Build personal portfolio"
   git branch -M main
   git remote add origin https://github.com/mihirhbhatt/mihirhbhatt.github.io.git
   git push -u origin main
   ```

   If the repository already has Git history, do not run `git init`; add the remote if needed and push your commit.

4. On GitHub, open **Settings → Pages** and set **Build and deployment → Source** to **GitHub Actions**.
5. Open the **Actions** tab and watch **Deploy portfolio to GitHub Pages** complete.
6. The expected website URL is `https://mihirhbhatt.github.io/`.

This is a user-site repository, so `vite.config.js` uses `base: '/'`. If you instead publish under a project repository URL such as `https://mihirhbhatt.github.io/portfolio/`, update `base` to `'/portfolio/'`.

## Customize before publishing

- **Bio and skills:** Update the About section and `skills` array in `src/App.jsx` to keep the profile current.
- **Featured projects:** Edit the `featuredAreas` array in `src/App.jsx`; the current cards link to public repositories on the `mihirhbhatt` GitHub profile.
- **Repository list:** `USERNAME` is `mihirhbhatt`. Public repositories are requested directly from GitHub; no access token is needed for this endpoint. GitHub can rate-limit unauthenticated requests, so the page includes an error state and a direct profile link.
- **Ask Agent:** The chat widget answers common questions from the portfolio content using local rules in `src/App.jsx`; it does not send visitor questions to an AI service.
- **Contact:** The portfolio links to the `mihirhbhatt` GitHub profile. Update the contact section if you add a public email or another preferred contact method.
- **Résumé:** If you add a résumé, place the PDF in `public/` and add a link to `/resume.pdf`. Only publish details you are comfortable making public.

## Project structure

```text
mihirbhatt-portfolio/
├── .github/workflows/deploy.yml
├── public/
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## GitHub API

The project uses `GET https://api.github.com/users/mihirhbhatt/repos?type=owner&sort=updated&direction=desc&per_page=100`. Public repository listing is documented in the [GitHub REST API docs](https://docs.github.com/en/rest/repos/repos). The website filters out forks, archived repositories, and disabled repositories; repository data is not hardcoded.
