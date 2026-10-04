"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Upload, CheckCircle2, AlertTriangle, Layers, ArrowRight, Play, Database, FileText } from "lucide-react";
import AppShell from "@/components/AppShell";
import { fetchScenarios, uploadScenarioCSV, loadScenario as apiLoadScenario } from "@/lib/api";

function ScenariosContent({ setActiveScenarioId }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Upload Form State
  const [selectedFile, setSelectedFile] = useState(null);
  const [scenarioNameInput, setScenarioNameInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [validationReport, setValidationReport] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    if (searchParams.get("upload") === "true") {
      setShowUploadModal(true);
    }
    loadScenarioList();
  }, [searchParams]);

  const loadScenarioList = async () => {
    setLoading(true);
    const list = await fetchScenarios();
    setScenarios(list);
    setLoading(false);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!scenarioNameInput) {
        const defaultName = file.name.replace(".csv", "").replace(/[-_]/g, " ");
        setScenarioNameInput(defaultName.charAt(0).toUpperCase() + defaultName.slice(1));
      }
      setValidationReport(null);
      setUploadError(null);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    setUploadError(null);
    setValidationReport(null);

    try {
      const res = await uploadScenarioCSV(selectedFile, scenarioNameInput);
      setValidationReport(res);
      await loadScenarioList();
    } catch (err) {
      setUploadError(err.message || "Failed to upload and validate CSV file.");
    } finally {
      setUploading(false);
    }
  };

  const handleLoadScenarioClick = async (scenarioId) => {
    await apiLoadScenario(scenarioId);
    setActiveScenarioId(scenarioId);
    router.push("/command-center");
  };

  return (
    <div className="space-y-8">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-[#151A21] border border-[#2A323C] rounded-lg">
        <div className="space-y-1">
          <h2 className="text-xl font-mono font-bold text-[#E7EAF0]">SCENARIO LIBRARY</h2>
          <p className="text-xs text-[#9BA4B0] font-sans">
            Select an existing benchmark attack scenario or upload raw network flow telemetry to initiate temporal analysis.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2.5 rounded bg-[#6F8FBE] hover:bg-[#879DBF] text-[#0D1015] font-mono text-xs font-bold transition-colors inline-flex items-center gap-2 self-start md:self-auto shrink-0"
        >
          <Upload className="w-4 h-4" />
          <span>+ UPLOAD NETWORK DATA (CSV)</span>
        </button>
      </div>

      {/* Upload & Validation Modal / Card */}
      {showUploadModal && (
        <div className="p-6 bg-[#151A21] border border-[#6F8FBE]/40 rounded-lg space-y-6">
          <div className="flex items-center justify-between border-b border-[#2A323C] pb-4">
            <h3 className="text-sm font-mono font-bold text-[#E7EAF0] uppercase flex items-center gap-2">
              <Upload className="w-4 h-4 text-[#6F8FBE]" />
              <span>CREATE SCENARIO FROM CSV</span>
            </h3>
            <button
              onClick={() => setShowUploadModal(false)}
              className="text-xs font-mono text-[#9BA4B0] hover:text-[#E7EAF0]"
            >
              [ CLOSE ]
            </button>
          </div>

          <form onSubmit={handleUploadSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-mono text-[#9BA4B0]">Scenario Name</label>
              <input
                type="text"
                value={scenarioNameInput}
                onChange={(e) => setScenarioNameInput(e.target.value)}
                placeholder="e.g. Enterprise Lateral Movement - Test Run"
                className="w-full px-3 py-2 bg-[#0D1015] border border-[#2A323C] rounded text-xs font-mono text-[#E7EAF0] focus:outline-none focus:border-[#6F8FBE]"
              />
            </div>

            <div className="border-2 border-dashed border-[#2A323C] hover:border-[#6F8FBE] rounded-lg p-6 text-center space-y-3 bg-[#0D1015]/50 transition-colors">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                id="csv-upload-input"
              />
              <label htmlFor="csv-upload-input" className="cursor-pointer space-y-2 block">
                <FileText className="w-8 h-8 text-[#6F8FBE] mx-auto" />
                <div className="text-xs font-mono text-[#E7EAF0]">
                  {selectedFile ? selectedFile.name : "Drop network telemetry CSV file here or click to browse"}
                </div>
                <div className="text-[10px] font-mono text-[#6F7885]">
                  {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : "Supports standard network flow telemetry columns (timestamp, src_ip, dst_ip, ports, bytes, protocol)"}
                </div>
              </label>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="submit"
                disabled={!selectedFile || uploading}
                className="px-5 py-2 rounded bg-[#6F8FBE] disabled:bg-[#2A323C] text-[#0D1015] font-mono text-xs font-bold transition-colors"
              >
                {uploading ? "VALIDATING & INGESTING..." : "PROCESS & VALIDATE CSV"}
              </button>
            </div>
          </form>

          {/* Validation Failure Error Message */}
          {uploadError && (
            <div className="p-4 bg-[#A85D59]/10 border border-[#A85D59]/30 rounded text-xs font-mono text-[#A85D59] space-y-1">
              <div className="flex items-center gap-2 font-bold">
                <AlertTriangle className="w-4 h-4" />
                <span>DATASET NOT READY</span>
              </div>
              <p className="text-[11px] text-[#9BA4B0]">{uploadError}</p>
            </div>
          )}

          {/* Real Validation Report Display */}
          {validationReport && (
            <div className="p-4 bg-[#668B73]/10 border border-[#668B73]/30 rounded space-y-3 font-mono text-xs text-[#E7EAF0]">
              <div className="flex items-center justify-between font-bold text-[#668B73]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>DATASET VALIDATED & READY FOR ANALYSIS</span>
                </div>
                <span className="text-[10px] uppercase border border-[#668B73]/40 px-2 py-0.5 rounded">STATUS: READY</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[11px] bg-[#0D1015] p-3 rounded border border-[#2A323C]">
                <div>
                  <span className="text-[#6F7885] block">SCENARIO ID</span>
                  <span className="font-semibold text-[#6F8FBE]">{validationReport.scenario_id}</span>
                </div>
                <div>
                  <span className="text-[#6F7885] block">TOTAL FLOW ROWS</span>
                  <span className="font-semibold">{validationReport.quality_report?.total_rows || 0}</span>
                </div>
                <div>
                  <span className="text-[#6F7885] block">TEMPORAL WINDOWS</span>
                  <span className="font-semibold">{validationReport.window_count || 0} (10s windows)</span>
                </div>
                <div>
                  <span className="text-[#6F7885] block">TIME RANGE</span>
                  <span className="font-semibold text-[10px]">
                    {validationReport.quality_report?.time_start ? `${validationReport.quality_report.time_start.slice(11, 19)} → ${validationReport.quality_report.time_end?.slice(11, 19)}` : "Valid"}
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => handleLoadScenarioClick(validationReport.scenario_id)}
                  className="px-4 py-2 rounded bg-[#668B73] hover:bg-[#668B73]/80 text-[#0D1015] font-bold text-xs flex items-center gap-2"
                >
                  <span>LOAD SCENARIO INTO COMMAND CENTER</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Scenario List Display */}
      {loading ? (
        <div className="p-8 text-center font-mono text-xs text-[#9BA4B0]">Loading scenarios...</div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {scenarios.map((scen) => (
              <div
                key={scen.id}
                className="bg-[#151A21] border border-[#2A323C] rounded-lg p-5 flex flex-col justify-between space-y-4 hover:border-[#6F8FBE]/50 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded border border-[#2A323C] text-[#6F8FBE] bg-[#0D1015]">
                      {scen.category || "ANALYSIS SCENARIO"}
                    </span>
                    <span className="text-[10px] font-mono text-[#668B73]">● READY</span>
                  </div>

                  <h3 className="text-base font-mono font-bold text-[#E7EAF0]">{scen.name}</h3>
                  <p className="text-xs font-sans text-[#9BA4B0] leading-relaxed">{scen.description}</p>
                </div>

                <div className="pt-3 border-t border-[#2A323C] flex items-center justify-between font-mono text-xs">
                  <span className="text-[11px] text-[#6F7885]">{scen.source_dataset}</span>
                  <button
                    onClick={() => handleLoadScenarioClick(scen.id)}
                    className="px-4 py-2 rounded bg-[#191F27] hover:bg-[#1D242D] border border-[#2A323C] hover:border-[#6F8FBE] text-[#E7EAF0] font-semibold transition-colors flex items-center gap-2"
                  >
                    <Play className="w-3.5 h-3.5 text-[#6F8FBE]" />
                    <span>LOAD SCENARIO</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ScenariosPage() {
  return (
    <AppShell title="SCENARIO LIBRARY">
      {({ setActiveScenarioId }) => (
        <React.Suspense fallback={<div className="p-8 font-mono text-xs text-[#9BA4B0]">Loading scenario library...</div>}>
          <ScenariosContent setActiveScenarioId={setActiveScenarioId} />
        </React.Suspense>
      )}
    </AppShell>
  );
}
