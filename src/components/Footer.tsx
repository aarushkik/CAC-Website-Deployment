import Link from "next/link";
import { Icon } from "./Icon";

const COLUMNS: Array<{ title: string; links: Array<[string, string]> }> = [
  {
    title: "Repair",
    links: [
      ["Start a repair", "/choose-item"],
      ["Describe a problem", "/scanner"],
      ["All repair guides", "/guides"],
      ["3D workshop", "/models"],
      ["Fix or replace?", "/calculator"],
    ],
  },
  {
    title: "Get help",
    links: [
      ["Repair places near you", "/resources"],
      ["Check a recall", "/recalls"],
      ["About and safety promise", "/about"],
    ],
  },
  {
    title: "Your repairs",
    links: [
      ["Repair log", "/log"],
      ["Your impact", "/dashboard"],
      ["Team challenge", "/teams"],
      ["Community report", "/report"],
    ],
  },
];

/** The foot of every page: where everything is, and the safety promise in one line. */
export function Footer() {
  return (
    <footer className="toolbox pb-tabbar mt-8 bg-workshop-50 text-workshop-800">
      <div className="hazard-tape" aria-hidden="true" />
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-[1.4fr,1fr,1fr,1fr]">
        <div>
          <p className="display flex items-center gap-2.5 text-2xl text-workshop-900">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
              <Icon name="wrench" size={19} />
            </span>
            <span>
              Fix<span className="text-brand-500">It</span>
            </span>
          </p>
          <p className="mt-3 max-w-sm text-sm">
            Check if a repair is safe, follow a guide, or find someone who can fix it. Free, no
            account, and your repair log never leaves your device.
          </p>
          <p className="mt-4 flex max-w-sm gap-2 rounded-card border border-danger/40 bg-danger/10 p-3 text-sm text-workshop-900">
            <Icon name="stop" size={18} className="mt-0.5 text-danger" />
            FixIt never gives do-it-yourself steps for dangerous repairs like gas, wiring, brakes or
            swollen batteries.
          </p>
        </div>
        {COLUMNS.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <p className="text-xs font-bold uppercase tracking-widest text-workshop-600">{column.title}</p>
            <ul className="mt-3 space-y-2 text-sm">
              {column.links.map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="font-medium text-workshop-900 hover:text-brand-700 hover:underline">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-workshop-200">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-workshop-600">
          Guides and cost estimates were written for this project and have not been reviewed by a
          tradesperson. Map data © OpenStreetMap contributors. 3D models by Kenney and Poly Haven (CC0).
        </p>
      </div>
    </footer>
  );
}
