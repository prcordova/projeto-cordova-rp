import { NextResponse } from "next/server";
import { loadCityLive } from "@/lib/cityStatus";
import { loadSchedule, maintenanceMessage } from "@/lib/maintenance";

export const dynamic = "force-dynamic";

export async function GET() {
  const [live, schedule] = await Promise.all([
    loadCityLive(),
    loadSchedule().catch(() => null)
  ]);
  return NextResponse.json({
    ...live,
    maintenance: schedule ? maintenanceMessage(schedule) : null
  });
}
