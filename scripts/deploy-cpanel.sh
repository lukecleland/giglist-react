#!/bin/bash
set -euo pipefail

repo_dir="$(cd "$(dirname "$0")/.." && pwd)"
deploy_dir="${1:?Pass the site document root}"

if [ ! -d "$deploy_dir" ]; then
    echo "Deployment directory does not exist: $deploy_dir" >&2
    exit 1
fi
for required_file in index.html gigstatssimple.php gigstatsfeed.php calendar.php gig-preview.php; do
    if [ ! -f "$repo_dir/build/$required_file" ]; then
        echo "Missing build/$required_file. Run npm run build and commit the output first." >&2
        exit 1
    fi
done

# Gigtools is a separately deployed PHP application. Never publish over it,
# even if a future React build accidentally contains a gigtools directory.
shopt -s dotglob nullglob
for build_entry in "$repo_dir/build/"*; do
    if [ "$(basename "$build_entry")" = "gigtools" ]; then
        echo "Skipping independently managed gigtools"
        continue
    fi
    /bin/cp -R "$build_entry" "$deploy_dir/"
done
echo "Deployed React build and PHP endpoints to $deploy_dir"

# Prepend the gig handler before existing SPA fallback rules; preserve host config.
htaccess_file="$deploy_dir/.htaccess"
if ! /usr/bin/grep -q '^# BEGIN Giglist gig previews$' "$htaccess_file" 2>/dev/null; then
    preview_rules=$(mktemp)
    cat > "$preview_rules" <<'RULES'
# BEGIN Giglist gig previews
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteRule ^gig-[^/]+/?$ gig-preview.php [END]
</IfModule>
# END Giglist gig previews
RULES
    if [ -f "$htaccess_file" ]; then cat "$htaccess_file" >> "$preview_rules"; fi
    /bin/cp "$preview_rules" "$htaccess_file"
    rm "$preview_rules"
fi
