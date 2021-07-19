export const urlParser = (url: string): string[] => {
  let displayUrl: string;
  let parsedUrl: string;

  if (/(https?|steam):\/\//.test(url)) {
    // Url starts with http[s]:// or steam:// -> leave it as it is
    parsedUrl = url;
  } else {
    // No protocol -> apply http:// prefix
    parsedUrl = `https://${url}`;
  }

  // Create simplified url to display as text
  if (/steam:\/\//.test(url)) {
    displayUrl = 'Run Steam App';
  } else {
    displayUrl = url
    .replace(/https?:\/\//, '')
    .replace('www.', '')
    .replace(/\/$/, '');
  }
  
  return [displayUrl, parsedUrl]
}