for (const item of $input.all()) {
  // Grab the incoming message from the webhook payload
  const text = item.json.body?.message || item.json.message || "";

  // Define our Regex patterns for extraction
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
  const urlRegex = /(https?:\/\/[^\s]+|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/gi;

  // Execute the extraction
  item.json.extracted_emails = text.match(emailRegex) || [];
  item.json.extracted_urls = text.match(urlRegex) || [];

}
return $input.all();