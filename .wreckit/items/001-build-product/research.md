# Research: Build Authenticity In Ai Content Creation

**Date**: 2025-06-17
**Item**: 001-build-product

## Research Question

Build a production-ready web TOOL called "Authenticity In Ai Content Creation".

Product derived from radar signal: Authenticity in AI Content Creation. Source: agent.

## Product Spec (FOLLOW THIS EXACTLY)
Problem: Content creators need to turn rough ideas into polished drafts quickly
Core Loop: User provides a topic and key points → App generates structured content → User gets an editable draft
User Input: A form with topic field, key points textarea, and tone/style selector
Transformation: Use AI to expand the inputs into a well-structured article draft
Output: A formatted article preview with sections, plus copy-to-clipboard and markdown download


## Architecture Requirements
1. MUST have a form/input on the main page where the user provides data
2. MUST have at least one API route (src/app/api/) that processes the input
3. MUST display results that change based on user input
4. MUST have a way to copy/download/export the output
5. MUST NOT have hardcoded data arrays with 5+ items displayed in grids — if you're tempted to create a catalog, STOP and build a tool instead

## What NOT to Build
- Static dashboards with fake metrics
- Technology catalogs with hardcoded entries
- Comparison grids with pre-filled data
- Landing pages without working tools

## Tech Stack (already configured)
Next.js 15, React 19, TypeScript, Tailwind CSS. Add npm packages as needed.
For AI features: use Anthropic SDK with process.env.ANTHROPIC_API_KEY

After implementation, `npm run build` must succeed with zero errors.

## Summary

This project requires building a complete web application from scratch for AI-assisted content creation. The codebase is currently minimal with only a basic Next.js 15 setup. The application needs to transform user-provided topics and key points into structured article drafts using the Anthropic API, with full CRUD capabilities (create, read, update, delete) for the generated content.

The implementation requires creating a client-side form interface, a Next.js API route to handle AI processing via Anthropic's SDK, and a results display with export functionality. The project follows the Input → Transform → Output pattern emphasized in the documentation, with strict requirements against static dashboards or hardcoded data displays. The tech stack is modern (Next.js 15, React 19, Tailwind CSS v4) and ready for expansion.

Key dependencies to add include `@anthropic-ai/sdk` for AI integration, and potentially React hooks for form state management. The existing Tailwind CSS v4 configuration uses PostCSS rather than a traditional config file, which is important to maintain. The application must pass a production build with zero errors and provide immediate utility to users within 30 seconds of interaction.

## Current State Analysis

### Existing Implementation

The project is in its initial state with a minimal Next.js 15 setup:

- **package.json:1-23** - Contains base dependencies: Next.js 15.4.0, React 19.1.0, Tailwind CSS 4.1.0 with PostCSS plugin. No AI SDK or additional packages installed yet.

- **src/app/page.tsx:1-3** - Currently displays a placeholder with only a title and "Building..." text. This needs to be replaced with a functional form interface.

- **src/app/layout.tsx:1-15** - Root layout with basic metadata. The metadata already correctly titles the application "Authenticity In Ai Content Creation" with appropriate description.

- **src/app/globals.css:1** - Uses Tailwind CSS v4's new import syntax (`@import "tailwindcss"`), NOT the traditional `@tailwind` directives. This is critical - no tailwind.config.ts file should be created.

- **tsconfig.json:1-40** - TypeScript configured in strict mode with path alias `@/*` pointing to `./src/*`. All modern compiler options enabled.

- **postcss.config.mjs:1-9** - PostCSS configured with `@tailwindcss/postcss` plugin for Tailwind v4 processing.

- **No API routes exist yet** - The `src/app/api/` directory needs to be created from scratch.

- **No environment configuration** - No `.env` or `.env.local` file exists; ANTHROPIC_API_KEY will need to be documented for setup.

### Current Patterns and Conventions

- **App Router Architecture**: Using Next.js 15 App Router (not Pages Router), all routes go under `src/app/`
- **TypeScript Strict Mode**: All code must be type-safe with strict compiler enabled
- **Tailwind CSS v4**: Uses CSS-first configuration, NOT JavaScript config files
- **Component Pattern**: Using React 19 with TypeScript, components are default exports
- **No Build Errors**: The current setup builds successfully (`npm run build` works with the placeholder)

### Integration Points

