import { useState } from "react";

export default function FileProcessor() {
  const [file, setFile] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState("");
  const [downloads, setDownloads] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);

  const uploadFile = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setIsLoading(true);
    setError("");
    setDownloads([]);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const res = await fetch("http://localhost:8000/files/upload", {
        method: "POST",
        body: formData
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!res.ok) {
        throw new Error(`Upload failed: ${res.statusText}`);
      }

      const data = await res.json();
      setJobId(data.job_id);
      setStatus("Processing file...");

      const interval = setInterval(async () => {
        try {
          const statusRes = await fetch(`http://localhost:8000/files/status/${data.job_id}`);

          if (!statusRes.ok) {
            throw new Error(`Status check failed: ${res.statusText}`);
          }

          const statusData = await statusRes.json();
          setStatus(JSON.stringify(statusData, null, 2));

          if (statusData.status === "finished") {
            clearInterval(interval);
            setIsLoading(false);
            setProgress(0);
            const result = statusData.result;

            const links = [
              {
                label: "Original File",
                url: `http://localhost:8000/files/download/${result.object_name}`,
                icon: "📄"
              }
            ];

            if (result.text_object) {
              links.push({
                label: "Extracted Text",
                url: `http://localhost:8000/files/download/${result.text_object}`,
                icon: "📝"
              });
            }

            if (result.thumbnail_object) {
              links.push({
                label: "Thumbnail",
                url: `http://localhost:8000/files/download/${result.thumbnail_object}`,
                icon: "🖼️"
              });
            }

            setDownloads(links);

            // Success notification effect
            document.getElementById('success-toast')?.classList.add('show');
            setTimeout(() => {
              document.getElementById('success-toast')?.classList.remove('show');
            }, 3000);
          }

          if (statusData.status === "error") {
            clearInterval(interval);
            setIsLoading(false);
            setProgress(0);
            setError("Processing failed. Please try again.");
          }
        } catch (err) {
          clearInterval(interval);
          setIsLoading(false);
          setProgress(0);
          setError(`Error checking status: ${err.message}`);
        }
      }, 1000);
    } catch (err) {
      setIsLoading(false);
      setProgress(0);
      setError(`Upload error: ${err.message}`);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setError("");
    setDownloads([]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setError("");
      setDownloads([]);
    }
  };

  const resetForm = () => {
    setFile(null);
    setJobId(null);
    setStatus("");
    setDownloads([]);
    setError("");
    setIsLoading(false);
    setProgress(0);
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = "";
  };

  const getFileIcon = (filename) => {
    if (!filename) return "📄";
    const ext = filename.split('.').pop()?.toLowerCase();
    const icons = {
      pdf: "📕",
      doc: "📘",
      docx: "📘",
      txt: "📄",
      jpg: "🖼️",
      jpeg: "🖼️",
      png: "🖼️",
      gif: "🖼️"
    };
    return icons[ext] || "📄";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-indigo-950 py-8 px-4 sm:px-6 lg:px-8">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-900/30 rounded-full mix-blend-screen filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-900/30 rounded-full mix-blend-screen filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-900/10 rounded-full mix-blend-screen filter blur-3xl opacity-10"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)] pointer-events-none"></div>

      <div className="relative max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-2xl shadow-2xl mb-6 transform hover:scale-105 transition-transform duration-300 shadow-blue-500/25">
            <span className="text-3xl text-white">⚡</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            File Processor Pro
          </h1>
          <p className="text-xl text-gray-300 max-w-md mx-auto leading-relaxed">
            Transform your files with AI-powered processing and extraction
          </p>
        </div>

        {/* Main Card */}
        <div className="card bg-base-300/50 backdrop-blur-xl border border-gray-700/50 shadow-2xl transform hover:shadow-3xl transition-all duration-300">
          <div className="card-body p-8">
            {/* File Upload Area */}
            <div className="mb-8">
              <label className="label">
                <span className="label-text text-lg font-semibold text-gray-200">Upload Your File</span>
              </label>

              <div
                className={`border-4 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer ${
                  dragOver
                    ? 'border-primary bg-primary/20 scale-105 shadow-lg shadow-primary/25'
                    : 'border-gray-600 hover:border-primary/50 hover:bg-gray-700/30'
                } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !isLoading && document.getElementById('file-input').click()}
              >
                <input
                  id="file-input"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isLoading}
                />

                <div className="space-y-4">
                  <div className="text-6xl mb-4 filter drop-shadow-lg">
                    {file ? getFileIcon(file.name) : "📁"}
                  </div>

                  {file ? (
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg text-white">{file.name}</h3>
                      <p className="text-sm text-gray-400">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <>
                      <h3 className="font-semibold text-lg text-gray-200">Drop your file here</h3>
                      <p className="text-gray-400">or click to browse</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Supports PDF, DOC, Images, and more
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            {isLoading && (
              <div className="mb-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Processing...</span>
                  <span className="text-gray-300">{progress}%</span>
                </div>
                <progress
                  className="progress progress-primary w-full h-3 bg-gray-700"
                  value={progress}
                  max="100"
                ></progress>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="alert alert-error bg-red-900/50 border-red-700 shadow-lg mb-6 animate-fade-in">
                <div className="text-white">
                  <span>❌</span>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={uploadFile}
                disabled={isLoading || !file}
                className="btn btn-primary btn-lg flex-1 gap-2 transform hover:scale-105 transition-transform duration-200 disabled:transform-none bg-gradient-to-r from-blue-600 to-purple-600 border-0 text-white shadow-lg shadow-blue-500/25"
              >
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    <span>🚀</span>
                    Process File
                  </>
                )}
              </button>

              {(jobId || downloads.length > 0) && !isLoading && (
                <button
                  onClick={resetForm}
                  className="btn btn-outline btn-lg gap-2 transform hover:scale-105 transition-transform duration-200 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500"
                >
                  <span>🔄</span>
                  New File
                </button>
              )}
            </div>

            {/* Job Info */}
            {jobId && (
              <div className="stats shadow bg-gradient-to-r from-gray-800/50 to-purple-900/30 border border-gray-700 mb-6 transform hover:scale-105 transition-transform duration-200">
                <div className="stat">
                  <div className="stat-title text-gray-400">Job ID</div>
                  <div className="stat-value text-lg font-mono text-cyan-400">{jobId}</div>
                  <div className="stat-desc text-gray-500">Track your processing job</div>
                </div>
              </div>
            )}

            {/* Status */}
            {status && (
              <div className="collapse collapse-plus bg-gray-800/50 border border-gray-700 mb-6">
                <input type="checkbox" />
                <div className="collapse-title text-lg font-medium text-gray-200">Processing Status</div>
                <div className="collapse-content">
                  <pre className="text-xs bg-gray-900/50 text-gray-300 p-4 rounded-lg border border-gray-700 overflow-x-auto">
                    {status}
                  </pre>
                </div>
              </div>
            )}

            {/* Downloads */}
            {downloads.length > 0 && (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">✨ Processing Complete!</h3>
                  <p className="text-gray-400">Your files are ready for download</p>
                </div>

                <div className="grid gap-4">
                  {downloads.map((download, index) => (
                    <a
                      key={index}
                      href={download.url}
                      download
                      className="card bg-gradient-to-r from-emerald-900/30 to-green-900/20 border border-emerald-700/50 shadow-lg transform hover:scale-105 hover:shadow-xl transition-all duration-300 group"
                    >
                      <div className="card-body p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
                              {download.icon}
                            </span>
                            <div>
                              <h4 className="font-semibold text-white">{download.label}</h4>
                              <p className="text-sm text-gray-400">Click to download</p>
                            </div>
                          </div>
                          <span className="text-2xl group-hover:scale-110 transition-transform duration-200">⬇️</span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Success Toast */}
        <div id="success-toast" className="toast toast-center z-50">
          <div className="alert alert-success bg-gradient-to-r from-green-900/90 to-emerald-900/90 border border-emerald-700 shadow-lg transform transition-all duration-300 scale-0 text-white">
            <div>
              <span>✅</span>
              <span className="font-semibold">File processed successfully!</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500">Powered by Advanced AI Processing • Secure & Fast</p>
          <div className="flex justify-center gap-6 mt-4">
            <span className="text-gray-600 text-sm">🔒 Encrypted</span>
            <span className="text-gray-600 text-sm">⚡ Fast Processing</span>
            <span className="text-gray-600 text-sm">🤖 AI Powered</span>
          </div>
        </div>
      </div>

      {/* Custom Styles for Animations */}
      <style jsx>{`
        .toast .alert {
          transform: scale(0);
          transition: transform 0.3s ease-in-out;
        }
        .toast.show .alert {
          transform: scale(1);
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}