# Changelog

## 0.1.0

First public release.

- `styles.css` now ships precompiled — no Tailwind needed in your app. It no longer applies a global reset; styles only affect agent-kit components.
- Markdown rendering uses `react-markdown` with GitHub-flavoured markdown (lists, tables, italics, blockquotes, strikethrough). Unsafe link protocols such as `javascript:` are not rendered as links, and images render as links instead of loading automatically.
- `CodeBlock` shares a single Shiki highlighter, loads any Shiki-supported language on demand, and no longer reformats code with Prettier. The default language is now `text`.
- New `--ak-code-surface` and `--ak-code-content` theme variables.
- The default font is now the system font stack. Set `--ak-font-sans` / `--ak-font-mono` to use your own.
- Collapsible headers (`Reasoning`, `ToolCall`, `Plan`) are keyboard-accessible buttons with `aria-expanded`.
- Includes `Plan` and `ScrollToBottom` components.
