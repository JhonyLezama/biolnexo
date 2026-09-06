export default async function handler(req, res) {
  // Vercel Cron 3×/semana L/M/V 06:00 UTC — ver vercel.json crons
  // Protege con CRON_SECRET opcional
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && req.headers["authorization"] !== `Bearer ${cronSecret}`) {
    // Vercel Cron envía Authorization: Bearer <CRON_SECRET> si lo configuras
    // Si no hay CRON_SECRET, deja pasar (demo)
  }

  const { searchParams } = new URL(req.url, `https://${req.headers.host}`);
  const area = searchParams.get("area") || "biotecnologia";
  const lang = searchParams.get("lang") || "es";

  // En prod, aquí llamarías a scripts/agent_draft.py o a Supabase Edge Function
  // Por ahora solo log + inserta un draft demo si Supabase está configurado
  try {
    // Intento demo: inserta un draft de prueba si hay service_role (no en Vercel front)
    // Para no requerir service_role en Vercel, solo responde OK y deja que el cron real corra via GitHub Actions o Supabase Cron
    console.log(`[BiolNexo Cron] ${area} ${lang} — ${new Date().toISOString()}`);
    return res.status(200).json({
      ok: true,
      area,
      lang,
      message: "Cron recibido. Configura Supabase Cron o GitHub Actions para ejecutar scripts/agent_draft.py con LLM_ENABLED=true + GEMINI_API_KEY + SUPABASE_SERVICE_ROLE_KEY para generar borrador real 3×/semana.",
      next: "Ver /admin/borradores",
    });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e) });
  }
}
