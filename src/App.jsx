import { useState } from "react";
import logo from "./assets/logo.png";
import "./App.css";
import BarcodeCard from "./BarcodeCard";

export default function App() {
  const [startCode, setStartCode] = useState("A00000");
  const [quantity, setQuantity] = useState(10);
  const [generatedCodes, setGeneratedCodes] = useState([]);

  // Function to increment a 6-character code
  const incrementCode = (code) => {
    // Extract the letter and number parts
    const letter = code[0];
    const number = parseInt(code.slice(1), 10);

    if (number < 99999) {
      const newNumber = (number + 1).toString().padStart(5, "0");
      return letter + newNumber;
    }

    // If we overflow, go to next letter
    const nextLetter = String.fromCharCode(letter.charCodeAt(0) + 1);
    if (nextLetter <= "Z") {
      return nextLetter + "00000";
    }

    return code; // Keep same if overflow
  };

  // Function to validate 6-character code
  const isValidCode = (code) => {
    return /^[A-Z]\d{5}$/.test(code);
  };

  const handleGenerate = () => {
    const upperCode = startCode.toUpperCase();

    if (!isValidCode(upperCode)) {
      alert("Invalid code format! Use format like: A00000, B12345, Z99999");
      return;
    }

    if (quantity < 1 || quantity > 10000) {
      alert("Quantity must be between 1 and 10000");
      return;
    }

    const codes = [];
    let currentCode = upperCode;

    for (let i = 0; i < quantity; i++) {
      codes.push(currentCode);
      currentCode = incrementCode(currentCode);
    }

    setGeneratedCodes(codes);
  };

  const handlePrintPage = () => {
    if (generatedCodes.length === 0) {
      alert("No codes to print! Generate codes first.");
      return;
    }

    const printWindow = window.open("", "_blank");
    const codesHTML = generatedCodes
      .map((code, index) => {
        return `
        <div class="code-card">
          <img src="${logo}" alt="Logo" class="code-logo" />
          <svg id="barcode-${index}" class="barcode-svg"></svg>
          <div class="code-text">${code}</div>
        </div>
      `;
      })
      .join("");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Shtrix Codes - Print</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; background: white; padding: 20px; }
          .codes-container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(5cm, 1fr));
            gap: 20px;
          }
          .code-card {
            width: 5cm;
            height: 2.5cm;
            background: white;
            text-align: center;
            page-break-inside: avoid;
            break-inside: avoid;
          }
          .code-logo {
            width: 100%;
            height: auto;
            max-height: 120px;
            object-fit: contain;
            border-radius: 4px;
          }
          .barcode-svg {
            width: 100%;
            height: 46px;
            display: block;
          }
          .code-text {
            font-size: 12px;
            font-weight: bold;
            color: #000;
            letter-spacing: 2px;
            font-family: "Courier New", monospace;
            word-break: break-all;
          }
          @media print {
            body { margin: 0; padding: 10mm; }
            .code-card { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="codes-container">
          ${codesHTML}
        </div>
        <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
        <script>
          const codes = ${JSON.stringify(generatedCodes)};
          codes.forEach((code, index) => {
            try {
              JsBarcode("#barcode-" + index, code, {
                format: "CODE128",
                width: 2,
                height: 45,
                displayValue: false,
              });
            } catch(e) { console.error("Error:", e); }
          });
          setTimeout(() => window.print(), 800);
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Shtrix Code Generator</h1>
      </div>

      <div className="input-section">
        <div className="input-group">
          <label htmlFor="startCode">Starting Code:</label>
          <input
            id="startCode"
            type="text"
            value={startCode}
            onChange={(e) => setStartCode(e.target.value.toUpperCase())}
            placeholder="e.g., A00000"
            maxLength="6"
          />
          <small>Format: Letter + 5 digits (e.g., B00201)</small>
        </div>

        <div className="input-group">
          <label htmlFor="quantity">Quantity to Generate:</label>
          <input
            id="quantity"
            type="number"
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.max(1, parseInt(e.target.value) || 1))
            }
            placeholder="10"
            min="1"
            max="10000"
          />
          <small>Max 10,000 codes</small>
        </div>

        <div className="button-group">
          <button onClick={handleGenerate} className="btn-generate">
            Generate Codes
          </button>
          {generatedCodes.length > 0 && (
            <div className="button-group">
              <button onClick={handlePrintPage} className="btn-print">
                Print on New Page
              </button>
            </div>
          )}
        </div>
      </div>

      {generatedCodes.length > 0 && (
        <div className="output-section">
          <div className="codes-container">
            {generatedCodes.map((code, index) => (
              <BarcodeCard key={index} code={code} logo={logo} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
