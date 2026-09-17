import KpHeader from "./KpHeader";

/* ------------------------------------------------------------------ */
/*  KP Form 7 — COMPLAINT  (blank, for print + handwriting)           */
/*  Page 1 of the 4-page summon packet.                               */
/* ------------------------------------------------------------------ */

function Line({ className }: { className?: string }) {
  return <span className={`kp-line ${className ?? ""}`} />;
}

export default function KpForm7() {
  return (
    <div className="kp-page">
      <img
        src="/barangaylogo.jpg"
        alt=""
        aria-hidden="true"
        className="kp-watermark"
      />

      <KpHeader formNumber="7" />

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
        <Line className="kp-w-40" />


        <div className="kp-case-left">
          <p className="kp-field-under">Respondent/s</p>
          <Line className="kp-w-40" />
        </div>
      </div>

      {/* COMPLAINT title */}
      <p className="kp-body-heading">C O M P L A I N T</p>

      {/* Complaint paragraph + 3 ruled lines */}
      <div className="kp-body-text">
        <p className="kp-justify">
          I/WE hereby complain against above named respondent/s for violating
          my/our rights and interests in the following manner:
        </p>
        <div className="kp-blank-lines">
          <Line className="kp-w-full" /><br />
          <Line className="kp-w-full" /><br />
          <Line className="kp-w-full" />
        </div>
      </div>

      {/* THEREFORE paragraph (centered) + 2 ruled lines */}
      <div className="kp-body-text kp-mt kp-center">
        <p>
          THEREFORE, I/WE pray that the following relief/s be granted to me/us
          in accordance with law and/or equity.
        </p>
      </div>
      <div className="kp-blank-lines">
        <Line className="kp-w-full" /><br />
        <Line className="kp-w-full" />
      </div>

      {/* Date made */}
      <p className="kp-mt kp-indent">
        Made this <Line className="kp-w-10" /> day of <Line className="kp-w-30" />, 20<Line className="kp-w-05" />.
      </p>

      {/* Complainant signature */}
      <div className="kp-sig-block kp-sig-right kp-mt-lg">
        <div className="kp-sig-wrap">
          <Line className="kp-w-40" />
          <p className="kp-field-under">(Complainant/s)</p>
        </div>
      </div>

      {/* Received and filed */}
      <div className="kp-mt-lg">
        <p>
          Received and filed this <Line className="kp-w-10" /> day of{" "}
          <Line className="kp-w-30" />, 20<Line className="kp-w-05" />.
        </p>
      </div>

      {/* Chairman signature */}
      <div className="kp-sig-block kp-sig-right kp-mt">
        <div className="kp-sig-wrap">
          <Line className="kp-w-40" />
          <p className="kp-sig-label">NICOLAS C. ANTIPUESTO</p>
          <p className="kp-sig-sublabel">Punong Barangay/Lupon Chairman</p>
        </div>
      </div>
    </div>
  );
}
