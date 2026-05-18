import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, orgName, products, score, risk, email, satisfaction, comment } = body;

    const notifEmail = process.env.NOTIFICATION_EMAIL || "ton@email.com";

    let subject = "";
    let html = "";

    if (type === "audit") {
      subject = `🔍 Nouvel audit LibreAudit — ${orgName || "Anonyme"} — Score ${score}/100`;
      html = `
        <div style="font-family: sans-serif; max-width: 600px;">
          <h2 style="color: #1a2744;">Nouvel audit complété</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px; font-weight: bold; color: #6b7a94;">Organisation</td><td style="padding: 8px;">${orgName || "Non renseigné"}</td></tr>
            <tr style="background: #f8f7f4;"><td style="padding: 8px; font-weight: bold; color: #6b7a94;">Score</td><td style="padding: 8px; font-size: 20px; font-weight: bold; color: ${(score || 0) > 70 ? "#c1121f" : (score || 0) > 50 ? "#b8860b" : "#2d6a4f"};">${score}/100 — ${risk}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold; color: #6b7a94;">Produits analysés</td><td style="padding: 8px;">${(products || []).length}</td></tr>
            <tr style="background: #f8f7f4;"><td style="padding: 8px; font-weight: bold; color: #6b7a94;">Produits</td><td style="padding: 8px;">${(products || []).join(", ")}</td></tr>
          </table>
          <p style="margin-top: 16px; color: #9aa5b8; font-size: 12px;">LibreAudit · ${new Date().toLocaleString("fr-FR")}</p>
        </div>
      `;
    } else if (type === "lead") {
      subject = `📧 Nouveau lead LibreAudit — ${email} — ${orgName || "Anonyme"}`;
      html = `
        <div style="font-family: sans-serif; max-width: 600px;">
          <h2 style="color: #1a2744;">Nouveau lead — demande de rapport PDF</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px; font-weight: bold; color: #6b7a94;">Email</td><td style="padding: 8px; font-weight: bold;">${email}</td></tr>
            <tr style="background: #f8f7f4;"><td style="padding: 8px; font-weight: bold; color: #6b7a94;">Organisation</td><td style="padding: 8px;">${orgName || "Non renseigné"}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold; color: #6b7a94;">Score</td><td style="padding: 8px;">${score}/100</td></tr>
            <tr style="background: #f8f7f4;"><td style="padding: 8px; font-weight: bold; color: #6b7a94;">Produits</td><td style="padding: 8px;">${(products || []).length} produits</td></tr>
          </table>
          <p style="margin-top: 16px; color: #9aa5b8; font-size: 12px;">LibreAudit · ${new Date().toLocaleString("fr-FR")}</p>
        </div>
      `;
    } else if (type === "satisfaction") {
      subject = `📝 Avis LibreAudit — ${satisfaction}/10 — ${orgName || "Anonyme"}`;
      html = `
        <div style="font-family: sans-serif; max-width: 600px;">
          <h2 style="color: #1a2744;">Nouvel avis de satisfaction</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px; font-weight: bold; color: #6b7a94;">Note</td><td style="padding: 8px; font-size: 24px; font-weight: bold; color: #4361ee;">${satisfaction}/10</td></tr>
            <tr style="background: #f8f7f4;"><td style="padding: 8px; font-weight: bold; color: #6b7a94;">Organisation</td><td style="padding: 8px;">${orgName || "Non renseigné"}</td></tr>
            ${comment ? `<tr><td style="padding: 8px; font-weight: bold; color: #6b7a94;">Commentaire</td><td style="padding: 8px;">${comment}</td></tr>` : ""}
            <tr style="background: #f8f7f4;"><td style="padding: 8px; font-weight: bold; color: #6b7a94;">Score audit</td><td style="padding: 8px;">${score}/100</td></tr>
          </table>
          <p style="margin-top: 16px; color: #9aa5b8; font-size: 12px;">LibreAudit · ${new Date().toLocaleString("fr-FR")}</p>
        </div>
      `;
    }

    await resend.emails.send({
      from: "LibreAudit <onboarding@resend.dev>",
      to: notifEmail,
      subject,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Email error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
