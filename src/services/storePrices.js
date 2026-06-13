/**
 * Fetches a live price multiplier for a given store by querying a small
 * basket of reference items and comparing against AH baseline prices.
 *
 * Stores supported with live fetch: jumbo, lidl
 * AH is the baseline (multiplier = 1.0, no fetch needed).
 * All other stores fall back to the hardcoded STORE_MULTIPLIERS value.
 *
 * Results are cached for 1 hour in sessionStorage.
 */

// Reference basket — items that are stocked at all major NL supermarkets.
// AH prices are the baseline (from INGREDIENT_DB calibration, 2026-06).
const BASKET = [
  { nlQuery: "volle melk",  ahPrice: 1.09 },  // 1L carton
  { nlQuery: "eieren 6",    ahPrice: 2.89 },  // 6-pack
  { nlQuery: "spaghetti",   ahPrice: 1.09 },  // 500g bag
];

const CACHE_TTL = 60 * 60 * 1000; // 1 hour
const TIMEOUT_MS = 5000;

// ── helpers ──────────────────────────────────────────────────────────────────

const cacheKey = (store) => `storePriceMultiplier_${store}`;

const readCache = (store) => {
  try {
    const raw = sessionStorage.getItem(cacheKey(store));
    if (!raw) return null;
    const { multiplier, ts } = JSON.parse(raw);
    if (Date.now() - ts < CACHE_TTL) return multiplier;
  } catch {}
  return null;
};

const writeCache = (store, multiplier) => {
  try {
    sessionStorage.setItem(cacheKey(store), JSON.stringify({ multiplier, ts: Date.now() }));
  } catch {}
};

const fetchWithTimeout = (url, opts = {}) => {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  return fetch(url, { ...opts, signal: ctrl.signal }).finally(() => clearTimeout(timer));
};

// Average ratio from valid price pairs; returns null if no pairs resolved.
const avgRatio = (pairs) => {
  const valid = pairs.filter((p) => p !== null);
  if (valid.length === 0) return null;
  return valid.reduce((a, b) => a + b, 0) / valid.length;
};

// ── Jumbo ─────────────────────────────────────────────────────────────────────
// Jumbo's mobile API is accessible from the browser without auth.
// Price is returned in euro-cents in .prices.price.amount

const fetchJumboMultiplier = async () => {
  const pairs = await Promise.all(
    BASKET.map(async ({ nlQuery, ahPrice }) => {
      try {
        const r = await fetchWithTimeout(
          `https://mobileapi.jumbo.com/v17/search?q=${encodeURIComponent(nlQuery)}&limit=1`,
          { headers: { "Content-Type": "application/json" } }
        );
        const d = await r.json();
        const cents = d?.products?.data?.[0]?.prices?.price?.amount;
        if (!cents) return null;
        return cents / 100 / ahPrice;
      } catch {
        return null;
      }
    })
  );
  return avgRatio(pairs);
};

// ── Lidl ──────────────────────────────────────────────────────────────────────
// Lidl NL product search — uses the Lidl Plus / shop API.
// Endpoint may vary; falls back gracefully if CORS-blocked.

const fetchLidlMultiplier = async () => {
  const pairs = await Promise.all(
    BASKET.map(async ({ nlQuery, ahPrice }) => {
      try {
        const r = await fetchWithTimeout(
          `https://api.lidl.com/vsc/public/v1/search?q=${encodeURIComponent(nlQuery)}&language=nl-NL&limit=1`
        );
        const d = await r.json();
        // Response shape: data[].price.price (float) or data[].price.amount/100
        const item = d?.data?.[0];
        const price = item?.price?.price ?? (item?.price?.amount != null ? item.price.amount / 100 : null);
        if (!price) return null;
        return price / ahPrice;
      } catch {
        return null;
      }
    })
  );
  return avgRatio(pairs);
};

// ── public API ────────────────────────────────────────────────────────────────

/**
 * Returns a live price multiplier for `storeKey` vs the AH baseline.
 * Falls back to `fallback` if the fetch fails or the store has no live endpoint.
 *
 * @param {string} storeKey  - e.g. "jumbo", "lidl", "ah"
 * @param {number} fallback  - hardcoded multiplier to use on failure
 * @returns {Promise<number>}
 */
export const fetchStoreMultiplier = async (storeKey, fallback) => {
  if (storeKey === "ah") return 1.0;

  const cached = readCache(storeKey);
  if (cached !== null) return cached;

  try {
    let multiplier = null;
    if (storeKey === "jumbo") multiplier = await fetchJumboMultiplier();
    if (storeKey === "lidl")  multiplier = await fetchLidlMultiplier();

    if (multiplier !== null && multiplier > 0.5 && multiplier < 2.5) {
      writeCache(storeKey, multiplier);
      return multiplier;
    }
  } catch {
    // network or parse error — use fallback
  }

  return fallback;
};

/** Clear the cached multiplier for a store (e.g. to force a refresh). */
export const clearStoreCache = (storeKey) => {
  try { sessionStorage.removeItem(cacheKey(storeKey)); } catch {}
};
