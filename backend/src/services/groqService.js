/**
 * Groq AI: personalized workout/diet plan suggestion
 */
async function callGroq({ system, prompt, temperature=0.35, max_tokens=260 }){
  const apiKey = process.env.GROQ_API_KEY;
  if(!apiKey) throw new Error("GROQ_API_KEY missing in .env");

  const model = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: prompt }
      ],
      temperature,
      max_tokens
    })
  });

  const data = await response.json();
  if(!response.ok){
    const msg = data?.error?.message || "Groq API error";
    throw new Error(msg);
  }

  return data?.choices?.[0]?.message?.content?.trim() || "";
}

export async function generatePlan({ name, planType, trainer, heightCm, weightKg, goal, attendanceCount }){
  const system = "You are a fitness coach AI. Generate safe workout + diet suggestions for a student demo app.";
  const prompt = `Member info:
- name: ${name}
- membership plan: ${planType}
- assigned trainer: ${trainer}
- height: ${heightCm} cm
- weight: ${weightKg} kg
- goal: ${goal}
- attendance count: ${attendanceCount}

Create a personalized plan:
1) Workout split (weekly)
2) Diet guidance (veg/non-veg options)
3) Safety tips (avoid injury)
Keep it under 180 words.`;

  return callGroq({ system, prompt, temperature: 0.35, max_tokens: 260 });
}
