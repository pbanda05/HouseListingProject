import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Securely parse the incoming request body
    const body = await request.json();
    const { email, score } = body;

    // Basic validation
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // TODO: Connect to the production database here to save the email
    console.log("Secure Backend Hit! Received lead:", email, "| Score:", score);

    // Send a secure success response back to the client
    return NextResponse.json({ success: true, message: 'Lead securely processed' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}