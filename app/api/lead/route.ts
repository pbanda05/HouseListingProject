import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize the secure database connection using the keys from your .env.local file
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, score } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Securely insert the lead into the PostgreSQL 'leads' table
    const { data, error } = await supabase
      .from('leads')
      .insert([{ email, score }]);

    if (error) {
      // Handle unique constraint error for duplicate email to prevent crashes
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
      }
      throw error;
    }

    console.log("Database Insert Success for:", email);
    return NextResponse.json({ success: true, message: 'Lead securely saved!' }, { status: 200 });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}