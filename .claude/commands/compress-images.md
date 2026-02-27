Compress image assets to optimize load performance and reduce bundle size.

## Prerequisite

```bash
npm install -g sharp-cli
```

## Usage

```bash
# Compress entire src/assets/ (JPEG 80, PNG 85 — default)
node .windsurf/skills/compress-images/compress-images.mjs

# Specific directory
node .windsurf/skills/compress-images/compress-images.mjs "src/assets/foo" "src/assets-compressed"

# Custom quality
node .windsurf/skills/compress-images/compress-images.mjs "src/assets" "src/assets-compressed" 90 95
```

Args: `[inputDir] [outputDir] [jpegQuality 0-100] [pngQuality 0-100]`

## Quality reference

| Setting | JPEG | PNG | Use case |
| ------- | ---- | --- | -------- |
| Default | 80   | 85  | General UI images |
| High    | 85   | 90  | Brand / hero images |
| Max     | 90   | 95  | Logos, critical visuals |

## After compression

1. Visually verify output quality
2. Replace originals:

```bash
mv src/assets-compressed/* src/assets/
rm -rf src/assets-compressed
git add src/assets
git commit -m "chore: compress images to optimize performance"
```

> Tip: Use `git checkout HEAD -- src/assets/` to restore originals if needed.
