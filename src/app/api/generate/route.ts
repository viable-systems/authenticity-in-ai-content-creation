import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

// Type definitions
type Tone = 'professional' | 'casual' | 'academic' | 'creative' | 'conversational';

interface GenerateRequest {
  topic: string;
  keyPoints: string;
  tone: Tone;
}

interface GenerateResponse {
  article: string;
  error?: string;
}

// Initialize Anthropic client
const anthropic = new Anthropic({
    baseURL: process.env.ANTHROPIC_BASE_URL || undefined,
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: GenerateRequest = await request.json();
    const { topic, keyPoints, tone } = body;

    // Validate input
    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return NextResponse.json(
        { error: 'Topic is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    if (topic.trim().length > 200) {
      return NextResponse.json(
        { error: 'Topic must be 200 characters or less' },
        { status: 400 }
      );
    }

    if (!keyPoints || typeof keyPoints !== 'string' || keyPoints.trim().length === 0) {
      return NextResponse.json(
        { error: 'Key points are required and must be a non-empty string' },
        { status: 400 }
      );
    }

    if (keyPoints.trim().length > 2000) {
      return NextResponse.json(
        { error: 'Key points must be 2000 characters or less' },
        { status: 400 }
      );
    }

    if (!tone || !['professional', 'casual', 'academic', 'creative', 'conversational'].includes(tone)) {
      return NextResponse.json(
        { error: 'Tone must be one of: professional, casual, academic, creative, conversational' },
        { status: 400 }
      );
    }

    // Check for API key
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY is not configured. Please add it to your environment variables.' },
        { status: 500 }
      );
    }

    // Construct prompt
    const prompt = `You are an expert content writer. Create a well-structured article draft based on the following information:

Topic: ${topic.trim()}

Key Points to Cover:
${keyPoints.trim()}

Tone/Style: ${tone}

Requirements:
- Write in ${tone} tone
- Include an engaging introduction
- Expand on each key point in separate sections
- Add a conclusion that summarizes key takeaways
- Use markdown formatting (headers, bullet points, bold text)
- Aim for 800-1200 words
- Make it ready to publish with minimal editing

Generate the article now:`;

    // Call Anthropic API
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Extract response text
    const articleText = message.content[0].type === 'text'
      ? message.content[0].text
      : 'Failed to generate article content';

    // Return success response
    return NextResponse.json(
      { article: articleText } as GenerateResponse,
      { status: 200 }
    );

  } catch (error) {
    console.error('Error generating article:', error);

    // Handle specific Anthropic errors
    if (error instanceof Error) {
      if (error.message.includes('401') || error.message.includes('authentication')) {
        return NextResponse.json(
          { error: 'Invalid Anthropic API key. Please check your ANTHROPIC_API_KEY environment variable.' },
          { status: 500 }
        );
      }

      if (error.message.includes('429') || error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please wait a moment and try again.' },
          { status: 429 }
        );
      }

      if (error.message.includes('timeout')) {
        return NextResponse.json(
          { error: 'Request timeout. The AI took too long to respond. Please try again.' },
          { status: 504 }
        );
      }
    }

    // Generic error response
    return NextResponse.json(
      { error: 'Failed to generate article. Please try again later.' },
      { status: 500 }
    );
  }
}