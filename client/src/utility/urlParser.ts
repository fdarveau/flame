export const urlParser = (url: string): string[] => {
  let displayUrl: string;
  let parsedUrl: string;

  if (/https?:\/\//.test(url)) {
    // Url starts with http[s]:// -> leave it as it is
    parsedUrl = url;
  } else {
    // No protocol -> apply http:// prefix
    parsedUrl = `https://${url}`;
  }

  // Create simplified url to display as text
  displayUrl = url
    .replace(/https?:\/\//, '')
    .replace('www.', '')
    .replace(/\/$/, '');

  return [displayUrl, parsedUrl]
}