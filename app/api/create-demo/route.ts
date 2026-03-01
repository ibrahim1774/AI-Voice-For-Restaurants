import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const RESTAURANT_KNOWLEDGE = {
  primaryGoal: "Book a reservation",
  keyInfo:
    "Party size, preferred date and time, any dietary restrictions or allergies, special occasions (birthday, anniversary), indoor or outdoor seating preference, contact name and phone number",
  scenarios:
    "New reservation booking, large party or private dining inquiry, menu questions (dietary restrictions, allergens, vegan/gluten-free options), catering requests, hours and location questions, cancellation or modification of existing reservation, waitlist inquiries during peak hours",
  pricingBehavior:
    'Say "we have a range of options on our menu — I can help you with general pricing, but for catering quotes our events team will follow up with a detailed proposal"',
  schedulingNotes:
    "Differentiate between regular dining reservations and private events or catering. Ask about party size first, then date and time preference, then any special requests",
};

interface CreateDemoRequest {
  practiceName: string;
  phoneNumber: string;
  goal: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateDemoRequest = await request.json();

    // Validate input
    if (!body.practiceName?.trim()) {
      return NextResponse.json(
        { error: "Practice name is required" },
        { status: 400 }
      );
    }

    const phoneDigits = (body.phoneNumber || "").replace(/\D/g, "");
    if (phoneDigits.length < 10) {
      return NextResponse.json(
        { error: "A valid phone number is required" },
        { status: 400 }
      );
    }

    if (!body.goal?.trim()) {
      return NextResponse.json(
        { error: "Please select a goal" },
        { status: 400 }
      );
    }

    const primaryGoal = body.goal;

    // Step 1: Generate custom restaurant receptionist system prompt with Claude
    const claudeResponse = await anthropic.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `You are an expert at creating AI receptionist system prompts for restaurants. Generate a custom system prompt for this restaurant:

Restaurant Name: "${body.practiceName}"

This receptionist answers phone calls for this restaurant. Here is what you need to know:

Primary goal selected by the restaurant: ${primaryGoal}
Information to gather from callers: ${RESTAURANT_KNOWLEDGE.keyInfo}
Common caller scenarios to handle: ${RESTAURANT_KNOWLEDGE.scenarios}
How to handle pricing questions: ${RESTAURANT_KNOWLEDGE.pricingBehavior}
Scheduling notes: ${RESTAURANT_KNOWLEDGE.schedulingNotes}

The system prompt you generate must:

1. Greet callers warmly using the restaurant name: "${body.practiceName}"
2. Sound like a real human restaurant host — use contractions, casual phrasing, and a friendly, welcoming tone
3. Follow the restaurant-specific booking flow above — ask the right questions in a natural conversational order, not all at once
4. Ask ONE question at a time, wait for the answer, then ask the next
5. Always work toward the primary goal: "${primaryGoal}" — prioritize this above all else in every conversation
6. Handle the common restaurant scenarios listed above naturally — be especially helpful with dietary restrictions and special occasions
7. Use the pricing guidance above when pricing comes up — never make up specific prices
8. Keep every response to 1-3 sentences max — this is a phone call, not an email
9. If the caller asks something outside your knowledge, say "Let me have someone from our team get back to you on that — can I grab your name and number?"
10. Always capture the caller's name and callback number before ending the call
11. Never mention being AI unless directly asked
12. Never fabricate information about the restaurant — don't make up chef names, hours, or specific menu items not mentioned

Return ONLY the system prompt text. No markdown formatting, no explanations, no quotation marks wrapping it.`,
        },
      ],
    });

    const systemPrompt =
      claudeResponse.content[0].type === "text"
        ? claudeResponse.content[0].text
        : "";

    if (!systemPrompt) {
      throw new Error("Failed to generate system prompt");
    }

    // Step 2: Create Vapi assistant with the custom restaurant prompt
    const vapiResponse = await fetch("https://api.vapi.ai/assistant", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.VAPI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: `Demo - ${body.practiceName}`.slice(0, 40),
        model: {
          provider: "anthropic",
          model: "claude-sonnet-4-5-20250929",
          systemPrompt: systemPrompt,
          temperature: 0.7,
          maxTokens: 300,
        },
        voice: {
          provider: "11labs",
          voiceId: "paula",
        },
        transcriber: {
          provider: "deepgram",
          model: "nova-2",
          language: "en-US",
          keywords: [
            "reservation:2",
            "table:2",
            "party:2",
            "menu:2",
            "appetizer:2",
            "entree:2",
            "dessert:2",
            "gluten-free:2",
            "vegan:2",
            "vegetarian:2",
            "allergy:2",
            "allergen:2",
            "catering:2",
            "private dining:2",
            "waitlist:2",
            "outdoor:2",
            "patio:2",
            "brunch:2",
            "happy hour:2",
            "wine:2",
            "cocktail:2",
            "takeout:2",
            "delivery:2",
            "prix fixe:2",
            "tasting menu:2",
            "chef:2",
            "specials:2",
          ],
        },
        firstMessage: `Thanks for calling ${body.practiceName}, how can I help you today?`,
        firstMessageMode: "assistant-speaks-first",
      }),
    });

    if (!vapiResponse.ok) {
      const vapiError = await vapiResponse.json().catch(() => ({}));
      console.error("Vapi API error:", vapiError);
      const errorMessage = vapiError?.message || vapiError?.error || JSON.stringify(vapiError);
      throw new Error(`Failed to create AI assistant: ${errorMessage}`);
    }

    const assistant = await vapiResponse.json();

    return NextResponse.json({
      assistantId: assistant.id,
      practiceName: body.practiceName,
    });
  } catch (error) {
    console.error("Create demo error:", error);

    if (error instanceof Anthropic.APIError) {
      return NextResponse.json(
        {
          error: `AI service error: ${error.message}`,
        },
        { status: error.status || 503 }
      );
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "We hit a snag building your receptionist. Please try again.",
      },
      { status: 500 }
    );
  }
}
