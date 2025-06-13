import axios from 'axios';

const CATALOG_API_URL = process.env.CATALOG_API_URL;

if (!CATALOG_API_URL) {
  throw new Error('CATALOG_API_URL no está definida en las variables de entorno');
}


export async function fetchCatalogGameById(id: string, token?: string) {
  const headers = token ? { Authorization: token } : {};
  const res = await axios.get(`${CATALOG_API_URL}/catalog/${id}`, { headers });
  return res.data?.data;
}
