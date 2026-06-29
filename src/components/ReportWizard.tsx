import React, { useState, useRef } from "react";
import { Issue } from "../types";
import { Camera, MapPin, CheckCircle2, Shield, AlertCircle, Trash2, ArrowRight, ArrowLeft, RefreshCw, Check } from "lucide-react";
import MapComponent from "./MapComponent";

interface ReportWizardProps {
  onBack: () => void;
  onSubmitReport: (issue: Issue) => void;
}

export default function ReportWizard({ onBack, onSubmitReport }: ReportWizardProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [evidencePhoto, setEvidencePhoto] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Custom states gathered during steps
 const [title, setTitle] = useState("");
const [description, setDescription] = useState("");
const [address, setAddress] = useState("");
const [latitude, setLatitude] = useState(21.1458);
const [longitude, setLongitude] = useState(79.0882);
  const [category, setCategory] = useState<"Infrastructure" | "Sanitation" | "Utilities" | "Landscaping" | "Public Safety" | "Emergency">("Infrastructure");
  const [severity, setSeverity] = useState<"High" | "Medium" | "Low">("High");
  const [notifyUser, setNotifyUser] = useState(true);

  // File uploading refs & Simulation presets
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const simulatePhotoUpload = (presetUrl: string) => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setEvidencePhoto(presetUrl);
      setIsAnalyzing(false);
    }, 1500);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  if (file) {
    setSelectedFile(file);
    const localUrl = URL.createObjectURL(file);
    simulatePhotoUpload(localUrl);
  }
};

