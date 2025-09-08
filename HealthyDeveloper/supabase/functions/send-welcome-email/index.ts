import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  displayName: string;
  confirmationUrl?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, displayName, confirmationUrl }: WelcomeEmailRequest = await req.json();

    const emailHtml = confirmationUrl ? `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333; text-align: center;">Welcome to Productivity Scheduler!</h1>
        <p>Hi ${displayName || 'there'},</p>
        <p>Thank you for joining the healthy developer community! We're excited to help you build better habits and maintain your productivity streaks.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${confirmationUrl}" 
             style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Confirm Your Email
          </a>
        </div>
        <p>Once confirmed, you'll be able to:</p>
        <ul>
          <li>📅 Create and manage your daily schedule</li>
          <li>🔥 Build and track activity streaks</li>
          <li>💪 Monitor your health and fitness goals</li>
          <li>📊 View your productivity analytics</li>
        </ul>
        <p>Get ready to level up your developer lifestyle!</p>
        <p>Best regards,<br>The Productivity Scheduler Team</p>
      </div>
    ` : `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333; text-align: center;">Welcome to Productivity Scheduler!</h1>
        <p>Hi ${displayName || 'there'},</p>
        <p>Your account has been successfully created! Welcome to the healthy developer community.</p>
        <p>You're now ready to:</p>
        <ul>
          <li>📅 Create and manage your daily schedule</li>
          <li>🔥 Build and track activity streaks</li>
          <li>💪 Monitor your health and fitness goals</li>
          <li>📊 View your productivity analytics</li>
        </ul>
        <p>Start building your streaks today and maintain that developer momentum!</p>
        <p>Best regards,<br>The Productivity Scheduler Team</p>
      </div>
    `;

    const emailResponse = await resend.emails.send({
      from: "Productivity Scheduler <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to Productivity Scheduler! 🚀",
      html: emailHtml,
    });

    console.log("Welcome email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-welcome-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);