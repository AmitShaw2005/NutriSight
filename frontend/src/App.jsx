import { useState } from "react";
import {
  Camera,
  Upload,
  FileText,
  Loader2,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Sparkles,
  Info
} from "lucide-react";
import "./App.css";

function App() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [textInput, setTextInput] = useState("");
  const [confidence, setConfidence] = useState(null);

  const analyzeImage = async (file) => {
    setLoading(true);
    setResult(null);
    setConfidence("Medium (image-based)");

    const formData = new FormData();
    formData.append("label", file);

    const res = await fetch("http://localhost:5000/analyze", {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  const analyzeText = async () => {
    if (!textInput.trim()) return;

    setLoading(true);
    setResult(null);
    setImagePreview(null);
    setConfidence("High (ingredient text)");

    const res = await fetch("http://localhost:5000/analyze-text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: textInput })
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="app">
      {/* HEADER */}
      <header className="header">
        <h1>
          NutriSight <Sparkles size={20} />
        </h1>
        <p>Your AI co-pilot for food decisions</p>
      </header>

      {/* INPUT SECTION */}
      <section className="input-section">
        <div className="card">
          <h3>📸 Image Input</h3>

          <input
            type="file"
            accept="image/*"
            capture="environment"
            id="camera"
            hidden
            onChange={(e) => {
              const file = e.target.files[0];
              setImagePreview(URL.createObjectURL(file));
              analyzeImage(file);
            }}
          />

          <input
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            id="upload"
            hidden
            onChange={(e) => {
              const file = e.target.files[0];
              setImagePreview(URL.createObjectURL(file));
              analyzeImage(file);
            }}
          />

          <div className="btn-group">
            <label htmlFor="camera" className="btn">
              <Camera size={18} /> Use Camera
            </label>
            <label htmlFor="upload" className="btn secondary">
              <Upload size={18} /> Upload Image
            </label>
          </div>

          <small>Supports JPG, PNG, WEBP</small>

          {imagePreview && (
            <img src={imagePreview} alt="preview" className="preview" />
          )}
        </div>

        <div className="card">
          <h3>📝 Text Input</h3>

          <textarea
            placeholder="Enter product name or ingredient list (e.g. Strawberry Ice Cream, Sugar, Palm Oil, E621)"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
          />

          <button className="btn primary" onClick={analyzeText}>
            <FileText size={18} /> Analyze Text
          </button>
        </div>
      </section>

      {/* LOADING */}
      {loading && (
        <div className="loading">
          <Loader2 size={40} className="spin" />
          <p>🧠 Reasoning from uncertainty → clarity</p>
        </div>
      )}

      {/* RESULT */}
      {result && (
  <section className="analysis-layout">
    
    {/* LEFT: IMAGE PREVIEW */}
    <div className="analysis-image">
      {imagePreview ? (
        <img src={imagePreview} alt="Uploaded food" />
      ) : (
        <div className="image-placeholder">
          No image provided
        </div>
      )}
    </div>

    {/* RIGHT: AI OUTPUT */}
    <div className={`analysis-result ${result.verdict?.toLowerCase()}`}>
      
      <div className="verdict">
        {result.verdict === "Green" && <CheckCircle size={36} />}
        {result.verdict === "Yellow" && <AlertTriangle size={36} />}
        {result.verdict === "Red" && <XCircle size={36} />}
        <div>
          <h2>{result.verdict} — {result.product_name}</h2>
          <span className="confidence">
            <Info size={14} /> Confidence: {confidence}
          </span>
        </div>
      </div>

      <div className="intent">
        <small>AI INFERRED YOU CARE ABOUT</small>
        <p>{result.inferred_intent}</p>
      </div>

      <p className="reasoning">{result.reasoning}</p>

      <div className="insights">
        <h4>Key Insights</h4>
        <ul>
          {result.key_insights.map((i, idx) => (
            <li key={idx}>• {i}</li>
          ))}
        </ul>
      </div>

    </div>
  </section>
)}


      <footer>
        ⚡ AI-native · Intent-first · Honest explanations
      </footer>
    </div>
  );
}

export default App;
