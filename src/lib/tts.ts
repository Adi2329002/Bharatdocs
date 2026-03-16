"use server";

import {SarvamAIClient } from "sarvamai";

// Initialize the client once
const client = new SarvamAIClient({
  apiSubscriptionKey: process.env.SARVAM_AI_API_KEY!,
});

export const generateSpeech = async (text: string, languageCode: string) => {
  if (!text.trim()) return null;

  // Sarvam SDK expects BCP-47 format (e.g., 'hi-IN')
  if(languageCode === 'or') languageCode = 'od'; // Sarvam uses 'od' for Odia
  const sarvamLanguageCode = languageCode.includes("-") 
    ? languageCode 
    : `${languageCode}-IN`;

  try {
    const response = await client.textToSpeech.convert({
      inputs: [text],
      target_language_code: sarvamLanguageCode as any,
      speaker: "aditya", // Valid speaker from Bulbul v3 roster
      model: "bulbul:v3", // Use the latest v3 model for better prosody
      speech_sample_rate: 22050,
    });

    // The SDK typically returns the audio as an array of base64 strings
    if (response && response.audios && response.audios.length > 0) {
      return response.audios[0];
    }
    
    throw new Error("No audio returned from SDK");
  } catch (error: any) {
    console.error("Sarvam SDK Error:", error);
    // The SDK throws specific ApiError types which help in debugging
    throw new Error(error.message || "Failed to generate speech");
  }
};