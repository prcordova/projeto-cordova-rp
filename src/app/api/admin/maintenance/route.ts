import { NextResponse } from "next/server";
import { loadSchedule, readSchedule, saveSchedule } from "@/lib/maintenance";
import { readSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await readSession();
  if (!user?.admin) return NextResponse.json({ ok: false, message: "Sem acesso ao painel." }, { status: 403 });
  try {
    return NextResponse.json({ ok: true, schedule: await loadSchedule() });
  } catch {
    return NextResponse.json({ ok: false, message: "Não foi possível ler a manutenção." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await readSession();
  if (!user?.admin) return NextResponse.json({ ok: false, message: "Sem acesso ao painel." }, { status: 403 });
  const schedule = readSchedule(await request.json().catch(() => null));
  if (!schedule) return NextResponse.json({ ok: false, message: "Informe o horário no formato 11:00. No modo de um dia, informe a data." }, { status: 400 });
  try {
    await saveSchedule(schedule);
    return NextResponse.json({ ok: true, message: "Manutenção salva. A página inicial passa a mostrar esse aviso." });
  } catch {
    return NextResponse.json({ ok: false, message: "Não foi possível salvar a manutenção." }, { status: 500 });
  }
}
