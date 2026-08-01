# Publish Atlas Forge with GitHub Pages

## Fastest method
1. Create a new public GitHub repository, for example `atlas-forge-website`.
2. Upload every file and folder from this package to the repository root.
3. Commit the files to the `main` branch.
4. In GitHub, open **Settings → Pages**.
5. Under **Build and deployment → Source**, choose **GitHub Actions**.
6. Open the **Actions** tab and wait for the Pages workflow to finish.
7. Your site URL will appear in the completed deployment and in **Settings → Pages**.

## Local preview
Double-click `index.html`, or run a simple local server:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Custom domain later
Add the domain in **Settings → Pages → Custom domain**. GitHub will provide the DNS records to enter at your domain registrar.
