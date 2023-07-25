export function parseURL(url: string, params: Record<string, string> = {}) {
  let parsedUrl = url;
  for (const key in params) {
    const value = params[key] ?? "";

    const regex = new RegExp(`{\\??${key}}`, "g");

    parsedUrl = parsedUrl.replace(regex, value);
  }
  return parsedUrl;
}
