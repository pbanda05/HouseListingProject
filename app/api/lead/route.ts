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

    // Build the nicer-looking email
    const emailHtml = `
      <div style="font-family: -apple-system, Helvetica, Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #FAF6EF;">
        <div style="background: #1F3B3D; color: #ffffff; padding: 24px; border-radius: 8px 8px 0 0;">
          <p style="margin: 0; font-size: 13px; letter-spacing: 0.5px; text-transform: uppercase; opacity: 0.7;">HostToolkit</p>
          <h1 style="margin: 8px 0 0; font-size: 22px;">Your Listing Report</h1>
        </div>

        <div style="background: #ffffff; padding: 28px 24px; border: 1px solid #E4DCCB; border-top: none;">
          <p style="font-size: 15px; color: #23282B; margin: 0 0 20px;">
            Thanks for checking your listing with HostToolkit! Here's your score and next steps.
          </p>

          <div style="display: inline-block; background: #1F3B3D; color: #ffffff; width: 56px; height: 56px; border-radius: 50%; text-align: center; line-height: 56px; font-size: 18px; font-weight: bold; margin-bottom: 20px;">
            ${score}/10
          </div>

          <h2 style="font-size: 15px; color: #1F3B3D; margin: 0 0 12px;">5 advanced tips to boost your bookings</h2>

          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #E4DCCB; font-size: 14px; color: #23282B;">Update your photos seasonally to keep the listing feeling fresh</td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #E4DCCB; font-size: 14px; color: #23282B;">Respond to inquiries within an hour to boost your ranking</td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #E4DCCB; font-size: 14px; color: #23282B;">Offer a small welcome touch (snacks, local guide) to earn 5-star reviews</td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #E4DCCB; font-size: 14px; color: #23282B;">Adjust pricing for weekends and local events</td></tr>
            <tr><td style="padding: 10px 0; font-size: 14px; color: #23282B;">Keep your calendar updated to avoid double bookings</td></tr>
          </table>
        </div>

        <p style="text-align: center; font-size: 12px; color: #5B6367; margin-top: 20px;">
          Sent by HostToolkit — tools to help you rent smarter.
        </p>
      </div>
    `;

    // Actually send the email now that the lead is saved
    try {
      await resend.emails.send({
        from: 'HostToolkit <onboarding@resend.dev>', // swap this once you set up your own domain in Resend
        to: email,
        subject: 'Your Listing Score + 5 Advanced Tips',
        html: emailHtml,
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