- **Anthropic API**: Will need to integrate via `@anthropic-ai/sdk` package using `process.env.ANTHROPIC_API_KEY`
- **Client-Server Communication**: Next.js API routes will handle server-side AI processing, client will use fetch() or similar
- **Form State Management**: Will need React hooks (useState, useForm, or similar) for form handling
- **Export Functionality**: Clipboard API and Blob/download APIs for copying/downloading markdown

## Key Files

- **package.json:1-23** - Base dependencies for Next.js 15, React 19, Tailwind CSS v4. Missing `@anthropic-ai/sdk` package that needs to be installed.

- **src/app/page.tsx:1-3** - Current placeholder page. Must be replaced with:
  - Form component with topic input (text field)
  - Key points textarea
  - Tone/style selector (dropdown or radio buttons)
  - Generate button
  - Results display area
  - Copy to clipboard button
  - Download markdown button

- **src/app/layout.tsx:4-6** - Metadata configuration already correctly set. May need enhancement for SEO (Open Graph tags).

- **src/app/globals.css:1** - Tailwind CSS v4 import. Critical: Do NOT add `@tailwind` directives or create tailwind.config.ts file.

- **CLAUDE.md:1-68** - Comprehensive build requirements and anti-patterns. This is the canonical source of truth for:
  - Input → Transform → Output pattern requirement
  - Mandatory anti-patterns (no static dashboards, no catalogs)
  - Technical stack details
  - Quality check criteria

- **.wreckit/items/001-build-product/item.json:1-24** - Item specification with success criteria:
  - Form/input mechanism on main page ✓ (to be built)
  - API route to process input ✓ (to be created)
  - Dynamic output based on user input ✓ (to be implemented)
  - Export/copy/download functionality ✓ (to be implemented)
  - Zero build errors ✓ (currently passing)

## Technical Considerations

### Dependencies

**Required New Packages:**
- `@anthropic-ai/sdk` - Official Anthropic SDK for AI content generation
- Optional: React Hook Form or Formik for form management (could use vanilla React hooks)
- Optional: Zod for runtime type validation of form inputs
- Optional: React Hot Toast or similar for user feedback notifications

**Existing Dependencies to Use:**
- `next: ^15.4.0` - App Router for API routes and server components
- `react: ^19.1.0` - Latest React for client components
- `tailwindcss: ^4.1.0` - Styling with new CSS-first configuration

**External APIs:**
- Anthropic API (Claude) - Content generation, requires `process.env.ANTHROPIC_API_KEY`
- No other external APIs needed per spec

### Patterns to Follow

**Input → Transform → Output Architecture:**
1. **INPUT** (Client Component):
   - Form with controlled components
   - Validation before submission
   - Loading state during API call
   - Error state handling

2. **TRANSFORM** (API Route):
   - POST endpoint at `src/app/api/generate/route.ts`
   - Validate request body
   - Call Anthropic API with structured prompt
   - Return generated article or error response
   - Handle rate limiting and edge cases

3. **OUTPUT** (Client Component):
   - Display formatted article with markdown rendering
   - Editable draft (textarea or contenteditable)
   - Copy to clipboard functionality (navigator.clipboard.writeText)
   - Download as .md file (Blob + URL.createObjectURL)

**API Route Pattern:**
```typescript
// src/app/api/generate/route.ts
import Anthropic from '@anthropic-ai/sdk';

export async function POST(request: Request) {
  const body = await request.json();
  const { topic, keyPoints, tone } = body;
  // Process and return
}
```

**Client Component Pattern:**
```typescript
'use client'; // Required for form interactivity

export default function ContentGenerator() {
  const [topic, setTopic] = useState('');
  const [keyPoints, setKeyPoints] = useState('');
  // ... rest of implementation
}
```

**Styling Conventions:**
- Use Tailwind utility classes only
- No custom CSS except in globals.css
- Responsive design with mobile-first approach
- Light or dark theme (choose based on content creation focus)

**TypeScript Patterns:**
- Define interfaces for form data: `interface GenerateRequest { topic: string; keyPoints: string; tone: string; }`
- Define interfaces for API responses: `interface GenerateResponse { article: string; }`
- Use proper typing for API route handlers
- Type-safe environment variable access

## Risks and Mitigations

