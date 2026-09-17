import KpHeader from "./KpHeader";

/* ------------------------------------------------------------------ */
/*  KP Form 9 — Page 2 : OFFICER'S RETURN  (blank, for handwriting)   */
/*  Page 4 of the 4-page summon packet.                               */
/* ------------------------------------------------------------------ */

function Line({ className }: { className?: string }) {
  return <span className={`kp-line ${className ?? ""}`} />;
}

export default function KpForm9Back() {
  return (
    <div className="kp-page">
      <img
        src="/barangaylogo.jpg"
        alt=""
        aria-hidden="true"
        className="kp-watermark"
      />

      <KpHeader formNumber="9" sub="Page 2" />

      <h3 className="kp-form-title">OFFICER&apos;S RETURN</h3>

      {/* Body: service details */}
      <div className="kp-body-text">
        <p className="kp-justify">
          I served this summons upon respondent{" "}
          <Line className="kp-w-30" /> on the <Line className="kp-w-10" />{" "}
          day of <Line className="kp-w-10" />, 20<Line className="kp-w-10" />{" "}
          and upon respondent <Line className="kp-w-15" /> on the{" "}
          <Line className="kp-w-10" /> day of <Line className="kp-w-15" />{" "}
          , 20<Line className="kp-w-05" />(Write name/s of respondent/s before mode by which he/they was/were
          served.)
        </p>
        
      </div>
      <br>
      </br>      
      {/* Respondent/s label */}
      <p className="kp-label-block">
        Respondent/s:
      </p>

      {/* 4 modes of service */}
      <div className="kp-service-modes">
        <p>
          <Line className="kp-w-15" /><span className="kp-service-num">1. </span>{" "} 
          <div className="kp-p">handing to him/them said summons and person.<br></br>or</div>
        </p>
        <p>
          <Line className="kp-w-15" /><span className="kp-service-num">2.</span>{" "}
          <div className="kp-p">handing to him/them said summons and he/they<br></br> refused to serve it, or</div>
        </p>
        <p>
          <Line className="kp-w-15" /><span className="kp-service-num">3.</span>{" "}
          <div className="kp-p">leaving said summons at his/her dwelling <br></br> with <Line className="kp-w-30"/> <br></br> 
          a person of suitable age and discretion residing <br></br> therein, or</div>
        </p>
        <p>
          <Line className="kp-w-15" /><span className="kp-service-num">4.</span>{" "}
          <div className="kp-p">leaving said summons at his/her office/place of <br></br> business with{" "}
          <Line className="kp-w-30" /> <br></br> a competent person in charge
          thereof</div>
        </p>
      </div>
      <br>
      </br>

      {/* Officer signature */}
      <div className="kp-sig-block kp-sig-right kp-mt-lg">
        <Line className="kp-w-30" />
        <p className="kp-sig-label">Officer</p>
      </div>

      {/* Received by respondent */}
      <div className="kp-mt-lg">
        <p className="kp-bold">
          Received by Respondent/s/representative/s:
        </p>
        <div className="kp-received-grid kp-mt">
          <div className="kp-received-row">
            <div className="kp-sig-wrap">
              <Line className="kp-w-40" />
              <p className="kp-field-under">(Signature)</p>
            </div>
            <div className="kp-sig-wrap kp-ml">
              <Line className="kp-w-30" />
              <p className="kp-field-under">(Date)</p>
            </div>
          </div>
          <div className="kp-received-row">
            <div className="kp-sig-wrap">
              <Line className="kp-w-40" />
              <p className="kp-field-under">(Signature)</p>
            </div>
            <div className="kp-sig-wrap kp-ml">
              <Line className="kp-w-30" />
              <p className="kp-field-under">(Date)</p>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
}
