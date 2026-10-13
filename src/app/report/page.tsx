"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Icon } from "@/components/Icon";
import { PageHeader } from "@/components/PageHeader";
import { getCategory, getItem } from "@/lib/data";

interface Report {
  configured: boolean;
  repairs?: number;
  saved?: number;
  lbs?: number;
  categories?: Record<string, number>;
  red?: Record<string, number>;
}

/**
 * The shared numbers on one printable page, for a teacher, a repair cafe or a
 * city council. Everything on it comes from the shared counter.
 */
export default function ReportPage() {
  const [report, setReport] = useState<Report | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetch("/api/community")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setReport)
      .catch(() => setFailed(true));
  }, []);

  const categories = Object.entries(report?.categories ?? {}).sort((a, b) => b[1] - a[1]);
  const most = Math.max(1, ...categories.map(([, n]) => n));
  const red = Object.entries(report?.red ?? {}).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div>
      <PageHeader
        title="Community repair report"
        intro="What people have logged in FixIt, on one page."
      >
        <Button variant="secondary" onClick={() => window.print()} className="no-print">
          <Icon name="printer" size={18} />
          Print or save as PDF
        </Button>
      </PageHeader>

      {failed && <Card>The shared counter did not answer. Try again in a minute.</Card>}
      {report && !report.configured && (
        <Card>
          <p className="font-semibold text-workshop-900">There is no shared counter here yet.</p>
          <p className="mt-1 text-sm text-workshop-800">The report needs the counter database, see the README.</p>
        </Card>
      )}
      {report?.configured && !report.repairs && red.length === 0 && (
        <Card>
          <p className="font-semibold text-workshop-900">Nothing has been logged yet.</p>
          <p className="mt-1 text-sm text-workshop-800">
            This page fills in as people log repairs. Example data on the Impact page is never counted here.
          </p>
        </Card>
      )}

      {report?.configured && (Boolean(report.repairs) || red.length > 0) && (
        <>
          <p className="mb-4 text-sm text-workshop-800">As of {today}.</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              [(report.repairs ?? 0).toLocaleString(), "items fixed instead of replaced"],
              [`$${Math.round(report.saved ?? 0).toLocaleString()}`, "kept in local households"],
              [`${Math.round(report.lbs ?? 0).toLocaleString()} lbs`, "kept out of the landfill"],
            ].map(([number, label]) => (
              <div key={label} className="rounded-card border border-workshop-200 bg-surface p-4 shadow-card">
                <p className="text-2xl font-extrabold text-brand-700 sm:text-3xl">{number}</p>
                <p className="text-sm text-workshop-800">{label}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <Card>
              <h2 className="text-lg font-semibold text-workshop-900">What gets fixed</h2>
              {categories.length === 0 ? (
                <p className="mt-2 text-sm text-workshop-800">No category was given for the repairs so far.</p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {categories.map(([id, count]) => (
                    <li key={id}>
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-workshop-900">{getCategory(id)?.name ?? id}</span>
                        <span className="text-workshop-800">{count}</span>
                      </div>
                      <div className="mt-1 h-2 overflow-hidden rounded-full bg-workshop-100">
                        <div className="h-full rounded-full bg-brand-500" style={{ width: `${(count / most) * 100}%` }} />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card>
              <h2 className="text-lg font-semibold text-workshop-900">Where people were sent to a professional</h2>
              <p className="mt-1 text-sm text-workshop-800">
                How often the safety check came out red, by item. These are repairs people looked up and
                did not attempt.
              </p>
              {red.length === 0 ? (
                <p className="mt-3 text-sm text-workshop-800">No red results counted yet.</p>
              ) : (
                <ol className="mt-3 space-y-1.5">
                  {red.map(([id, count]) => (
                    <li key={id} className="flex justify-between gap-3 border-b border-workshop-200 pb-1.5 text-sm">
                      <span className="text-workshop-900">{getItem(id)?.name ?? id}</span>
                      <span className="font-semibold text-danger">{count}</span>
                    </li>
                  ))}
                </ol>
              )}
            </Card>
          </div>

          <Card className="mt-5">
            <h2 className="text-lg font-semibold text-workshop-900">How to read these numbers</h2>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-workshop-800">
              <li>They are self-reported by people using the app. Nobody checks them and nobody signs in.</li>
              <li>Money saved is the price of a new item minus the cost of the fix, as entered by the person.</li>
              <li>Pounds are the rough weight of the item kept in use, not a measured landfill figure.</li>
              <li>No names, addresses or locations are collected, so there is no breakdown by city.</li>
            </ul>
          </Card>
        </>
      )}
    </div>
  );
}
