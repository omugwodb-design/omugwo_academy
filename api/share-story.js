const json = (res, status, payload) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
};

export default async function handler(req, res) {
  res.setHeader('Allow', 'POST');
  return json(res, 410, {
    error: 'This endpoint has been retired. Share Your Story now writes directly to Supabase from the client.',
  });
}
