import Image from "next/image";

/* ------------------------------------------------------------------ */
/*  KpHeader — reusable top block for every KP form page              */
/*  Props: formNumber (e.g. "7")                                      */
/* ------------------------------------------------------------------ */

interface KpHeaderProps {
  formNumber: string;
  sub?: string;
}

export default function KpHeader({ formNumber: num, sub }: KpHeaderProps) {
  return (
    <div className="kp-header">
      {/* Form number — top left */}
      <div className="kp-form-number">
        KP Form No. {num}
        {sub ? (
          <>
            <br />
            {sub}
          </>
        ) : null}
      </div>

      {/* Logo left + address right (side-by-side, like the paper form) */}
      <div className="kp-center-block">
        <Image
          src="/barangaylogo.jpg"
          alt="Barangay Gabi Official Seal"
          width={90}
          height={90}
          className="kp-logo"
          priority
        />
        <div className="kp-address">
          <p className="kp-republic">Republic of the Philippines</p>
          <p>Province of Cebu</p>
          <p>Municipality of Cordova</p>
          <p className="kp-barangay">BARANGAY GABI</p>
        </div>
      </div>

      <p className="kp-office-title">
       OFFICE OF THE LUPONG TAGAPAMAYAPA
      </p>
      {/* Double rule */}
      <div className="kp-double-rule" />

      {/* Office title */}

    </div>
  );
}
