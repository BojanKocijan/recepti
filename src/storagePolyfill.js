// Polyfill for window.storage, used by the meal planner for persistence.
// In the Claude Artifacts environment, window.storage is provided automatically
// and backed by a server-side key/value store. When running this app standalone
// (e.g. deployed from GitHub), we provide a compatible localStorage-based shim
// so the same code works without any changes.
//
// API:
//   window.storage.get(key, shared?)    -> { key, value, shared } | null
//   window.storage.set(key, value, shared?) -> { key, value, shared } | null
//   window.storage.delete(key, shared?) -> { key, deleted, shared } | null
//   window.storage.list(prefix?, shared?) -> { keys, prefix?, shared } | null

if (typeof window !== "undefined" && !window.storage) {
  const PREFIX = "meal-planner:";

  window.storage = {
    async get(key, shared = false) {
      const raw = localStorage.getItem(PREFIX + key);
      if (raw === null) {
        throw new Error(`Key not found: ${key}`);
      }
      return { key, value: raw, shared };
    },

    async set(key, value, shared = false) {
      try {
        localStorage.setItem(PREFIX + key, value);
        return { key, value, shared };
      } catch (e) {
        console.error("storage.set failed", e);
        return null;
      }
    },

    async delete(key, shared = false) {
      try {
        localStorage.removeItem(PREFIX + key);
        return { key, deleted: true, shared };
      } catch (e) {
        console.error("storage.delete failed", e);
        return null;
      }
    },

    async list(prefix = "", shared = false) {
      try {
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith(PREFIX)) {
            const stripped = k.slice(PREFIX.length);
            if (!prefix || stripped.startsWith(prefix)) keys.push(stripped);
          }
        }
        return { keys, prefix, shared };
      } catch (e) {
        console.error("storage.list failed", e);
        return null;
      }
    },
  };
}
