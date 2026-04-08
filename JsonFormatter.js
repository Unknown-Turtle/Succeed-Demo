const rawText = $json.candidates[0].content.parts[0].text;
const parsedData = JSON.parse(rawText);

return {
  category: parsedData.category,
  priority_score: parsedData.priority_score,
  reasoning: parsedData.reasoning,
  next_action: parsedData.next_action,
  draft_reply: parsedData.draft_reply,
  // Pulling the original message forward for your 'Source of Truth'
  original_message: $node["Webhook"].json.body.message
};