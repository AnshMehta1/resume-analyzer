import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  try {
    const { email, status, score, notes } = await req.json();

    let subject = "";
    let body = "";

    switch (status) {
      case "Approved":
        subject = "Your Resume Has Been Approved!";
        body = `
          <h2>Congratulations!</h2>
          <p>Your resume has been <strong>approved</strong>.</p>
          <p><strong>Score:</strong> ${score ?? "N/A"}</p>
          ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ""}
          <p>Keep up the great work and continue refining your skills!</p>
        `;
        break;

      case "Needs Revision":
        subject = "Your Resume Needs Some Revisions";
        body = `
          <h2>Hi there!</h2>
          <p>Your resume review is complete, but we’d like you to make a few improvements.</p>
          <p><strong>Score:</strong> ${score ?? "N/A"}</p>
          ${notes ? `<p><strong>Feedback:</strong> ${notes}</p>` : ""}
          <p>Please revise and resubmit for another review.</p>
        `;
        break;

      case "Rejected":
        subject = "Your Resume Review Results";
        body = `
          <h2>Thanks for submitting your resume!</h2>
          <p>After careful review, we were unable to approve your resume this time.</p>
          <p><strong>Score:</strong> ${score ?? "N/A"}</p>
          ${notes ? `<p><strong>Reviewer Notes:</strong> ${notes}</p>` : ""}
          <p>Don't be discouraged — use the feedback to make improvements and reapply!</p>
        `;
        break;

      default:
        subject = "📄 Resume Review Update";
        body = `
          <h2>Hello!</h2>
          <p>Your resume status has been updated to: <strong>${status}</strong>.</p>
          <p><strong>Score:</strong> ${score ?? "N/A"}</p>
          ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ""}
        `;
        break;
    }

    const { data, error } = await resend.emails.send({
      from: 'Resume Platform <onboarding@resend.dev>',
      to: email,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          ${body}
          <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #888;">
            This is an automated message from the Resume Review Platform.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Email send error:", error);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Email sent successfully", data });

  } catch (err: any) {
    console.error("Unexpected error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
