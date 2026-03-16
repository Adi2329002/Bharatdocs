"use server";

export const translateText = async (text: string, source: string, target: string): Promise<string> => {
  if (!text.trim()) return "";

  // 1. Force explicit language codes. 
  // Google's 'gtx' endpoint prefers 'hi', 'or', 'bn' etc.
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t&q=${encodeURIComponent(text)}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0", 
      },
      next: { revalidate: 3600 } 
    });

    if (!res.ok) throw new Error("API_FAILURE");

    const data = await res.json();
    
    // 2. Stitch the translated parts back together correctly
    // Google returns an array of segments; we must join them to keep the meaning.
    return data[0].map((part: any) => part[0]).join("");
  } catch (error) {
    console.error("Translation Error:", error);
    throw error;
  }
};