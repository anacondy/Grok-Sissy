# Grok-Sissy Wiki (Snapshot)

This page mirrors the key usage details so they are available alongside the source.

## Getting Started
1. Install dependencies: `npm install`
2. Run locally: `npm run dev`
3. Build for production: `npm run build`

## API Key Setup
- Create an `VITE_XAI_API_KEY` secret in GitHub and map it in the deploy workflow environment.
- For local testing, create a `.env` file with `VITE_XAI_API_KEY=<your key>`.

## Deployment
- The GitHub Actions workflow `.github/workflows/deploy.yml` builds the Vite app and publishes `dist/` to GitHub Pages.
- Verify the deployment badge/status in the Actions tab after each push to `main`.

## Support
If scans fail, check the browser console for network errors, confirm the API key, and rerun the build.
