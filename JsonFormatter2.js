let rawText = "";

try {
  // 1. Safely extract text using optional chaining
  rawText = $json?.candidates?.[0]?.content?.parts?.[0]?.text || "";
} catch (error) {
  rawText = "";
}

let parsedData = {};

// 2. Clean up markdown block formatting if present
if (rawText.startsWith("```")) {
  const firstNewline = rawText.indexOf('\n');
  if (firstNewline !== -1) {
    rawText = rawText.substring(firstNewline + 1);
  }
  if (rawText.endsWith("```")) {
    rawText = rawText.substring(0, rawText.length - 3);
  }
  rawText = rawText.trim();
}

// 3. Robust JSON Parsing with Fallbacks
try {
  parsedData = JSON.parse(rawText);
} catch (e) {
  // Fallback: extract substring between braces
  const firstBrace = rawText.indexOf('{');
  const lastBrace = rawText.lastIndexOf('}');
  
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    try {
      parsedData = JSON.parse(rawText.substring(firstBrace, lastBrace + 1));
    } catch (err) {
      parsedData = { _error: true };
    }
  } else {
      parsedData = { _error: true };
  }
}

// Safely access webhook node
let originalMessage = "";
try {
  originalMessage = $node["Webhook"]?.json?.body?.message || "";
} catch(e) {}

// Return structured data with fallbacks
return {
    category: parsedData.category || "Unknown",
    priority_score: parsedData.priority_score || 0,
    reasoning: parsedData.reasoning || (parsedData._error ? "Failed to parse AI output." : "No reason provided."),
    next_action: parsedData.next_action || "Manual Review",
    draft_reply: parsedData.draft_reply || "",
    
    // Pass along error status so n8n can branch or alert
    _json_parse_error: !!parsedData._error,
    
    // Pulling the original message forward for your 'Source of Truth'
    original_message: originalMessage
};