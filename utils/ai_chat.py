from groq import Groq
import os

client = Groq(api_key=os.getenv("YOUR_GROQ_API_KEY"))  # Replace with your actual API key or environment variable

def get_ai_reply(message):
    try:
        res = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": "You are a financial advisor for India."},
                {"role": "user", "content": message}
            ]
        )

        return res.choices[0].message.content

    except Exception as e:
        print("🔥 GROQ ERROR:", e)   # IMPORTANT
        return "AI service is currently unavailable."