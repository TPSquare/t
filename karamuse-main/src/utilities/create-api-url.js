export default function createApiUrl(url, query) {
  const queryString = Object.entries(query)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  return `${url}?${queryString}`;
}
