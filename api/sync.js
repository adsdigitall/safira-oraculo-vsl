const RESTFUL_API_URL = 'https://api.restful-api.dev/objects/ff8081819f7e10ae019fe379792b1343';
const JSONBLOB_API_URL = 'https://jsonblob.com/api/jsonBlob/019fe372-bd36-7f3c-b70b-b0b84fca9a26';

let memoryConfig = null;

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
        memoryConfig = data;

        // AWAIT a escrita na nuvem para não ser congelada pela Vercel!
        await Promise.allSettled([
          fetch(RESTFUL_API_URL, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'safira_config', data: memoryConfig }),
          }),
          fetch(JSONBLOB_API_URL, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(memoryConfig),
          }),
        ]);

        return res.status(200).json({ ok: true, config: memoryConfig });
      }
    } catch (e) {
      return res.status(400).json({ error: 'Invalid payload' });
    }
  }

  // Tenta retornar da memória local do container
  if (memoryConfig && Object.keys(memoryConfig).length > 0) {
    return res.status(200).json(memoryConfig);
  }

  // Se for cold-start (container novo), busca obrigatoriamente da nuvem RESTful
  try {
    const cloudRes = await fetch(RESTFUL_API_URL);
    if (cloudRes.ok) {
      const cloudData = await cloudRes.json();
      if (cloudData && cloudData.data && typeof cloudData.data === 'object') {
        memoryConfig = cloudData.data;
        return res.status(200).json(memoryConfig);
      }
    }
  } catch (e) {}

  // Fallback para JSONBlob se RESTful falhar
  try {
    const blobRes = await fetch(JSONBLOB_API_URL);
    if (blobRes.ok) {
      const blobData = await blobRes.json();
      if (blobData && typeof blobData === 'object' && !blobData.error) {
        memoryConfig = blobData;
        return res.status(200).json(memoryConfig);
      }
    }
  } catch (e) {}

  return res.status(200).json({});
}
