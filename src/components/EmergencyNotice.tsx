import { BatteryWarning, Flame, Siren } from "lucide-react";
import { GAS_UTILITIES } from "@/lib/emergency";
import { telHref } from "@/lib/links";

export type EmergencyKind = "gas" | "fire" | "battery";

/**
 * "Do this now" instructions for the hazards where minutes matter.
 * Shown above the safety result so nobody has to scroll for them.
 */
export function EmergencyNotice({ kinds }: { kinds: EmergencyKind[] }) {
  if (kinds.length === 0) return null;
  return (
    <section
      aria-labelledby="emergency-heading"
      className="mb-6 overflow-hidden rounded-card border-2 border-danger bg-white shadow-card"
    >
      <div className="hazard-stripes h-2" aria-hidden="true" />
      <div className="p-5">
        <h2 id="emergency-heading" className="flex items-center gap-2 font-display text-2xl font-extrabold text-danger-ink">
          <Siren className="h-6 w-6" aria-hidden="true" />
          Do this first
        </h2>
        <div className="mt-3 space-y-4 text-ink">
          {kinds.includes("gas") && (
            <div className="flex gap-3">
              <Flame className="mt-0.5 h-5 w-5 flex-none text-danger" aria-hidden="true" />
              <div>
                <p className="font-bold">If you smell gas right now</p>
                <p className="mt-0.5 text-sm text-ink-soft">
                  Leave the building. Don&apos;t flip switches, light anything, or make calls inside.
                  Once you&apos;re outside, call 911 or your gas company:
                </p>
                <ul className="mt-2 grid gap-1 text-sm sm:grid-cols-2">
                  {GAS_UTILITIES.map((utility) => (
                    <li key={utility.name}>
                      <a href={telHref(utility.phone)} className="link">
                        {utility.name} {utility.phone}
                      </a>{" "}
                      <span className="text-ink-muted">({utility.area})</span>
                    </li>
                  ))}
                  <li className="text-ink-muted">On propane? Call your propane supplier.</li>
                </ul>
              </div>
            </div>
          )}
          {kinds.includes("fire") && (
            <div className="flex gap-3">
              <Flame className="mt-0.5 h-5 w-5 flex-none text-danger" aria-hidden="true" />
              <div>
                <p className="font-bold">If you see smoke or sparks</p>
                <p className="mt-0.5 text-sm text-ink-soft">
                  If there are flames or heavy smoke, get everyone out and call{" "}
                  <a href="tel:911" className="link">
                    911
                  </a>
                  . Otherwise, unplug the item only if the plug is cool and easy to reach, or switch
                  off its breaker. Don&apos;t use it again until a pro checks it.
                </p>
              </div>
            </div>
          )}
          {kinds.includes("battery") && (
            <div className="flex gap-3">
              <BatteryWarning className="mt-0.5 h-5 w-5 flex-none text-danger" aria-hidden="true" />
              <div>
                <p className="font-bold">If a battery is swollen, hot, or leaking</p>
                <p className="mt-0.5 text-sm text-ink-soft">
                  Stop charging it. If it&apos;s safe to touch, set it on a non-flammable surface,
                  away from anything that can burn. Never puncture it or throw it in the trash.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
