import React, { useState } from "react";
import "./genimation.css";
import { saveAs } from "file-saver";

const Genimation = () => {
  const [input, setInput] = useState("");
  const [videoUrl, setVideoUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!input) {
      alert("⚠ Please enter a description!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/generate-video`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await response.json();

      if (response.ok && data.video_url) {
        setVideoUrl(data.video_url);
      } else {
        alert("❌ Error generating video.");
      }
    } catch (error) {
      console.error("❌ Fetch error:", error);
      alert("⚠ Failed to connect to server.");
    }

    setLoading(false);
  };

  const handleDownload = async () => {
    if (!videoUrl) {
      alert("⚠ Video not ready for download.");
      return;
    }

    try {
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      const fileExtension = videoUrl.split(".").pop(); // Get file extension
      saveAs(blob, `generated-video.${fileExtension}`);
    } catch (error) {
      console.error("❌ Download error:", error);
      alert("⚠ Failed to download video.");
    }
  };

  return (
    <section className="dynamic-component">
      <div className="icon">
        {videoUrl ? (
          <div className="output-section">
            <video src={videoUrl} controls></video>
            <button className="button download" onClick={handleDownload}>
              ⬇ Download Video
            </button>
          </div>
        ) : (
          <i className="bx bxs-video"></i>
        )}
      </div>
      <div className="input-section genimation">
        <input
          type="text"
          className="prompt"
          placeholder="Describe your idea..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="button generate" onClick={handleGenerate} disabled={loading}>
          {loading ? "⏳ Generating..." : "🎥 Generate!"}
        </button>
      </div>
    </section>
  );
};

export default Genimation;