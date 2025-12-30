#!/usr/bin/env bun
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const INDEX_CSS_PATH = join(import.meta.dir, '..', 'src', 'index.css');
const PLACEHOLDER_FONT_IMPORT = '@import url("https://fonts.googleapis.com/css2?family=Geist+Mono:wght@200;700&display=swap");';

interface FontInfo {
  name: string;
  googleFontName: string;
}

function extractActiveTheme(indexCssContent: string): string | null {
  const themeImportMatch = indexCssContent.match(/@import\s+['"](.\/themes\/[^'"]+)['"]/);
  return themeImportMatch ? themeImportMatch[1] : null;
}

function extractFontsFromTheme(themeContent: string): FontInfo[] {
  const fontVariables = ['--font-sans', '--font-serif', '--font-mono'];
  const fonts = new Set<string>();

  for (const variable of fontVariables) {
    const regex = new RegExp(`${variable}:\\s*([^;]+);`);
    const match = themeContent.match(regex);

    if (match) {
      const fontStack = match[1].trim();
      const firstFont = fontStack.split(',')[0].trim();

      // Check if it's a Google Font (starts with capital letter)
      if (/^[A-Z]/.test(firstFont)) {
        fonts.add(firstFont);
      }
    }
  }

  return Array.from(fonts).map(font => ({
    name: font,
    googleFontName: font.replace(/\s+/g, '+')
  }));
}

function generateGoogleFontsUrl(fonts: FontInfo[]): string | null {
  if (fonts.length === 0) return null;

  const fontParams = fonts.map(font =>
    `family=${font.googleFontName}:wght@400;700`
  ).join('&');

  return `@import url("https://fonts.googleapis.com/css2?${fontParams}&display=swap");`;
}

function updateIndexCss(content: string, newImport: string | null): string {
  const markerStart = '/* theme-fonts-start */';
  const markerEnd = '/* theme-fonts-end */';

  // Check if markers exist
  const markerRegex = /\/\*\s*theme-fonts-start\s*\*\/[\s\S]*?\/\*\s*theme-fonts-end\s*\*\//;
  const hasMarkers = markerRegex.test(content);

  if (hasMarkers) {
    // Replace content between markers
    const replacement = newImport
      ? `${markerStart}\n${newImport}\n${markerEnd}`
      : `${markerStart}\n/* ${PLACEHOLDER_FONT_IMPORT} */\n${markerEnd}`;

    return content.replace(markerRegex, replacement);
  } else {
    // Fallback: remove old imports and add markers
    const withoutOldImport = content.replace(
      /^\/\*\s*@import url\("https:\/\/fonts\.googleapis\.com[^"]*"\);\s*\*\/\s*\n?/m,
      ''
    ).replace(
      /^@import url\("https:\/\/fonts\.googleapis\.com[^"]*"\);\s*\n?/m,
      ''
    );

    const importBlock = newImport
      ? `${markerStart}\n${newImport}\n${markerEnd}`
      : `${markerStart}\n/* ${PLACEHOLDER_FONT_IMPORT} */\n${markerEnd}`;

    return `${importBlock}\n\n${withoutOldImport}`;
  }
}

function main() {
  try {
    // Read index.css
    const indexCssContent = readFileSync(INDEX_CSS_PATH, 'utf-8');

    // Extract active theme
    const activeTheme = extractActiveTheme(indexCssContent);
    if (!activeTheme) {
      console.error('❌ Could not find active theme import in src/index.css');
      process.exit(1);
    }

    console.log(`📄 Active theme: ${activeTheme}`);

    // Read theme file
    const themePath = join(import.meta.dir, '..', 'src', activeTheme);
    const themeContent = readFileSync(themePath, 'utf-8');

    // Extract fonts
    const fonts = extractFontsFromTheme(themeContent);

    if (fonts.length === 0) {
      console.log('ℹ️  No Google Fonts detected (system fonts only)');
      const updatedContent = updateIndexCss(indexCssContent, null);
      writeFileSync(INDEX_CSS_PATH, updatedContent, 'utf-8');
      console.log('✅ Updated src/index.css with commented import');
      return;
    }

    console.log(`🔤 Detected fonts: ${fonts.map(f => f.name).join(', ')}`);

    // Generate Google Fonts URL
    const googleFontsImport = generateGoogleFontsUrl(fonts);

    // Update index.css
    const updatedContent = updateIndexCss(indexCssContent, googleFontsImport);
    writeFileSync(INDEX_CSS_PATH, updatedContent, 'utf-8');

    console.log('✅ Updated src/index.css with Google Fonts import:');
    console.log(`   ${googleFontsImport}`);
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();