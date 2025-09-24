# Vibescent

AI-powered fragrance note generator that creates scent profiles based on your descriptions and reference images.

## Features

- Generate fragrance notes using GPT-4.1
- Upload reference images for visual inspiration
- Real-time streaming results
- Responsive design with Tailwind CSS
- Type-safe with TypeScript and Zod

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Convex for data storage
- **AI**: OpenRouter API with GPT-4.1
- **Forms**: React Hook Form with Zod validation
- **Linting**: Biome (Ultracite)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/vibescent.git
   cd vibescent
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Add your API keys:
   - `OPENROUTER_API_KEY`: Your OpenRouter API key
   - `CONVEX_URL`: Your Convex deployment URL

4. Set up Convex:
   ```bash
   npx convex dev
   ```

5. Run the development server:
   ```bash
   bun run dev
   ```

## Usage

1. Enter a scent description in the prompt field
2. Optionally upload a reference image
3. Click "Generate Notes" to create your fragrance profile
4. View the generated notes with images and links

## Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run check` - Run Biome linter
- `bun run typecheck` - Run TypeScript type checking

## Deployment

Deploy to Vercel with Convex integration:

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## License

MIT
