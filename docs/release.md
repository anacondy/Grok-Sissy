# Grok-Sissy Releases

## v1.0.0 (current)
- Initial Grok Scanner UI for uploading visual artifacts and previewing analysis results.
- Responsive layout tuned for mobile and desktop with animated background.
- GitHub Pages deployment via Actions (dist output from Vite).
- Environment-based API key detection (`VITE_XAI_API_KEY`) with user-facing diagnostics.

### Deployment
The site is deployed from the `dist/` build artifact through the `Deploy to GitHub Pages` workflow. Ensure the `VITE_XAI_API_KEY` secret is configured in repository settings for live scans.
