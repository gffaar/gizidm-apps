const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

function normalizeLocalUrl(value) {
  if (!/^https?:\/\//i.test(value)) {
    return value;
  }

  try {
    const url = new URL(value);

    if (LOCAL_HOSTS.has(url.hostname)) {
      return url.pathname || "";
    }

    return value;
  } catch {
    return value;
  }
}

function normalizeStoragePath(value) {
  let normalized = value.replace(/\\/g, "/");
  normalized = normalized.replace(/^public\/storage\//, "storage/");

  const publicStorageIndex = normalized.indexOf("/public/storage/");
  if (publicStorageIndex >= 0) {
    return normalized.slice(publicStorageIndex + "/public/".length);
  }

  const storagePublicIndex = normalized.indexOf("/storage/app/public/");
  if (storagePublicIndex >= 0) {
    return `storage/${normalized.slice(
      storagePublicIndex + "/storage/app/public/".length,
    )}`;
  }

  if (normalized.startsWith("storage/app/public/")) {
    return `storage/${normalized.slice("storage/app/public/".length)}`;
  }

  return normalized;
}

export function storageUrl(path, fallback = "/no_image.jpg") {
  const rawValue = typeof path === "string" ? path.trim() : "";

  if (!rawValue) {
    return fallback;
  }

  const value = normalizeStoragePath(normalizeLocalUrl(rawValue));

  if (!value) {
    return fallback;
  }

  if (/^(blob:|data:|https?:\/\/)/i.test(value)) {
    return value;
  }

  if (value.startsWith("/")) {
    return value;
  }

  if (value.startsWith("storage/")) {
    return `/${value}`;
  }

  return `/storage/${value.replace(/^\/+/, "")}`;
}
