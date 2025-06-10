export default function getProxyUrl(path) {
  if (!path) return null;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  return `${baseUrl}/api/local-proxy?path=${encodeURIComponent(path)}`;
}
