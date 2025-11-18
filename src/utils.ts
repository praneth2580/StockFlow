export const SCRIPT_ID = localStorage.getItem('VITE_GOOGLE_SCRIPT_ID');
export const SCRIPT_URL = `https://script.google.com/macros/s/${SCRIPT_ID}/exec`;


export function jsonpRequest<T>(
  sheet: string,
  params: Record<string, string> = {}
): Promise<T[]> {
  return new Promise((resolve, reject) => {
    if (typeof document === "undefined") {
      reject("Not running in a browser environment");
      return;
    }

    const callbackName = `jsonp_cb_${Date.now()}_${Math.floor(
      Math.random() * 1000
    )}`;
    (window as any)[callbackName] = (response: any) => {
      try {
        console.log(`✅ JSONP Response [${sheet}]`, response);
        resolve(Array.isArray(response) ? response : response.data || []);
      } catch (err) {
        reject(err);
      } finally {
        delete (window as any)[callbackName];
        if (script.parentNode) script.parentNode.removeChild(script);
      }
    };

    const query = new URLSearchParams({
      sheet,
      callback: callbackName,
      ...params,
    }).toString();

    const script = document.createElement("script");
    script.src = `${SCRIPT_URL}?${query}`;
    script.async = true;
    script.onerror = () => {
      delete (window as any)[callbackName];
      reject(new Error(`JSONP request failed for ${sheet}`));
    };

    document.body.appendChild(script);
  });
}

export function parseAttributes(input: string): Record<string, string> {
  try {
    return JSON.parse(input);
  } catch {
    return Object.fromEntries(
      input.split(",")
        .map(p => p.split("="))
        .filter(([k, v]) => k && v)
        .map(([k, v]) => [k.trim(), v.trim()])
    );
  }
}
