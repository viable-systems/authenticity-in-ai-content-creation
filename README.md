# Authenticity In AI Content Creation

AI-powered tool to transform rough ideas into polished article drafts.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create environment file:
   ```bash
   cp .env.local.example .env.local
   ```

3. Add your Anthropic API key to `.env.local`:
   ```
   ANTHROPIC_API_KEY=sk-ant-...
   ```

4. Run development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   npm run start
   ```

## Usage

1. Enter your article topic
2. Add key points you want to cover
3. Select the desired tone
4. Click "Generate Article"
5. Copy or download your markdown draft
