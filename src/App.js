import { useState } from "react";

function App() {

  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };


  const handleUpload = async () => {
  if (!file) {
    setUploadMessage("❌ Please select a file first");
    return;
  }
    const formData = new FormData();
    formData.append("file", file);


    await fetch("https://resume-analyzer-backend-2-xc71.onrender.com/upload", {
      method: "POST",
      body: formData,
    });
    setUploadMessage("Resume uploaded successfully!");
    setTimeout(() => {
      setUploadMessage("");
    }, 3000);
  };
  const handleMatch = async () => {
      if (!jobDesc || !jobDesc.trim()) {
          setError("❌ Please enter job description");
          return;
      }
      setError("");
      try {
          const response = await fetch("https://resume-analyzer-backend-2-xc71.onrender.com/match", {
            method: "POST",
            headers: {
              "Content-Type": "text/plain",
            },
            body: jobDesc,
          });

          const data = await response.json();
          setResult(data);
        } catch (err) {
          console.error(err);
          setError("❌ Something went wrong");
        }
    };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1e1e2f, #2c2c54)",
      fontFamily: "Arial",
      padding: "40px"
    }}>

      {/* HEADER */}
      <h1 style={{
        textAlign: "center",
        color: "white",
        marginBottom: "30px"
      }}>
        🚀 AI Resume Analyzer
      </h1>

      <div style={{
        display: "flex",
        gap: "20px",
        justifyContent: "center"
      }}>

        {/* LEFT PANEL */}
        <div style={{
          width: "400px",
          background: "#fff",
          padding: "25px",
          borderRadius: "15px",
          boxShadow: "0 20px 50px rgba(0,0,0,0.1)"
        }}>

          <h3 style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "18px",
            marginBottom: "10px",
            color: "#222"
          }}>
            📂 <span style={{ fontWeight: "bold" }}>Upload Resume</span>
          </h3>

          {uploadMessage && (
            <p style={{ color: "green", fontWeight: "bold" }}>
              {uploadMessage}
            </p>
          )}

          <input type="file" onChange={handleFileChange} />

          <br /><br />

          <button
            onClick={handleUpload}
              onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
              onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
            style={{
              width: "100%",
              padding: "10px",
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            Upload Resume
          </button>

          <br /><br />

          <h3 style={{
           display: "flex",
           alignItems: "center",
           gap: "8px",
           fontSize: "18px",
           marginBottom: "10px",
           color: "#222"
           }}>
          📝 <span style={{ fontWeight: "bold" }}>Job Description</span>
        </h3>

          <textarea
            rows="4"
            placeholder="e.g. Backend Developer or Java, Spring Boot..."
            value={jobDesc}
            onChange={(e) => {
                setJobDesc(e.target.value);
                setError(""); // typing start → error remove
              }}
            style={{
              width: "100%",
              padding: "10px",
              background: "#f9f9f9",
              borderRadius: "8px",
              border: "1px solid #ccc"
            }}
          />
          {error && (
            <p style={{ color: "red", fontWeight: "bold" }}>
              {error}
            </p>
          )}
          <br /><br />

          <button
            onClick={handleMatch}
              onMouseEnter={(e) => e.target.style.transform = "scale(1.05)"}
              onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
            style={{
              width: "100%",
              padding: "10px",
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            🔍 Analyze Match
          </button>

        </div>

        {/* RIGHT PANEL (RESULT) */}
        <div style={{
          width: "500px",
          background: "#fff",
          padding: "25px",
          borderRadius: "15px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
        }}>
        <h3 style={{
         display: "flex",
         alignItems: "center",
         gap: "8px",
         fontSize: "18px",
         marginBottom: "10px",
         color: "#222"
         }}>
        📊 <span style={{ fontWeight: "bold" }}>Analysis Result</span>
         </h3>

          {result ? (
            <>

              <h2>Match Score: {result.matchScore}%</h2>

              {/* Progress Bar */}
              <div style={{
                height: "12px",
                background: "#ddd",
                borderRadius: "10px",
                overflow: "hidden",
                marginBottom: "15px"
              }}>
                <div style={{
                  width: `${result.matchScore}%`,
                  background: "#4caf50",
                  height: "100%"
                }}></div>
              </div>

              {/* Role */}
              {result.detectedRole && (
                <p style={{
                  background: "#e3f2fd",
                  padding: "8px",
                  borderRadius: "6px",
                  color: "#1976d2",
                  fontWeight: "bold"
                }}>
                  🎯 Role: {result.detectedRole}
                </p>
              )}

              <h4>✅ Matched Skills</h4>
              <ul>
                {result.matchedSkills.map((s, i) => (
                  <li key={i} style={{ color: "green" }}>✔ {s}</li>
                ))}
              </ul>

              <h4>❌ Missing Skills</h4>
              <ul>
                {result.missingSkills.map((s, i) => (
                  <li key={i} style={{ color: "red" }}>✖ {s}</li>
                ))}
              </ul>

              <h4>💡 Suggestions</h4>
              <p>{result.suggestions}</p>

            </>
          ) : (
            <p style={{
              textAlign: "center",
              color: "#666",
              marginTop: "50px"
            }}>
              🚀 Upload your resume and analyze job match instantly!
            </p>
          )}

        </div>

      </div>
    </div>
  );
}

export default App;