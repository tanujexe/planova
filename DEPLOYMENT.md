# Planova — Deployment Guide

This guide provides step-by-step instructions for deploying the **Planova AI Architectural Copilot** across leading production hosting platforms and containers.

---

## ⚡ Quick Deployment Summary

| Platform | Build Command | Publish / Output Directory | Routing / Rewrite Config |
| :--- | :--- | :--- | :--- |
| **Vercel** | `npm run build` | `dist` | Automated via `vercel.json` |
| **Netlify** | `npm run build` | `dist` | Automated via `netlify.toml` & `public/_redirects` |
| **Cloudflare Pages** | `npm run build` | `dist` | Automated via `_redirects` & `404.html` |
| **GitHub Pages** | `npm run build` | `dist` | Automated via `404.html` SPA fallback |
| **Docker / Nginx** | `docker compose up --build` | Port `80` (or `8080`) | Automated via `nginx.conf` & multi-stage `Dockerfile` |
| **Render / Railway** | `npm run build` (Static) or Docker | `dist` | Set SPA rewrite rule to `/index.html` |

---

## 1. Deploying to Vercel (Recommended)

Planova includes a pre-configured `vercel.json` with SPA route rewrites, immutable caching for `/assets/`, and standard web security headers.

### Option A: Using the Vercel Dashboard
1. Push your repository to GitHub or GitLab.
2. Go to [vercel.com/new](https://vercel.com/new) and import your repository.
3. Vercel automatically detects Vite:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **Deploy**.

### Option B: Using the Vercel CLI
```bash
# Install Vercel CLI globally (if not already installed)
npm install -g vercel

# Deploy preview
vercel

# Deploy to production
vercel --prod
```

---

## 2. Deploying to Netlify

Planova includes both `netlify.toml` and `public/_redirects` to guarantee seamless client-side SPA routing (`/projects/...` deep links).

### Option A: Netlify Dashboard / Git
1. Go to [app.netlify.com](https://app.netlify.com) and click **Add new site** > **Import an existing project**.
2. Connect your Git repository.
3. Netlify will read `netlify.toml` automatically:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. Click **Deploy site**.

### Option B: Using the Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login and build
npm run build

# Deploy
ntl deploy --prod --dir=dist
```

---

## 3. Deploying with Docker & Docker Compose

Planova includes a lightweight, hardened, multi-stage `Dockerfile` and custom `nginx.conf`:
- **Stage 1 (Builder)**: Runs tests and builds production assets using `node:20-alpine`.
- **Stage 2 (Runner)**: Serves static assets with `nginx:1.27-alpine` with gzip compression, caching, and healthcheck at `/healthz`.

### Build & Run Locally
```bash
# Build the production Docker image and start the container
docker compose up -d --build

# View container logs
docker compose logs -f

# Access the application
# Visit http://localhost:8080 in your browser
```

### Run Standalone Docker
```bash
# Build image
docker build -t planova:latest .

# Run container on port 80
docker run -d -p 80:80 --name planova-app planova:latest
```

### Deploy to Cloud Run / AWS ECS / DigitalOcean / Render
Push the Docker image to your container registry (Docker Hub, AWS ECR, GCP Artifact Registry) and deploy the container service exposing port `80`.

---

## 4. Deploying to Cloudflare Pages

1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/) and go to **Workers & Pages** > **Create application** > **Pages**.
2. Connect your Git repository.
3. Build Settings:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. Click **Save and Deploy**. (The bundled `dist/_redirects` and `dist/404.html` will handle routing automatically).

---

## 5. Deploying to GitHub Pages

1. In GitHub, go to your repository **Settings** > **Pages**.
2. Under **Build and deployment** > **Source**, choose **GitHub Actions**.
3. Push to `main`. The postbuild script generates `dist/404.html` ensuring deep-links load correctly on GitHub Pages static CDN.

---

## 🛠️ Build & Verification Scripts

| Command | Purpose |
| :--- | :--- |
| `npm run dev` | Starts local development server on `http://localhost:5173` |
| `npm test` | Runs the Node test suite (geometry, constraints, finance, Vastu) |
| `npm run build` | Compiles production assets and generates static SPA fallback |
| `npm run preview` | Runs local production preview server on `http://localhost:4173` |

---

## 🔒 Security & Performance Features Included

- **Route-level Code Splitting**: Routes are loaded asynchronously on-demand using `React.lazy` and `Suspense`, reducing initial bundle size to under 100 kB.
- **Rollup Vendor Chunking**: Heavy libraries (`Three.js`, `Konva`, `jsPDF`, `Lucide`) are separated into standalone cacheable vendor chunks.
- **Security Headers**: Standard `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, and `Referrer-Policy: strict-origin-when-cross-origin` configured in `vercel.json`, `netlify.toml`, and `nginx.conf`.
- **Cache Optimization**: Hashed `/assets/*` are set to `max-age=31536000, immutable`, while `index.html` is set to `must-revalidate` to avoid stale deployments.
- **Automated CI/CD**: `.github/workflows/ci.yml` runs tests and checks build output integrity on every pull request and push to main.