| Risk | Impact | Mitigation |
| ---- | ------ | ---------- |
| **Anthropic API key not configured** | High - App won't function | Document ANTHROPIC_API_KEY requirement in README; add fallback error message if key missing; test with actual API key during development |
| **AI generation timeout/failure** | Medium - Poor UX | Implement proper error handling; show user-friendly error messages; add retry mechanism; set reasonable timeout on API route |
| **Form validation missing** | Medium - Bad input to API | Validate on client before submission; validate on API route; show clear error messages; sanitize inputs |
| **Build errors with new dependencies** | High - Blocks deployment | Run `npm run build` after adding packages; ensure TypeScript types are compatible; test production build before completion |
| **Tailwind v4 configuration broken** | Medium - Styles won't work | Do NOT create tailwind.config.ts; maintain `@import "tailwindcss"` syntax; verify styling works in dev and build |
| **Export functionality fails** | Low - Feature broken | Test copy-to-clipboard in multiple browsers; test markdown download; provide fallback copy-to-clipboard button for older browsers |
| **Performance with long content** | Medium - Slow UX | Implement streaming or loading indicators; set character limits on inputs; optimize article rendering |
| **Breaking React 19 changes** | Low - Component errors | Test with React 19's new features; be aware of changed APIs; follow React 19 documentation |

## Recommended Approach

**Phase 1: Setup and Infrastructure**
1. Install `@anthropic-ai/sdk` package via npm
2. Create `.env.local` file with ANTHROPIC_API_KEY placeholder (document in README)
3. Create API route structure at `src/app/api/generate/route.ts`
4. Test build: `npm run build` to ensure no errors

**Phase 2: Backend API Implementation**
1. Implement Anthropic client initialization with API key
2. Create structured prompt for article generation based on topic, key points, and tone
3. Add input validation and error handling
4. Return formatted markdown article
5. Test API route manually or with curl

**Phase 3: Frontend Form Component**
1. Convert `src/app/page.tsx` to a client component with `'use client'`
2. Build form with:
   - Topic text input
   - Key points textarea
   - Tone/style dropdown (options: professional, casual, academic, creative, etc.)
   - Generate button
3. Add form validation (required fields, character limits)
4. Implement loading state during API call
5. Add error handling and display

**Phase 4: Results Display and Export**
1. Create article preview component with markdown rendering (could use simple formatting or a library)
2. Implement editable draft (textarea with pre-filled content)
3. Add "Copy to Clipboard" button with navigator.clipboard API
4. Add "Download Markdown" button with Blob and download attribute
5. Add visual feedback (success messages, loading indicators)

**Phase 5: Polish and Testing**
1. Apply Tailwind styling for clean, modern UI
2. Ensure responsive design (mobile + desktop)
3. Test all user flows:
   - Generate article from valid input
   - Handle empty/invalid input
   - Copy to clipboard works
   - Download works
4. Run `npm run build` - must succeed with zero errors
5. Test in production mode: `npm run start` after build

**Critical Success Factors:**
- Form must be the primary focus on the page (not a sidebar or secondary element)
- Generated content must be immediately useful (not requiring further editing to be readable)
- Export functionality must work reliably (copy and download)
- Zero hardcoded example content - all content must come from user input
- Build must pass without errors

## Open Questions

1. **AI Model Selection**: Which Anthropic model should be used? (e.g., claude-3-haiku for speed, claude-3-sonnet for quality, claude-3-opus for best results) This affects cost, speed, and output quality.

2. **Tone/Style Options**: What specific tone options should be available? (Professional, Casual, Academic, Creative, Conversational, Persuasive, etc.) Should this be customizable or a fixed set?

3. **Article Structure**: Should the AI generate a specific article structure (e.g., Introduction, Body Paragraphs, Conclusion) or should it be flexible? This affects the prompt engineering.

4. **Markdown Rendering**: Should we use a markdown rendering library (like react-markdown) for display, or simply show the raw markdown in an editable textarea? This affects the preview vs. editing experience.

5. **Content Length Limits**: Should there be character/word limits on inputs or outputs? This affects API costs and user experience.

6. **Error Handling for API Key**: What should happen if ANTHROPIC_API_KEY is not set in the environment? Should the app show a setup message or fail gracefully?

7. **Rate Limiting**: Should we implement client-side or server-side rate limiting to prevent API abuse? This affects production readiness.

8. **Session State**: Should generated articles be stored (localStorage, database) or is one-time generation sufficient? This affects user workflow if they want to regenerate or compare versions.

9. **Edit vs. Regenerate Workflow**: After generating an article, should users be able to edit the inputs and regenerate, or is it a one-shot tool? This affects UI design.

10. **Accessibility Requirements**: Are there specific WCAG compliance requirements or accessibility features needed? (e.g., ARIA labels, keyboard navigation, screen reader support)
