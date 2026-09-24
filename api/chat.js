export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { prompt, apiKey } = req.body;
  if (!prompt || !apiKey) {
    return res.status(400).json({ error: 'Missing prompt or apiKey' });
  }

  try {
    let url = 'https://api.openai.com/v1/chat/completions';
    let modelName = 'gpt-4o-mini';
    let headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    };

    if (apiKey.startsWith('sk-or-')) {
      url = 'https://openrouter.ai/api/v1/chat/completions';
      modelName = 'openai/gpt-4o-mini'; // Using 4o-mini via OpenRouter
      headers['HTTP-Referer'] = 'https://yayathspaces.com';
      headers['X-Title'] = 'Yayath Spaces';
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        model: modelName,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();
    if (data.error) {
      return res.status(response.status).json(data);
    }

    res.status(200).json({ text: data.choices[0].message.content });
  } catch (error) {
    console.error('OpenAI Error:', error);
    res.status(500).json({ error: error.message });
  }
}
