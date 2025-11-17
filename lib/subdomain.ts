type Options = {
  baseDomain: string;
  mainSubdomain?: string;
  allowedSlugs: string[];
};

function normalizeHost(hostname: string | null) {
  if (!hostname) return "";
  return hostname.split(":")[0].toLowerCase();
}

export function resolveToolSubdomain(hostname: string | null, options: Options) {
  const host = normalizeHost(hostname);
  if (!host || host === "localhost") return null;

  const baseDomain = options.baseDomain.replace(/^www\./, "").toLowerCase();
  const baseParts = baseDomain.split(".");
  const hostParts = host.replace(/^www\./, "").split(".");

  // Ensure the host matches the base domain and has at least one subdomain part.
  if (
    hostParts.length <= baseParts.length ||
    hostParts.slice(-baseParts.length).join(".") !== baseDomain
  ) {
    return null;
  }

  const subdomain = hostParts.slice(0, hostParts.length - baseParts.length).join(".");

  if (!subdomain || subdomain === options.mainSubdomain) {
    return null;
  }

  return options.allowedSlugs.includes(subdomain) ? subdomain : null;
}
