for (const item of $input.all()) {
    // Grab the text from the Guardrails node
    let rawText = item.json.guardrailsInput || "";

    // Clean off the "[object Object]" glitch so we have pure text
    let cleanText = rawText.replace("[object Object]", "").trim();

    // Define our Regex patterns for extraction
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
    const urlRegex = /(https?:\/\/[^\s]+|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/gi;

    // Execute the extraction on the cleaned text
    item.json.extracted_emails = cleanText.match(emailRegex) || [];
    item.json.extracted_urls = cleanText.match(urlRegex) || [];

    // Reconstruct the 'body.message' object so your Gemini prompt 
    // (which looks for {{ $json.body.message }}) still works perfectly.
    item.json.body = {
        message: cleanText
    };
}

return $input.all();