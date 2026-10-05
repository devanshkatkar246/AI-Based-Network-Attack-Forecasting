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
    <div className="space-y-8 select-none">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-[#151B23] border border-[#27303A] rounded-xl">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-[#E8EDF3]">SCENARIO LIBRARY</h2>
          <p className="text-xs text-[#9AA6B2]">
            Select an existing benchmark attack scenario or upload raw network flow telemetry to initiate temporal analysis.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="px-5 py-3 rounded-lg bg-[#6F95D6] hover:bg-[#85A9E6] text-[#0B0F14] font-semibold text-xs transition-colors inline-flex items-center gap-2 self-start md:self-auto shrink-0 shadow-sm"
        >
          <Upload className="w-4 h-4" />
          <span>UPLOAD NETWORK DATA (CSV)</span>
        </button>
      </div>

      {/* Upload & Validation Modal / Card */}
      {showUploadModal && (
        <div className="p-6 bg-[#151B23] border border-[#6F95D6]/50 rounded-xl space-y-6">
          <div className="flex items-center justify-between border-b border-[#27303A] pb-4">
            <h3 className="text-sm font-bold text-[#E8EDF3] uppercase font-mono flex items-center gap-2">
              <Upload className="w-4 h-4 text-[#6F95D6]" />
              <span>CREATE SCENARIO FROM CSV</span>
            </h3>
            <button
              onClick={() => setShowUploadModal(false)}
              className="text-xs font-mono text-[#9AA6B2] hover:text-[#E8EDF3]"
            >
              [ CLOSE ]
            </button>
          </div>

          <form onSubmit={handleUploadSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-mono text-[#9AA6B2]">Scenario Name</label>
              <input
                type="text"
                value={scenarioNameInput}
                onChange={(e) => setScenarioNameInput(e.target.value)}
                placeholder="e.g. Enterprise Lateral Movement - Test Run"
                className="w-full px-3 py-2.5 bg-[#11161D] border border-[#27303A] rounded-lg text-xs font-mono text-[#E8EDF3] focus:outline-none focus:border-[#6F95D6]"
              />
            </div>

            <div className="border-2 border-dashed border-[#27303A] hover:border-[#6F95D6] rounded-xl p-8 text-center space-y-3 bg-[#11161D]/60 transition-colors">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                id="csv-upload-input"
              />
              <label htmlFor="csv-upload-input" className="cursor-pointer space-y-2 block">
                <FileText className="w-8 h-8 text-[#6F95D6] mx-auto" />
                <div className="text-xs font-medium text-[#E8EDF3]">
                  {selectedFile ? selectedFile.name : "Drop network telemetry CSV file here or click to browse"}
                </div>
                <div className="text-[11px] text-[#6C7987]">
                  {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : "Supports standard network flow telemetry columns (timestamp, src_ip, dst_ip, ports, bytes, protocol)"}
                </div>
              </label>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="submit"
                disabled={!selectedFile || uploading}
                className="px-5 py-2.5 rounded-lg bg-[#6F95D6] disabled:bg-[#27303A] text-[#0B0F14] font-semibold text-xs transition-colors"
              >
                {uploading ? "VALIDATING & INGESTING..." : "PROCESS & VALIDATE CSV"}
              </button>
            </div>
          </form>

          {/* Validation Failure Error Message */}
          {uploadError && (
            <div className="p-4 bg-[#2B1D1C] border border-[#B85C5C]/50 rounded-lg text-xs text-[#B85C5C] space-y-1 font-mono">
              <div className="flex items-center gap-2 font-bold">
                <AlertTriangle className="w-4 h-4" />
                <span>DATASET NOT READY</span>
              </div>
              <p className="text-[11px] text-[#9AA6B2]">{uploadError}</p>
            </div>
          )}

          {/* Real Validation Report Display */}
          {validationReport && (
            <div className="p-4 bg-[#1C2620] border border-[#659477]/50 rounded-lg space-y-3 text-xs text-[#E8EDF3]">
              <div className="flex items-center justify-between font-bold text-[#659477] font-mono">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>DATASET READY</span>
                </div>
                <span className="text-[10px] uppercase border border-[#659477]/40 px-2 py-0.5 rounded">SCHEMA: VALIDATED</span>
              </div>

              <div className="font-bold text-sm text-[#E8EDF3]">
                {validationReport.scenario_name || validationReport.name}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs bg-[#11161D] p-3 rounded-lg border border-[#27303A] font-mono">
                <div>
                  <span className="text-[#6C7987] block text-[10px]">SCENARIO ID</span>
                  <span className="font-semibold text-[#6F95D6]">{validationReport.scenario_id}</span>
                </div>
                <div>
                  <span className="text-[#6C7987] block text-[10px]">TOTAL ROWS</span>
                  <span className="font-semibold">{validationReport.rows || validationReport.quality_report?.total_rows || 0}</span>
                </div>
                <div>
                  <span className="text-[#6C7987] block text-[10px]">TEMPORAL WINDOWS</span>
                  <span className="font-semibold">{validationReport.window_count || 0} (10s windows)</span>
                </div>
                <div>
                  <span className="text-[#6C7987] block text-[10px]">TIME RANGE</span>
                  <span className="font-semibold text-[11px]">
                    {validationReport.time_range?.start || validationReport.quality_report?.time_start
                      ? `${(validationReport.time_range?.start || validationReport.quality_report?.time_start).slice(11, 19)} → ${(validationReport.time_range?.end || validationReport.quality_report?.time_end || "").slice(11, 19)}`
                      : "Validated"}
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => handleLoadScenarioClick(validationReport.scenario_id)}
                  className="px-5 py-2.5 rounded-lg bg-[#659477] hover:bg-[#527d62] text-[#0B0F14] font-bold text-xs flex items-center gap-2 transition-colors"
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
        <div className="p-8 text-center text-xs text-[#9AA6B2] font-mono">Loading scenarios...</div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {scenarios.map((scen) => (
              <div
                key={scen.id}
                className="bg-[#151B23] border border-[#27303A] rounded-xl p-5 flex flex-col justify-between space-y-4 hover:border-[#6F95D6]/50 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded border border-[#27303A] text-[#6F95D6] bg-[#11161D]">
                      {scen.category || "ANALYSIS SCENARIO"}
                    </span>
                    <span className="text-[10px] font-mono text-[#659477]">● READY</span>
                  </div>

                  <h3 className="text-base font-bold text-[#E8EDF3]">{scen.name}</h3>
                  <p className="text-xs text-[#9AA6B2] leading-relaxed">{scen.description}</p>
                </div>

                <div className="pt-3 border-t border-[#27303A] flex items-center justify-between text-xs">
                  <span className="text-[11px] font-mono text-[#6C7987]">{scen.source_dataset}</span>
                  <button
                    onClick={() => handleLoadScenarioClick(scen.id)}
                    className="px-4 py-2 rounded-lg bg-[#19202A] hover:bg-[#1E2632] border border-[#27303A] hover:border-[#6F95D6] text-[#E8EDF3] font-semibold transition-colors flex items-center gap-2 text-xs"
                  >
                    <Play className="w-3.5 h-3.5 text-[#6F95D6]" />
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
        <React.Suspense fallback={<div className="p-8 font-mono text-xs text-[#9AA6B2]">Loading scenario library...</div>}>
          <ScenariosContent setActiveScenarioId={setActiveScenarioId} />
        </React.Suspense>
      )}
    </AppShell>
  );
}
