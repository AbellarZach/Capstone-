import KpForm7 from "./KpForm7";
import KpForm8 from "./KpForm8";
import KpForm9 from "./KpForm9";
import KpForm9Back from "./KpForm9Back";

/* ------------------------------------------------------------------ */
/*  SummonPaper — renders all 4 KP pages in sequence.                  */
/*  Each .kp-page is exactly one Letter-sized page when printed.       */
/* ------------------------------------------------------------------ */

export default function SummonPaper() {
  return (
    <>
      {/* Page 1 */}
      <KpForm7 />

      {/* Page 2 */}
      <KpForm8 />

      {/* Page 3 */}
      <KpForm9 />

      {/* Page 4 */}
      <KpForm9Back />
    </>
  );
}
