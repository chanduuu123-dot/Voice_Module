/**
 * VoiceProof AI Audio Forensics & Signal Analyzer Engine
 * Performs Web Audio API DSP analysis to detect AI voice deepfakes and extract audio signatures.
 */

/**
 * Reads an ArrayBuffer or File object and decodes it using AudioContext
 * @param {File | ArrayBuffer} audioSource
 * @returns {Promise<{audioBuffer: AudioBuffer, duration: number, sampleRate: number, channels: number}>}
 */
export async function decodeAudioSource(audioSource) {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  
  let arrayBuffer;
  if (audioSource instanceof File || audioSource instanceof Blob) {
    arrayBuffer = await audioSource.arrayBuffer();
  } else if (audioSource instanceof ArrayBuffer) {
    arrayBuffer = audioSource;
  } else {
    throw new Error("Invalid audio input source");
  }

  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer.slice(0));
  return {
    audioBuffer,
    duration: audioBuffer.duration,
    sampleRate: audioBuffer.sampleRate,
    channels: audioBuffer.numberOfChannels
  };
}

/**
 * Performs AI Audio Forensics analysis on an AudioBuffer
 * @param {AudioBuffer} audioBuffer
 * @returns {Object} Forensics report including safety score, metrics & spectral graph
 */
export function analyzeAudioForensics(audioBuffer) {
  const channelData = audioBuffer.getChannelData(0); // Analyze mono channel
  const sampleRate = audioBuffer.sampleRate;
  const totalSamples = channelData.length;

  // 1. Zero Crossing Rate (ZCR) Calculation
  let zeroCrossings = 0;
  for (let i = 1; i < totalSamples; i++) {
    if ((channelData[i] >= 0 && channelData[i - 1] < 0) || (channelData[i] < 0 && channelData[i - 1] >= 0)) {
      zeroCrossings++;
    }
  }
  const zcr = zeroCrossings / totalSamples;

  // 2. RMS Energy & Noise Floor Analysis
  let sumSquare = 0;
  let maxAmp = 0;
  let silentSamples = 0;
  let silentNoiseSum = 0;

  const frameSize = 1024;
  const numFrames = Math.floor(totalSamples / frameSize);
  const frameEnergies = [];

  for (let f = 0; f < numFrames; f++) {
    let frameSum = 0;
    for (let i = 0; i < frameSize; i++) {
      const val = channelData[f * frameSize + i];
      frameSum += val * val;
      const absVal = Math.abs(val);
      if (absVal > maxAmp) maxAmp = absVal;
    }
    const frameRms = Math.sqrt(frameSum / frameSize);
    frameEnergies.push(frameRms);
    sumSquare += frameSum;

    if (frameRms < 0.01) { // Silence threshold
      silentSamples++;
      silentNoiseSum += frameRms;
    }
  }

  const overallRms = Math.sqrt(sumSquare / totalSamples);
  const avgSilentNoiseFloor = silentSamples > 0 ? silentNoiseSum / silentSamples : 0.0001;

  // 3. FFT Spectral & Formant Micro-Analysis (Simulated spectral bins over time)
  const spectrogramData = [];
  const pitchJitterPoints = [];
  let highFreqArtifactCount = 0;
  let roboticPitchFlatness = 0;
  let phaseSmearingCount = 0;

  const numBins = 64;
  for (let f = 0; f < Math.min(numFrames, 120); f++) {
    const frameBin = new Array(numBins).fill(0);
    const startIdx = f * frameSize;
    
    // Simple DFT approximation for spectrogram visualization
    for (let b = 0; b < numBins; b++) {
      let real = 0, imag = 0;
      const k = b * (frameSize / numBins / 2);
      for (let n = 0; n < frameSize; n += 4) { // Subsampled FFT for speed
        const angle = (2 * Math.PI * k * n) / frameSize;
        const sample = channelData[startIdx + n] || 0;
        real += sample * Math.cos(angle);
        imag -= sample * Math.sin(angle);
      }
      const mag = Math.sqrt(real * real + imag * imag) / (frameSize / 8);
      frameBin[b] = Math.min(1, mag * 2.5);

      // Check high frequency artifacts (bins > 48 represent > 14kHz)
      if (b > 48 && mag > 0.35) {
        highFreqArtifactCount++;
      }
    }

    spectrogramData.push(frameBin);

    // Estimate fundamental pitch contour stability
    let maxBinIdx = 0;
    let maxBinVal = 0;
    for (let b = 2; b < 24; b++) { // Search speech fundamental frequency range ~80Hz - 400Hz
      if (frameBin[b] > maxBinVal) {
        maxBinVal = frameBin[b];
        maxBinIdx = b;
      }
    }
    const estimatedPitchHz = (maxBinIdx * (sampleRate / frameSize)) * 2;
    pitchJitterPoints.push(estimatedPitchHz);
  }

  // Calculate Pitch Micro-Jitter Variance
  let pitchDiffSum = 0;
  for (let i = 1; i < pitchJitterPoints.length; i++) {
    const diff = Math.abs(pitchJitterPoints[i] - pitchJitterPoints[i - 1]);
    pitchDiffSum += diff;
    if (diff < 0.5 && pitchJitterPoints[i] > 50) {
      roboticPitchFlatness++;
    }
  }
  const avgPitchJitter = pitchJitterPoints.length > 1 ? pitchDiffSum / (pitchJitterPoints.length - 1) : 5;

  // 4. Deepfake Neural Vocoder Anomaly Rating Score Calculation
  // Synthetic AI voice cloning (ElevenLabs, Tortoise, Bark) usually exhibits:
  // - Unnatural zero noise floor in silent pauses (clean digital silence)
  // - High-frequency phase smearing >12kHz
  // - Hyper-flat pitch trajectories or unnatural step jumps
  
  let syntheticDeductions = 0;

  // Check silent noise floor (AI TTS often has 0 noise floor, human mics have room noise)
  if (avgSilentNoiseFloor < 0.0002) {
    syntheticDeductions += 25; // Abnormally sterile silence
  }

  // Check robotic pitch flatness ratio
  const pitchFlatnessRatio = roboticPitchFlatness / Math.max(1, pitchJitterPoints.length);
  if (pitchFlatnessRatio > 0.45) {
    syntheticDeductions += 30; // Robotic pitch trajectory
  }

  // Check high frequency neural vocoder artifacts
  if (highFreqArtifactCount > 15) {
    syntheticDeductions += 25; // Phase smearing / metallic aliasing
  }

  // Calculate Final Authenticity Score (0.0% to 100.0%)
  const rawScore = Math.max(10, 100 - syntheticDeductions);
  // Convert score to 2 decimal string & int (e.g., 94.50% -> 9450 out of 10000)
  const authenticityScoreInt = Math.round(rawScore * 100);

  // Verdict Classification
  let verdict = "Authentic Human Voice";
  let confidenceLevel = "High Confidence";
  let deepfakeRisk = "Low Risk";

  if (rawScore < 45) {
    verdict = "AI Deepfake / Synthetic TTS Detected";
    confidenceLevel = "Very High Confidence";
    deepfakeRisk = "CRITICAL RISK";
  } else if (rawScore < 75) {
    verdict = "Potential AI Voice Clone / Processed Audio";
    confidenceLevel = "Moderate Confidence";
    deepfakeRisk = "MODERATE RISK";
  }

  return {
    authenticityScorePercent: rawScore.toFixed(1),
    authenticityScoreInt,
    verdict,
    confidenceLevel,
    deepfakeRisk,
    metrics: {
      zeroCrossingRate: (zcr * 100).toFixed(2) + "%",
      rmsVolume: (overallRms * 100).toFixed(2) + " dB",
      noiseFloorDb: (avgSilentNoiseFloor * 1000).toFixed(3),
      pitchMicroJitter: avgPitchJitter.toFixed(2) + " Hz",
      roboticPitchFlatness: (pitchFlatnessRatio * 100).toFixed(1) + "%",
      neuralArtifactCount: highFreqArtifactCount,
      sampleRate: sampleRate + " Hz",
      duration: audioBuffer.duration.toFixed(2) + "s",
      channels: audioBuffer.numberOfChannels === 1 ? "Mono" : "Stereo"
    },
    spectrogramData,
    waveformPoints: extractWaveformPoints(channelData, 100)
  };
}

/**
 * Extracts a downsampled waveform array for SVG / Canvas rendering
 */
function extractWaveformPoints(channelData, numPoints = 100) {
  const points = [];
  const step = Math.floor(channelData.length / numPoints);
  for (let i = 0; i < numPoints; i++) {
    let max = 0;
    for (let j = 0; j < step; j++) {
      const val = Math.abs(channelData[i * step + j] || 0);
      if (val > max) max = val;
    }
    points.push(Math.min(1, max * 1.2));
  }
  return points;
}
