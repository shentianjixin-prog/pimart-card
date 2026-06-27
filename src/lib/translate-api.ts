import type { Lang } from "./translations";

const cache = new Map<string, string>();

export async function translateText(text: string, to: Lang): Promise<string> {
  if (!text?.trim() || to === "zh") return text;
  const key = `${to}::${text}`;
  if (cache.has(key)) return cache.get(key)!;

  try {
    const langpair = to === "ja" ? "zh-CN|ja" : "zh-CN|en-US";
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langpair}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return text;
    const json = await res.json();
    const result: string = json.responseData?.translatedText ?? text;
    if (result && result !== "MYMEMORY WARNING") {
      cache.set(key, result);
      return result;
    }
    return text;
  } catch {
    return text;
  }
}

export async function translateProduct<
  T extends { name: string; series?: string | null; category?: string; description?: string | null },
>(product: T, lang: Lang): Promise<T> {
  if (lang === "zh") return product;
  const [name, series, category, description] = await Promise.all([
    translateText(product.name, lang),
    product.series ? translateText(product.series, lang) : Promise.resolve(product.series),
    product.category !== undefined ? translateText(product.category, lang) : Promise.resolve(product.category),
    product.description ? translateText(product.description, lang) : Promise.resolve(product.description),
  ]);
  return { ...product, name, series, category, description };
}
