// lib/fetchWithBaseUrl.ts
export const fetchWithBaseUrl = async (path: string, options?: RequestInit) => {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";
  
  return fetch(`${baseUrl}${path}`, options);
};