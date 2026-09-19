"use client";

import { useState } from "react";
import { MaterialIcon } from "./MaterialIcon";

/* ------------------------------------------------------------------ */
/*  PrintButton — reusable admin print trigger.                        */
/*  Waits for fonts + images inside the printable area to finish       */
/*  loading so Print Preview is never blank, then calls window.print() */
/*  with a double requestAnimationFrame to ensure React has painted.   */
/*  The button itself never appears in print (no-print).               */
/* ------------------------------------------------------------------ */

function waitForImages(container: ParentNode | null): Promise<void> {
  if (typeof document === "undefined") return Promise.resolve();
  const root: ParentNode = container ?? document;
  const imgs = Array.from(root.querySelectorAll("img"));
  if (imgs.length === 0) return Promise.resolve();
  return Promise.all(
    imgs.map((img) => {
      const el = img as HTMLImageElement;
      if (el.complete && el.naturalWidth > 0) return Promise.resolve();
      return new Promise<void>((resolve) => {
        const done = () => resolve();
        el.addEventListener("load", done, { once: true });
        el.addEventListener("error", done, { once: true });
        // Safety timeout so a broken image never blocks printing.
        window.setTimeout(done, 2500);
      });
    })
  ).then(() => undefined);
}

export async function printCurrentPage(
  printableSelector = ".printable-content"
): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    // Ensure webfonts are ready so text renders in the print output.
    if (document.fonts?.ready) {
      await Promise.race([
        document.fonts.ready,
        new Promise((r) => window.setTimeout(r, 1500)),
      ]);
    }
    // Ensure images/templates inside the printable area are loaded.
    const container = document.querySelector(printableSelector);
    await waitForImages((container ?? document) as unknown as ParentNode);
    // Let React finish painting before opening the print dialog.
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });
  } catch {
    // Never block printing on readiness failures.
  }
  window.print();
}

interface PrintButtonProps {
  label?: string;
  className?: string;
  printableSelector?: string;
}

export function PrintButton({
  label = "PRINT",
  className = "btn btn-primary btn-lg min-w-[140px]",
  printableSelector = ".printable-content",
}: PrintButtonProps) {
  const [printing, setPrinting] = useState(false);

  const handleClick = async () => {
    if (printing) return;
    setPrinting(true);
    try {
      await printCurrentPage(printableSelector);
    } finally {
      setPrinting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={printing}
      className={`no-print ${className}`}
    >
      <MaterialIcon name="print" />
      {printing ? "PREPARING..." : label}
    </button>
  );
}
