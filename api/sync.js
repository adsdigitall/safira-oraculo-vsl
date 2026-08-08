let currentConfig = null;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST' || req.method === 'PUT') {
    try {
      const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (data && typeof data === 'object' && !data.error) {
        currentConfig = data;
        return res.status(200).json({ ok: true, config: currentConfig });
      }
    } catch (e) {
      return res.status(400).json({ error: 'Invalid payload' });
    }
  }

  if (currentConfig) {
    return res.status(200).json(currentConfig);
  }

  return res.status(200).json({});
}
