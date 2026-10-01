# Deploying Giglist

Run `npm run build`. npm runs `postbuild` automatically, copying the stats
endpoints from the repository root into the production output:

```text
build/
  index.html
  service-worker.js
  static/
  gigstatssimple.php
  gigstatsfeed.php
```

Deploy the **contents of `build/`** to the website's PHP-enabled document root
(`$HOME/public_html/giglist-react/` for this site), preserving the directory structure. This updates the
React app and both stats endpoints together. Do not deploy the repository root.
Do not delete existing server files that are not part of the build: the site
also relies on feeds, WordPress uploads, and server configuration.

The PHP endpoints require the existing server database access and PHP mysqli
extension. They must execute as PHP on the host; a static-only host cannot run
them. Keep the production build off static-only public preview hosts, which can
serve PHP source instead of executing it.

Edit the original PHP files in the repository root, not the generated copies in
`build/`. Keep them out of React's `public/` folder: the local React server serves
files there verbatim and does not execute PHP. Local React pages continue to
fetch the live stats endpoints.

This repository tracks its production build, so the usual build/commit/push
workflow includes the PHP copies. A GitHub push alone does not upload anything
to the web host unless a separate deployment job is configured. The host must
publish the complete updated `build/`, including `index.html`, JavaScript, CSS,
the service worker, and PHP files.

After deployment, open `/gigstats`, verify both endpoints return JSON, and
confirm the page loads the JavaScript filename in `build/asset-manifest.json`.

## cPanel Git deployment

The checked-in `.cpanel.yml` runs `scripts/deploy-cpanel.sh`, targeting
`$HOME/public_html/giglist-react`. Here `$HOME` is the cPanel account's home
directory, not the local development machine. The destination must already
exist. The script copies only `build/` and does not remove unrelated files.
`gigtools/` is explicitly excluded from deployment, even if it accidentally
appears in a future build. That PHP application keeps its separate workflow.

After the normal local build, commit and GitHub push:

1. In cPanel, open **Git Version Control → Manage → Pull or Deploy**.
2. Click **Update from Remote** to fetch the latest `main` from GitHub.
3. Click **Deploy HEAD Commit** to publish the app and PHP endpoints together.

No separate PHP upload is needed. GitHub pushes do not automatically trigger
this pull-based cPanel deployment. Pushing directly to a cPanel-managed Git
remote can trigger automatic deployment if that remote is configured later.

Reference: [cPanel deployment setup](https://docs.cpanel.net/knowledge-base/web-services/guide-to-git-set-up-deployment/).
