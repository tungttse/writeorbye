import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { to, subject, content, scheduledAt } = await request.json();

    if (!to || !content) {
      return NextResponse.json(
        { error: 'Email and content are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Build email options
    const emailOptions: {
      from: string;
      to: string;
      subject: string;
      html: string;
      scheduledAt?: string;
    } = {
      from: 'Write or Bye <onboarding@resend.dev>', // Change this to your verified domain
      to,
      subject: subject || 'Your Writing from Write or Bye',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4F46E5;">Your Writing from Write or Bye</h1>
          <p style="color: #6B7280; font-size: 14px;">
            ${scheduledAt ? 'This is a scheduled email from your past self!' : 'Here is your writing:'}
          </p>
          <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <pre style="white-space: pre-wrap; font-family: Georgia, serif; font-size: 16px; line-height: 1.6; margin: 0;">${content}</pre>
          </div>
          <p style="color: #9CA3AF; font-size: 12px; margin-top: 30px;">
            Sent from <a href="https://writeorbye.com" style="color: #4F46E5;">Write or Bye</a> - The writing productivity tool
          </p>
        </div>
      `,
    };

    // Add scheduled time if provided (Resend supports scheduling)
    if (scheduledAt) {
      const scheduledDate = new Date(scheduledAt);
      const now = new Date();
      
      // Resend free tier allows scheduling up to 72 hours in advance
      const maxScheduleTime = new Date(now.getTime() + 72 * 60 * 60 * 1000);
      
      if (scheduledDate <= now) {
        return NextResponse.json(
          { error: 'Scheduled time must be in the future' },
          { status: 400 }
        );
      }
      
      if (scheduledDate > maxScheduleTime) {
        return NextResponse.json(
          { error: 'Scheduled time cannot be more than 72 hours in the future (Resend free tier limit)' },
          { status: 400 }
        );
      }
      
      emailOptions.scheduledAt = scheduledDate.toISOString();
    }

    const { data, error } = await resend.emails.send(emailOptions);

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: scheduledAt ? 'Email scheduled successfully!' : 'Email sent successfully!',
      id: data?.id,
    });
  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
