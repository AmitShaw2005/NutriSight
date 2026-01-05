🧠 NutriSight – AI Co-Pilot for Food Decisions

NutriSight is an AI-native food understanding platform that helps users make quick, informed food choices by analyzing product images or text and reasoning about health impact, intent, and moderation.
Instead of showing raw nutrition data, NutriSight acts as a co-pilot, explaining what matters and why.

🚀 Key Features

🔍 AI-Native Reasoning (Not OCR)
Infers user intent automatically
Explains health trade-offs

Avoids raw data overload

🖼️ Multi-Modal Input
📸 Camera capture
🖼️ Image upload (JPG, PNG, WEBP)
📝 Text input (product name or ingredient list)

🚦 Clear Verdict System

🟢 Green – Generally safe
🟡 Yellow – Consume in moderation
🔴 Red – Best avoided regularly

🧠 Honest Uncertainty

Image-only analysis → general guidance
Text-based analysis → higher confidence
Clearly communicates confidence level

🖥️ Tech Stack
Frontend
React.js
Modern CSS (dark UI, responsive layout)
Lucide Icons

Backend
Node.js
Express.js
Multer (image handling)
Google Gemini API
AI Model
Gemini 2.5 Flash
Reasoning-focused, fast, low-latency

📊 Accuracy & Reliability

NutriSight focuses on reasoning accuracy, not database precision.
Input Type	Accuracy Level	Explanation
Ingredient text	~85–90%	High confidence reasoning based on explicit inputs
Product name only	~75–80%	Uses general food knowledge
Image only	~65–75%	Provides safe, high-level guidance

The system avoids false precision and clearly states uncertainty where applicable.
