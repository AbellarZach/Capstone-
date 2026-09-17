import KpHeader from "./KpHeader";

/* ------------------------------------------------------------------ */
/*  KP Form 8 — NOTICE OF HEARING (MEDIATION PROCEEDINGS)             */
/*  Page 2 of the 4-page summon packet.                               */
/* ------------------------------------------------------------------ */

function Line({ className }: { className?: string }) {
  return <span className={`kp-line ${className ?? ""}`} />;
}

export default function KpForm8() {
  return (
    <div className="kp-page">
      <img
        src="/barangaylogo.jpg"
        alt=""
        aria-hidden="true"
        className="kp-watermark"
      />

      <KpHeader formNumber="8" />

      <h3 className="kp-form-title">
        NOTICE OF HEARING<br />
        <span className="kp-form-subtitle">(MEDIATION PROCEEDINGS)</span>
      </h3>

      {/* TO: Complainant/s */}
      <div className="kp-mt">
        <div className="kp-sig-wrap">
          <p className="kp-text-left">
            TO: &nbsp;
          <Line className="kp-w-40" />
          </p>
            <Line className="kp-w-40" />
          <p className="kp-field-under">Complainant/s</p>

        </div>
      </div>
      <br> 
      </br>
      <br> 
      </br>
      {/* Body */}
      <div className="kp-body-text kp-mt">
        <p className="kp-justify">
        You  are  here  by  required  to  appear  before  me  on  the {" "}
          <Line className="kp-w-10" /> day  of   <Line className="kp-w-30" />{" "}
          , 20  <Line className="kp-w-05" /> at{" "}
          <Line className="kp-w-10" />  o&apos; clock in the morning/afternoon
          for the hearing of your complaint.
        </p>
      </div>
      <br>
      </br>
      {/* Date issued */}
      <p className="kp-mt kp-indent">
        This <Line className="kp-w-10" /> day of <Line className="kp-w-15" />{" "}
        , 20<Line className="kp-w-05" />.
      </p>
      <br>
      </br>
      <br>
      </br>
      {/* Chairman signature */}
      <div className="kp-sig-block kp-sig-right kp-mt-lg">
        <div className="kp-sig-wrap">
          <Line className="kp-w-40" />
          <p className="kp-sig-label">NICOLAS C. ANTIPUESTO</p>
          <p className="kp-sig-sublabel">Punong Barangay/Lupon Chairman</p>
        </div>
      </div>
      <br>
      </br>
      <br>
      </br>
      {/* Notified */}
      <div className="kp-mt-lg">
        <p>
          Notified this <Line className="kp-w-10" /> day of{" "}
          <Line className="kp-w-15" />, 20<Line className="kp-w-05" />.
        </p>
      </div>
      <br>
      </br>
      {/* Complainant signatures */}
      <div className="kp-sig-block kp-sig-right kp-mt-lg">
        <div className="kp-sig-wrap">
          <div className="kp-blank-lines">
            <p className="kp-field-under">Complainant/</p>
            <Line className="kp-w-40" /><br />
            <Line className="kp-w-40" />
          </div>
        </div>
      </div>
    </div>
  );
}
