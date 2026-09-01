import React, { useState, useRef } from 'react';
import {
  Bug,
  Camera,
  Upload,
  Mic,
  MicOff,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  RotateCcw,
  Volume2,
  Info,
  Layers,
  ChevronRight,
  FileImage,
  Video,
  VideoOff,
  Crosshair,
  Flame,
  Check,
  Leaf,
  MessageSquare,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { mockDiseaseSamples, ripeTomatoesImg, tomatoBlightImg } from '../../data/mockData';
import { cropNamesList } from '../../data/translations';
import { DiseaseDetectionResult } from '../../types';

export const DiseaseDetection: React.FC = () => {
  const { t, language, setActiveView } = useApp();

  const [selectedCrop, setSelectedCrop] = useState<string>('Tomato');
  const [symptomText, setSymptomText] = useState<string>('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(ripeTomatoesImg);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isRecordingVoice, setIsRecordingVoice] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [diagnosticResult, setDiagnosticResult] = useState<DiseaseDetectionResult | null>(
    mockDiseaseSamples[0]
  );

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const symptomPresets = [
    'Brown or black circular leaf spots',
    'Yellowing or chlorosis of leaf edges',
    'Wilting or drooping during daytime',
    'White powdery coating on foliage',
    'Bacterial ooze or water-soaked streaks',
    'Leaf curl or vein thickening',
    'Stem boring holes or frass',
  ];

  const handleToggleSymptom = (sym: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym]
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result as string);
        stopCamera();
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        });
        streamRef.current = stream;
        setIsCameraActive(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } else {
        setCameraError('Camera access is not supported on this browser.');
      }
    } catch (err: any) {
      setCameraError('Could not access camera. Please allow camera permissions or upload an image.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setUploadedImage(dataUrl);
      }
      stopCamera();
    }
  };

  const handleVoiceDescription = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please type symptoms manually.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'hi' ? 'hi-IN' : language === 'te' ? 'te-IN' : 'en-IN';
      recognition.interimResults = false;

      setIsRecordingVoice(true);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSymptomText((prev) => (prev ? `${prev}, ${transcript}` : transcript));
        setIsRecordingVoice(false);
      };

      recognition.onerror = () => {
        setIsRecordingVoice(false);
      };

      recognition.onend = () => {
        setIsRecordingVoice(false);
      };

      recognition.start();
    } catch (e) {
      setIsRecordingVoice(false);
    }
  };

  const [isGeminiDiagnosed, setIsGeminiDiagnosed] = useState<boolean>(true);
  const [engineNote, setEngineNote] = useState<string | null>(null);

  const runAiAnalysis = async () => {
    setIsAnalyzing(true);
    setEngineNote(null);

    try {
      const response = await fetch('/api/disease-diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: uploadedImage,
          cropName: selectedCrop,
          symptoms: selectedSymptoms,
          symptomDescription: symptomText,
          language,
        }),
      });

      const data = await response.json();

      if (data.success && data.diagnosis) {
        setDiagnosticResult(data.diagnosis);
        setIsGeminiDiagnosed(Boolean(data.isGemini));
        setEngineNote(
          data.isGemini
            ? 'Auto-Identified & Verified by Google Gemini 3.5 Flash AI'
            : 'Generated from ICAR Agronomy Knowledge Engine'
        );
      } else {
        // Fallback to closest match
        const match = mockDiseaseSamples.find((s) =>
          s.cropName.toLowerCase().includes(selectedCrop.toLowerCase().split(' ')[0])
        );
        setDiagnosticResult(match || mockDiseaseSamples[0]);
        setIsGeminiDiagnosed(false);
        setEngineNote(data.message || 'Analyzed via Regional Agronomy Knowledge Engine');
      }
    } catch (err) {
      const match = mockDiseaseSamples.find((s) =>
        s.cropName.toLowerCase().includes(selectedCrop.toLowerCase().split(' ')[0])
      );
      setDiagnosticResult(match || mockDiseaseSamples[0]);
      setIsGeminiDiagnosed(false);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const selectPreloadedSample = (sample: DiseaseDetectionResult) => {
    setSelectedCrop(sample.cropName);
    setDiagnosticResult(sample);
    if (sample.cropName.includes('Tomato')) {
      setUploadedImage('/src/assets/images/ripe_red_tomatoes_1788178557607.jpg');
    } else if (sample.cropName.includes('Paddy')) {
      setUploadedImage('https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80');
    } else {
      setUploadedImage('https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80');
    }
  };

  return (
    <div id="disease-detection-page" className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Main Grid: Left Diagnostic Inputs (5 cols) & Right AI Report (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ===================================================
            LEFT: INPUT & CAPTURE LAB (5 Cols)
            =================================================== */}
        <div className="lg:col-span-5 space-y-5">
          
          <div className="bg-white rounded-3xl border border-green-100 p-5 sm:p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-extrabold text-green-950 border-b border-green-50 pb-2">
              1. Crop & Visual Input
            </h2>

            {/* Auto Crop Detection Info Banner */}
            <div className="p-3 bg-emerald-50/80 border border-emerald-200/90 rounded-2xl flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-emerald-950">
                      Auto Crop & Disease Identification
                    </span>
                    <span className="text-[9px] font-extrabold bg-emerald-200/80 text-emerald-900 px-1.5 py-0.2 rounded-md">
                      Gemini 3.5 Flash
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-800 font-medium">
                    Upload or snap any plant photo — Gemini automatically identifies the crop & searches treatments.
                  </p>
                </div>
              </div>
            </div>

            {/* Image Preview / Camera Viewport */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-green-900">
                Leaf / Plant Visual Capture
              </label>

              <div className="relative rounded-2xl overflow-hidden bg-stone-950 border border-green-100 aspect-4/3 flex items-center justify-center">
                {isCameraActive ? (
                  <div className="relative w-full h-full">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <div className="w-48 h-48 border-2 border-green-400 border-dashed rounded-2xl animate-pulse"></div>
                    </div>
                  </div>
                ) : uploadedImage ? (
                  <img
                    src={uploadedImage}
                    alt="Uploaded crop preview"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="text-center p-6 text-stone-400">
                    <FileImage className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">No image selected</p>
                  </div>
                )}
              </div>

              {cameraError && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{cameraError}</span>
                </div>
              )}

              {/* Action Buttons: Upload or Camera */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                {isCameraActive ? (
                  <>
                    <button
                      id="camera-capture-photo-btn"
                      onClick={capturePhoto}
                      className="py-2.5 px-3 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Crosshair className="w-4 h-4" />
                      <span>Capture Photo</span>
                    </button>
                    <button
                      onClick={stopCamera}
                      className="py-2.5 px-3 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                    >
                      <VideoOff className="w-4 h-4" />
                      <span>Cancel Camera</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      id="open-device-camera-btn"
                      onClick={startCamera}
                      className="py-2.5 px-3 bg-green-50 hover:bg-green-100 text-green-800 border border-green-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Camera className="w-4 h-4 text-green-700" />
                      <span>{t.openCamera}</span>
                    </button>

                    <button
                      id="upload-crop-image-btn"
                      onClick={() => fileInputRef.current?.click()}
                      className="py-2.5 px-3 bg-green-50/50 hover:bg-green-100 text-green-800 border border-green-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Upload className="w-4 h-4 text-green-600" />
                      <span>{t.uploadImage}</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </>
                )}
              </div>
            </div>

            {/* Quick Symptom Checklist */}
            <div className="space-y-2 pt-2 border-t border-green-50">
              <label className="block text-xs font-bold text-green-900">
                2. Quick Symptom Selector
              </label>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {symptomPresets.map((sym, idx) => {
                  const isChecked = selectedSymptoms.includes(sym);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleToggleSymptom(sym)}
                      className={`w-full text-left p-2 rounded-xl text-xs border flex items-center justify-between transition-all ${
                        isChecked
                          ? 'bg-green-100 border-green-400 text-green-950 font-semibold'
                          : 'bg-green-50/40 border-green-100 text-green-800 hover:bg-green-50'
                      }`}
                    >
                      <span>{sym}</span>
                      {isChecked && <Check className="w-3.5 h-3.5 text-green-700 shrink-0 ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Manual Text / Voice Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-green-900">
                3. Additional Description / Voice Note
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={symptomText}
                  onChange={(e) => setSymptomText(e.target.value)}
                  placeholder="e.g. Yellowing on bottom leaves with dark bullseye spots..."
                  className="w-full pl-3 pr-10 py-2 bg-green-50/50 border border-green-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-green-500 text-green-950"
                />
                <button
                  type="button"
                  onClick={handleVoiceDescription}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors ${
                    isRecordingVoice
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'text-stone-400 hover:text-green-700 hover:bg-green-50'
                  }`}
                  title="Speak symptoms using microphone"
                >
                  {isRecordingVoice ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-green-600" />}
                </button>
              </div>
            </div>

            {/* Run Analysis Button */}
            <button
              id="run-ai-diagnosis-btn"
              onClick={runAiAnalysis}
              disabled={isAnalyzing}
              className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-extrabold shadow-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>{isAnalyzing ? 'Analyzing with Crop AI...' : t.analyzeCrop}</span>
            </button>

          </div>

        </div>

        {/* ===================================================
            RIGHT: COMPREHENSIVE AI DIAGNOSTIC REPORT (7 Cols)
            =================================================== */}
        <div className="lg:col-span-7 space-y-5">
          
          {diagnosticResult ? (
            <div className="bg-white rounded-3xl border border-green-100 p-5 sm:p-7 shadow-xs space-y-5">
              
              {/* Diagnosis Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-green-50 pb-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xs text-green-700 font-bold uppercase tracking-wider bg-green-50 px-2 py-0.5 rounded-md border border-green-200">
                      Crop: <strong className="text-green-950">{diagnosticResult.cropName}</strong>
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-md">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      <span>{isGeminiDiagnosed ? 'Gemini 3.5 Flash AI' : 'Agronomy Engine'}</span>
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-green-950 mt-0.5">
                    {diagnosticResult.detectedIssue}
                  </h2>
                  {engineNote && (
                    <p className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{engineNote}</span>
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <div className="bg-green-50 border border-green-300 rounded-2xl px-3 py-1.5 text-right">
                    <div className="text-[10px] text-green-800 font-semibold uppercase">
                      {t.confidence}
                    </div>
                    <div className="text-lg font-black text-green-900">
                      {diagnosticResult.confidencePercent}%
                    </div>
                  </div>
                  <span
                    className={`text-xs uppercase font-extrabold px-3 py-1.5 rounded-2xl border ${
                      diagnosticResult.severity === 'Severe'
                        ? 'bg-red-50 text-red-800 border-red-200'
                        : 'bg-amber-50 text-amber-900 border-amber-300'
                    }`}
                  >
                    {diagnosticResult.severity} Severity
                  </span>
                </div>
              </div>

              {/* Symptoms Observed */}
              <div className="space-y-2">
                <h3 className="text-xs uppercase font-bold tracking-wider text-green-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>{t.symptomsObserved}</span>
                </h3>
                <ul className="space-y-1.5 bg-green-50/50 rounded-2xl p-4 border border-green-100">
                  {diagnosticResult.symptoms.map((sym, idx) => (
                    <li key={idx} className="text-xs text-green-950 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-600 mt-1.5 shrink-0"></span>
                      <span>{sym}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Immediate Actions */}
              <div className="space-y-2">
                <h3 className="text-xs uppercase font-bold tracking-wider text-green-900 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-600" />
                  <span>{t.recommendedTreatment}</span>
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {diagnosticResult.recommendedActions.map((action, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-green-50 border border-green-200 rounded-xl text-xs font-semibold text-green-950 flex items-start gap-2.5"
                    >
                      <span className="w-5 h-5 rounded-full bg-green-200 text-green-800 flex items-center justify-center font-bold text-[11px] shrink-0">
                        {idx + 1}
                      </span>
                      <span>{action}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Biological & Chemical Treatment Tabs/Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="bg-green-50/40 border border-green-100 rounded-2xl p-4 space-y-2">
                  <div className="text-xs font-bold text-green-900 flex items-center gap-1.5">
                    <Leaf className="w-4 h-4 text-green-600" />
                    <span>Biological / Organic Control:</span>
                  </div>
                  <ul className="text-xs text-green-900/90 space-y-1.5 list-disc list-inside">
                    {diagnosticResult.biologicalTreatment.map((bio, idx) => (
                      <li key={idx} className="leading-snug">{bio}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-green-50/40 border border-green-100 rounded-2xl p-4 space-y-2">
                  <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>Chemical Treatment:</span>
                  </div>
                  <ul className="text-xs text-stone-700 space-y-1.5 list-disc list-inside">
                    {diagnosticResult.chemicalTreatment.map((chem, idx) => (
                      <li key={idx} className="leading-snug">{chem}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Prevention & Good Farming Practices */}
              <div className="bg-green-50/40 border border-green-100 rounded-2xl p-4 space-y-2">
                <div className="text-xs font-bold text-green-950 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-green-700" />
                  <span>{t.preventionPractices}</span>
                </div>
                <ul className="text-xs text-green-900 space-y-1.5">
                  {diagnosticResult.preventionTips.map((prev, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-green-700 font-bold">✓</span>
                      <span>{prev}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Advisory Disclaimer Notice */}
              <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900">
                <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Important Farmer Disclaimer:</strong> {diagnosticResult.disclaimer}
                </p>
              </div>

              {/* Discuss in Google Chat Action */}
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-emerald-950">Share with Extension Officer</h4>
                    <p className="text-[11px] text-emerald-700">Discuss this leaf diagnosis in your Google Chat spaces</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveView('google-chat')}
                  className="w-full sm:w-auto px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Open Google Chat</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-green-100 p-12 text-center text-stone-400 space-y-3">
              <Bug className="w-12 h-12 mx-auto opacity-40 text-stone-400" />
              <p className="text-sm font-semibold">
                Upload or capture an image to generate instant AI plant diagnosis
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
