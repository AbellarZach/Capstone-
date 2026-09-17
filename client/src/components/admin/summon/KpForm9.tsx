import KpHeader from "./KpHeader";

/* ------------------------------------------------------------------ */
/*  KP Form 9 — SUMMONS  (blank, for print + handwriting)             */
/*  Page 3 of the 4-page summon packet.                               */
/* ------------------------------------------------------------------ */

function Line({ className }: { className?: string }) {
  return <span className={`kp-line ${className ?? ""}`} />;
}

export default function KpForm9() {
  return (
    <div className="kp-page">
      <img
        src="/barangaylogo.jpg"
        alt=""
        aria-hidden="true"
        className="kp-watermark"
      />

      <KpHeader formNumber="9" />

      {/* Case header: Complainant / Case No / -against- / Respondent */}
      <div className="kp-case-header">
        <div className="kp-case-row">
          <div className="kp-case-left">
            <Line className="kp-w-40" />
            <p className="kp-field-under">Complainant/s</p>
            <Line className="kp-w-40" />
          </div>
          <div className="kp-case-right">
            <p>
              Barangay Case No. <Line className="kp-w-25" />
            </p>
            <div className="kp-case-for-row">
              <span>For: </span>
              <Line className="kp-case-for-fill" />
            </div>
            <p>
              <Line className="kp-w-40" />
            </p>
            <p>
              <Line className="kp-w-40" />
            </p>
          </div>
        </div>
        <p className="kp-case-vs">-against-</p>
        /
        <Line className="kp-w-40" />
        <div className="kp-case-left">
          <Line className="kp-w-40" />
          <p className="kp-field-under">Respondent/s</p>
        </div>
      </div>

      {/* SUMMONS title */}
      <p className="kp-body-heading">S U M M O N S</p>

      {/* TO: Respondent/s — two lines side by side, label under first */}
      <div className="kp-mt">
        <div className="kp-case-row">
          <div className="kp-sig-wrap">
            <p className="kp-text-left">
              TO: &nbsp;
              <Line className="kp-w-40" />
            </p>
            <p className="kp-field-under">Respondent/s</p>
          </div>
          <div>
            <Line className="kp-w-40" />
          </div>
        </div>
      </div>

      {/* Body paragraph 1 */}
      <div className="kp-body-text kp-mt">
        <p>
          You are hereby summoned to appear before me in person, together with
          your witnesses, on the <Line className="kp-w-10" /> day of{" "}
          <Line className="kp-w-30" />, 20<Line className="kp-w-05" /> at{" "}
          <Line className="kp-w-10" /> o&apos;clock in the morning/afternoon,
          then and there to answer to a complaint made before me, copy of which
          is attached hereto, for mediation/conciliation of your dispute with
          complainant/s.
        </p>
      </div>

      {/* Body paragraph 2 */}
      <div className="kp-body-text kp-mt">
        <p>
          You are hereby warned that if you refuse or willfully fail to appear
          in obedience to this summons, you may be barred from filing any
          counterclaim arising from said complaint.
        </p>
      </div>

      {/* Fail not warning */}
      <p className="kp-mt kp-center">
        FAIL NOT or else face punishment as for contempt of court.
      </p>

      {/* Date */}
      <p className="kp-mt kp-indent">
        This <Line className="kp-w-10" /> day of <Line className="kp-w-30" />, 20<Line className="kp-w-05" />.
      </p>

      {/* Chairman signature */}
      <div className="kp-sig-block kp-sig-right kp-mt-lg">
        <div className="kp-sig-wrap">
          <Line className="kp-w-40" />
          <p className="kp-sig-label">NICOLAS C. ANTIPUESTO</p>
          <p className="kp-sig-sublabel">Punong Barangay /Lupon Chairman</p>
        </div>
      </div>
    </div>
  );
}
