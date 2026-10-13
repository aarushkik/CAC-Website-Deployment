"use client";

import { useState } from "react";
import { SAFETY_QUESTIONS } from "@/lib/safety";
import { Button } from "./Button";
import { Icon } from "./Icon";

/** What each "yes" in the safety check means, said the way you would say it on the phone. */
const SAID: Record<string, string> = {
  burning: "There is a burning smell, smoke, or scorch marks.",
  gas: "There is a gas smell, or it runs on gas.",
  "high-voltage": "It involves mains wiring or high voltage.",
  "battery-swelling": "The battery is swollen, leaking, or very hot.",
  structural: "It holds weight or keeps people safe.",
  water: "There is water or a leak near it.",
  unsure: "I do not know how it comes apart, and I have not opened it.",
};

/**
 * For a red result: a short note to read out or text to a repair shop, built
 * from the item and the safety answers. Nothing is sent anywhere, the user
 * copies or shares it.
 */
export function CallScript({ itemName, issue, flags }: { itemName: string; issue: string; flags: string[] }) {
  const [copied, setCopied] = useState(false);
  const signs = SAFETY_QUESTIONS.filter((q) => flags.includes(q.id)).map((q) => SAID[q.id] ?? q.text);
  const lines = [
    `Hi, I need help with a repair: ${itemName.toLowerCase()}.`,
    issue ? `What is happening: ${issue}` : "",
    ...signs,
    "I have not taken it apart. Can you look at it, and what would a check cost?",
  ].filter(Boolean);
  const text = lines.join("\n");

  async function share() {
    try {
      if (navigator.share) {
        await navigator.share({ text });
        return;
      }
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="mt-6 rounded-card border border-workshop-200 bg-surface p-5 shadow-card sm:p-6">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-workshop-900">
        <Icon name="phone" className="text-brand-700" />
        What to say when you call
      </h2>
      <p className="mt-1 text-sm text-workshop-800">
        Read this out or send it as a message. Add the brand and model if you can see them.
      </p>
      <blockquote className="mt-3 space-y-1.5 rounded-card border-l-4 border-brand-400 bg-workshop-100 p-4 text-workshop-900">
        {lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </blockquote>
      <Button variant="secondary" onClick={share} className="mt-4">
        <Icon name={copied ? "check" : "share"} size={18} />
        {copied ? "Copied" : "Copy or share this"}
      </Button>
    </section>
  );
}
