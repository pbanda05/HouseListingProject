import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Initialize the secure database connection using the keys from your .env.local file
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Initialize Resend using the API key from your .env.local file
const resend = new Resend(process.env.RESEND_API_KEY!);

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

    // Actually send the email now that the lead is saved
    try {
      await resend.emails.send({
        from: 'HostToolkit <onboarding@resend.dev>', // swap this once you set up your own domain in Resend
        to: email,
        subject: 'Your Listing Score + 5 Advanced Tips',
        html: `
          <p>Thanks for checking your listing with HostToolkit!</p>
          <p>Your listing score was <strong>${score}/10</strong>.</p>
          <p>Here are 5 advanced tips to boost your bookings even further:</p>
          <ul>
            <li>Update your photos seasonally to keep the listing feeling fresh</li>
            <li>Respond to inquiries within an hour to boost your ranking</li>
            <li>Offer a small welcome touch (snacks, local guide) to earn 5-star reviews</li>
            <li>Adjust pricing for weekends and local events</li>
            <li>Keep your calendar updated to avoid double bookings</li>
          </ul>
        `,
      });
      console.log("Email sent successfully to:", email);
    } catch (emailError) {
      // Don't fail the whole request if just the email fails — the lead is still saved
      console.error("Email sending failed:", emailError);
    }

    return NextResponse.json({ success: true, message: 'Lead securely saved!' }, { status: 200 });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}