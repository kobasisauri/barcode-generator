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

  const handleDownload = () => {
    if (generatedCodes.length === 0) {
      alert("No codes to download! Generate codes first.");
      return;
    }

    const csvContent = generatedCodes.join("\n");
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(csvContent)
    );
    element.setAttribute(
      "download",
      `shtrix-codes-${generatedCodes[0]}-to-${
        generatedCodes[generatedCodes.length - 1]
      }.txt`
    );
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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
            <button onClick={handleDownload} className="btn-download">
              Download as TXT
            </button>
          )}
        </div>
      </div>

      {generatedCodes.length > 0 && (
        <div className="output-section">
          <div className="stats">
            <p>
              Total codes generated: <strong>{generatedCodes.length}</strong>
            </p>
            <p>
              From: <strong>{generatedCodes[0]}</strong> To:{" "}
              <strong>{generatedCodes[generatedCodes.length - 1]}</strong>
            </p>
          </div>

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
