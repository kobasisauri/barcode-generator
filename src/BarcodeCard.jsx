import { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";

export default function BarcodeCard({ code, logo }) {
  const barcodeRef = useRef(null);

  useEffect(() => {
    if (barcodeRef.current) {
      try {
        JsBarcode(barcodeRef.current, code, {
          format: "CODE128",
          width: 2,
          height: 80,
          displayValue: false,
        });
      } catch (err) {
        console.error("Error generating barcode:", err);
      }
    }
  }, [code]);

  return (
    <div className="code-card">
      <img src={logo} alt="Shtrix Logo" className="code-logo" />
      <svg ref={barcodeRef} className="barcode-svg"></svg>
      <div className="code-text">{code}</div>
    </div>
  );
}
