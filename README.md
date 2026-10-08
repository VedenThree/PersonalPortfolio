# Personal Portfolio — SYS / 01

Personal portfolio website for a Junior Web & Mobile App Developer, built to showcase projects, technical skills, professional background, and contact information.

The website is designed with a custom technical/HUD-inspired interface and is available in both Italian and English.

## Features

* Personal profile and introduction
* Selected projects
* Technical skills
* Contact form
* Italian and English versions
* Responsive design
* Custom UI and animations
* Dark technical/HUD-inspired visual style
* Reduced-motion support

## Tech Stack

* **Next.js 16**
* **React 19**
* **TypeScript**
* **Tailwind CSS v4**
* **Anime.js v4**
* **shadcn/ui**
* **Next.js App Router**

### Fonts

* Archivo
* IBM Plex Sans
* IBM Plex Mono
* JetBrains Mono

## Project Structure

```text
PersonalPortfolio/
├── app/
│   ├── en/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── animations/
│   ├── layouts/
│   ├── sections/
│   └── ui/
├── lib/
│   ├── i18n.ts
│   ├── projects-data.ts
│   ├── skill-icons.ts
│   └── utils.ts
├── public/
├── next.config.ts
└── package.json
```

## Internationalization

The portfolio supports two languages:

| Language | Path   |
| -------- | ------ |
| Italian  | `/`    |
| English  | `/en/` |

Translations are managed through a typed dictionary in `lib/i18n.ts`.

## Static Export

The project uses Next.js static export:

```ts
output: "export"
```

The production build generates a static `out/` directory, allowing the website to be hosted on services such as GitHub Pages.

The project is configured with a `basePath` for GitHub Pages deployment.

## Getting Started

### Requirements

* Node.js
* npm

### Installation

```bash
git clone https://github.com/VedenThree/PersonalPortfolio.git
cd PersonalPortfolio
npm install
```

### Development

```bash
npm run dev
http://localhost:3000
```

### Production Build

```bash
npm run build
```

The static website will be generated inside the `out/` directory.

## Available Scripts

| Command             | Description                     |
| ------------------- | ------------------------------- |
| `npm run dev`       | Start development server        |
| `npm run build`     | Create production static export |
| `npm run lint`      | Run ESLint                      |
| `npm run typecheck` | Run TypeScript checks           |

## Deployment

The project is configured for GitHub Pages using Next.js static export.

Expected deployment:

[PersonalPortfolio on GitHub Pages](https://vedenthree.github.io/PersonalPortfolio)

## Author

**Fabio Gentile**

Junior Web & Mobile App Developer
Italy

[GitHub Profile](https://github.com/VedenThree)

## License

See the [LICENSE](./LICENSE) file for usage and redistribution terms.