const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];
    setSelectedFile(file);
    const localUrl = URL.createObjectURL(file);
    simulatePhotoUpload(localUrl);
  }
};

  
   const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault();

  try {
    const formData = new FormData();
    formData.append("title", title.trim() || "Reported Issue");
    formData.append("description", description.trim() || "No additional comments provided.");
    formData.append("address", address.trim() || "Confirmed Ward Location");
    formData.append("latitude", "21.1458");
    formData.append("longitude", "79.0882");
  
    if (selectedFile) {
  formData.append("image", selectedFile, selectedFile.name);
}

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/issues/submit`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    const newIssue: Issue = {
      id: data.issue.id,
      title: data.issue.title,
      category: data.issue.category,
      severity: data.issue.severity,
      status: "Pending",
      location: data.issue.address,
      coordinates: "21.1458° N, 79.0882° E",
      timeAgo: "Just now",
      description: data.ai_summary || data.issue.description,
      imageUrl: data.issue.image_url || evidencePhoto || "",
      votes: 1,
      followed: true,
      comments: [],
      timeline: [
        {
          id: "t1",
          title: "Report Submitted",
          description: "Civic report logged in Central Dispatch Queue.",
          timeAgo: "Just now",
          icon: "Megaphone"
        }
      ],
      assignedDept: data.issue.department,
     officer: {
  name: data.officer_name || "Assigned Officer",
  avatar: "",
  role: "Maintenance Supervisor",
  verified: true,
},
      slaCountdown: "48:00:00",
      slaPercentage: 100
    };

    onSubmitReport(newIssue);

  } catch (error) {
    console.error("Submission failed:", error);
    alert("Failed to submit issue. Please try again.");
  }
};
      
  return (
    <div className="flex-grow bg-[#0A0A0B] min-h-screen pb-16">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        
        {/* Step Indicator Tracker Row */}
        <div className="flex justify-between items-center bg-[#0F0F11] p-4 rounded-xl border border-white/5 shadow-sm">
          <button onClick={onBack} className="text-xs font-bold text-white/40 hover:text-amber-500 transition-colors flex items-center gap-1.5 cursor-pointer">
            <ArrowLeft className="w-4 h-4" /> Cancel
          </button>
          
          <div className="flex items-center gap-6 text-xs font-bold font-sans">
            <span className={`pb-1 border-b-2 transition-all ${step === 1 ? "text-amber-500 border-amber-500 font-extrabold" : "text-white/40 border-transparent"}`}>
              1. Capture Evidence
            </span>
            <span className={`pb-1 border-b-2 transition-all ${step === 2 ? "text-amber-500 border-amber-500 font-extrabold" : "text-white/40 border-transparent"}`}>
              2. Location Details
            </span>
            <span className={`pb-1 border-b-2 transition-all ${step === 3 ? "text-amber-500 border-amber-500 font-extrabold" : "text-white/40 border-transparent"}`}>
              3. Review & Submit
            </span>
          </div>
        </div>

        {/* STEP 1: CAPTURE EVIDENCE */}
        {step === 1 && (
          <div className="bg-[#121214] p-6 rounded-2xl border border-white/5 space-y-6 shadow-sm">
            <div className="space-y-1">
              <h2 className="text-lg font-extrabold text-white">Upload Incident Photo</h2>
              <p className="text-xs text-white/40">
                Civic AI will automatically extract depth boundaries, tag categories, and assess urgency metadata.
              </p>
            </div>

            {/* Drag Zone Card */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border border-dashed border-white/10 hover:border-amber-500 rounded-2xl p-8 text-center bg-white/5 cursor-pointer transition-all flex flex-col items-center justify-center min-h-[220px] relative overflow-hidden group"
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileSelect}
              />

              {isAnalyzing ? (
                <div className="space-y-3 flex flex-col items-center">
                  <RefreshCw className="w-8 h-8 text-amber-500 animate-spin" />
                  <p className="text-xs font-bold text-amber-500">AI Photo Analysis Active...</p>
                  <p className="text-[10px] text-white/40">Scrubbing faces & parsing geometry depths</p>
                </div>
              ) : evidencePhoto ? (
                <div className="absolute inset-0 z-0">
                  <img src={evidencePhoto} alt="Evidence Upload Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-[#0A0A0B]/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-6 h-6 text-white hover:text-red-400" onClick={(e) => { e.stopPropagation(); setEvidencePhoto(null); }} />
                  </div>
                </div>
              ) : (
                <div className="space-y-3 flex flex-col items-center">
                  <Camera className="w-10 h-10 text-white/40 group-hover:text-amber-500 transition-colors" />
                  <div>
                    <p className="text-xs font-bold text-white">
                      Drag & Drop Photo or <span className="text-amber-500">Browse Files</span>
                    </p>
                    <p className="text-[10px] text-white/40 mt-1">
                      Supports JPG, PNG up to 10MB
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Simulated preset buttons to save effort */}
            {!evidencePhoto && !isAnalyzing && (
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                  Quick Simulation presets:
                </p>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => simulatePhotoUpload("https://lh3.googleusercontent.com/aida-public/AB6AXuCQ_OEqJ2MQNKw66F9oLMlF_ztfzKyDuxH96DTiYMSuFzBZCXsh6FnbNQJf_qMxFlMop31HJ4eRjyrA9vxs2Vbrc5qAb2AhxX1s-b2g1Kb0MG2S5-Etcbdlhiy_UYUoneZi9KXHOknXjn3q3cVgPtIMn8p1yg-G7zr2KmNLJHpScsJ9LlS762OwvCx7qgKFS_CXcqudWSLbDESEAA-WjUNIU8SUxMb9msGpUcakEaJmOvn701-wrlRETfghTFO8ufa66F9Zpl7fWymT")}
                    className="bg-white/5 hover:bg-white/10 border border-white/5 px-3 py-1.5 rounded-lg text-[10px] font-bold text-white cursor-pointer transition-colors"
                  >
                    Simulate Pothole Photo
                  </button>
                  <button
                    onClick={() => simulatePhotoUpload("https://lh3.googleusercontent.com/aida-public/AB6AXuDMKLsc3hxhlfo-awflR7WTWJZ0uoMoCDQb2V4EEMRbLl8_6iUxiYjvrS9hbQ8l1b4peqMFhRTH7-cWrfZbOyrusIydq2vmKb73QvGBBB1I5sGXeb2xcKdr513aN7zgmLeuHne2J8mOLzFFxkKPyOJp-WVnE6cxBXrixh9qKXgu0smM31JNlsx6JYoUXY-RSEPc7E_VcBvhKadpXkf69Aqwidi7NRlSBLZz2qUsGRB719oGqHXY5HPxbgCDiCzUkgCxnse7VuC5RBfe")}
                    className="bg-white/5 hover:bg-white/10 border border-white/5 px-3 py-1.5 rounded-lg text-[10px] font-bold text-white cursor-pointer transition-colors"
                  >
                    Simulate Cracked Sidewalk Photo
                  </button>
                </div>
              </div>
            )}

            {/* Privacy Badge info */}
            <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex items-start gap-3 text-xs">
              <Shield className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-white">Privacy Assured System</h4>
                <p className="text-[11px] text-white/40 mt-0.5">
                  Our system automatically blurs human faces, private vehicle license plates, and cleans EXIF metadata headers upon processing.
                </p>
              </div>
            </div>

            {evidencePhoto && (
              <div className="bg-amber-500/5 p-4 rounded-xl border border-amber-500/20 flex items-start gap-3 text-xs animate-in slide-in-from-top-1 duration-300">
                <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-amber-500">AI Intelligence Assessment Match!</h4>
                  <p className="text-[11px] text-white/40">
                    Category match: <span className="text-white font-bold">{category}</span> &bull; Estimated Severity: <span className="text-white font-bold">{severity} Priority</span> &bull; Repairs SLA: <span className="text-white font-bold">48 Hours Target</span>.
                  </p>
                </div>
              </div>
            )}

            {/* Next actions block */}
            <div className="pt-4 border-t border-white/5 flex justify-end">
              <button
                disabled={!evidencePhoto}
                onClick={() => setStep(2)}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                  evidencePhoto
                    ? "bg-gradient-to-tr from-amber-500 to-orange-600 text-black hover:brightness-110 active:scale-95 shadow-md shadow-amber-500/20"
                    : "bg-white/5 text-white/20 pointer-events-none"
                }`}
              >
                Proceed to Location
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: LOCATION & DETAILS */}
        {step === 2 && (
          <div className="bg-[#121214] p-6 rounded-2xl border border-white/5 space-y-6 shadow-sm">
            <div className="space-y-1">
              <h2 className="text-lg font-extrabold text-white">Identify Incident Details</h2>
              <p className="text-xs text-white/40">
                Provide title descriptions and location markers so crews can navigate efficiently.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Form Input fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-widest text-white/40 mb-1">
                    Report Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-white/5 text-[#E2E2E2] placeholder-white/20 border border-white/5 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-widest text-white/40 mb-1">
                    Detailed Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full bg-white/5 text-[#E2E2E2] placeholder-white/20 border border-white/5 rounded-xl py-2 px-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-white/40 mb-1">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e: any) => setCategory(e.target.value)}
                      className="w-full bg-[#121214] text-[#E2E2E2] border border-white/5 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                    >
                      <option value="Infrastructure">Infrastructure</option>
                      <option value="Sanitation">Sanitation</option>
                      <option value="Utilities">Utilities</option>
                      <option value="Landscaping">Landscaping</option>
                      <option value="Public Safety">Public Safety</option>
                      <option value="Emergency">Emergency</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-white/40 mb-1">
                      Urgency Priority
                    </label>
                    <select
                      value={severity}
                      onChange={(e: any) => setSeverity(e.target.value)}
                      className="w-full bg-[#121214] text-[#E2E2E2] border border-white/5 rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Map view section */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-widest text-white/40 mb-1">
                    Street Address / Location
                  </label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-white/5 text-[#E2E2E2] placeholder-white/20 border border-white/5 rounded-xl py-2 pl-9 pr-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                    />
                  </div>
                </div>

                <div className="h-32 rounded-xl overflow-hidden border border-white/5">
  <MapComponent
    lat={latitude}
    lng={longitude}
    onLocationChange={(lat, lng) => {
      setLatitude(lat);
      setLongitude(lng);
    }}
  />
</div>
                  
              </div>
            </div>

            {/* Proceed buttons */}
            <div className="pt-4 border-t border-white/5 flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white/60 hover:bg-white/5 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Evidence
              </button>
              
              <button
                disabled={!address.trim() || !title.trim()}
                onClick={() => setStep(3)}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                  address.trim() && title.trim()
                    ? "bg-gradient-to-tr from-amber-500 to-orange-600 text-black hover:brightness-110 active:scale-95 shadow-md"
                    : "bg-white/5 text-white/20 pointer-events-none"
                }`}
              >
                Proceed to Review
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: REVIEW & SUBMIT */}
        {step === 3 && (
          <div className="bg-[#121214] p-6 rounded-2xl border border-white/5 space-y-6 shadow-sm">
            <div className="space-y-1">
              <h2 className="text-lg font-extrabold text-white">Review Civic Submission</h2>
              <p className="text-xs text-white/40">
                Examine your file tags and dispatch routing options before creating the public docket record.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Photo evidence column */}
              <div className="md:col-span-1">
                <div className="w-full aspect-[4/3] rounded-xl overflow-hidden border border-white/5 bg-[#1C1C1E]">
                  <img 
                    src={evidencePhoto || "https://lh3.googleusercontent.com/aida-public/AB6AXuDgupP_y-drxeA4OpugIddqZw3BG-djqdzuDKCWXUFjvdloO7BcUhVmPibcLJMvlXpYAHCdHQImJ8ArA3-1MSfRPLGlGZ63b7f5cmdL2MCWPpLczBBfV14cinwwfFI9AoHPZmLU8WinirKLnOMnsOOILhQBTpUt55tXpPOJOcjag0qx3ChkpAUHM93DNGIgJtBoZ7k9vWAJ1jnYz38jZXONE3M9CiZIEhz6w3rRWFEA-udjxKKDdrDxWyRa4gCTSXfmv0b2-d2qrocn"} 
                    alt="Incident Preview" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              {/* Data summary column */}
              <div className="md:col-span-2 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3 pb-3 border-b border-white/5">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-white/40">Category</p>
                    <p className="text-sm font-extrabold text-[#E2E2E2] mt-0.5">{category}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-white/40">Report Severity</p>
                    <p className={`text-sm font-extrabold mt-0.5 ${
                      severity === "High" ? "text-red-500" :
                      severity === "Medium" ? "text-amber-500" : "text-emerald-500"
                    }`}>{severity} Priority</p>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] uppercase font-bold text-white/40">Location Address</p>
                  <p className="text-[#E2E2E2] font-semibold mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" />
                    {address}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase font-bold text-white/40">Report Description</p>
                  <p className="text-white/60 font-medium leading-relaxed mt-0.5">{description}</p>
                </div>
              </div>
            </div>

            {/* Verification checklist / AI details */}
            <div className="bg-amber-500/5 p-4 rounded-xl border border-amber-500/10 space-y-2">
              <div className="flex items-center gap-2 text-amber-500">
                <AlertCircle className="w-4 h-4" />
                <span className="text-[10px] uppercase font-extrabold tracking-widest">AI Pre-Submission Checks Passed</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] font-bold text-white/60">
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  Faces and plates redacted
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  Ward district boundary matched
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  SLA dispatch estimation calculated
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  EXIF metadata headers purged
                </div>
              </div>
            </div>

            {/* Notification preference toggler */}
            <div className="flex items-center gap-3 bg-white/5 p-3.5 rounded-xl border border-white/5">
              <input
                type="checkbox"
                id="notifyUser"
                checked={notifyUser}
                onChange={(e) => setNotifyUser(e.target.checked)}
                className="w-4 h-4 rounded border-white/10 text-amber-500 focus:ring-amber-500/20 cursor-pointer"
              />
              <label htmlFor="notifyUser" className="text-xs font-semibold text-white/80 cursor-pointer select-none">
                Subscribe to active progress updates & crew dispatch notifications on this docket.
              </label>
            </div>

            {/* Review actions buttons */}
            <div className="pt-4 border-t border-white/5 flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white/60 hover:bg-white/5 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Location
              </button>
              
              <button
                onClick={handleSubmit}
                className="px-6 py-3 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 text-black font-bold text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-orange-900/20 cursor-pointer"
              >
                Submit Civic Report
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
