import dns from 'dns';
import { promisify } from 'util';

const lookupAsync = promisify(dns.lookup);

/**
 * Checks if an IPv4 address is in a private, loopback, or reserved range.
 */
function isPrivateIPv4(ip: string): boolean {
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) {
    return true; // Invalid format treated as unsafe
  }

  const [a, b] = parts;

  // 0.0.0.0/8 (Current network)
  if (a === 0) return true;
  // 10.0.0.0/8 (Private A)
  if (a === 10) return true;
  // 127.0.0.0/8 (Loopback)
  if (a === 127) return true;
  // 100.64.0.0/10 (Shared address / CGNAT)
  if (a === 100 && b >= 64 && b <= 127) return true;
  // 169.254.0.0/16 (Link-local / Cloud Metadata)
  if (a === 169 && b === 254) return true;
  // 172.16.0.0/12 (Private B: 172.16.0.0 - 172.31.255.255)
  if (a === 172 && b >= 16 && b <= 31) return true;
  // 192.0.0.0/24, 192.0.2.0/24 (TEST-NET-1)
  if (a === 192 && b === 0) return true;
  // 192.168.0.0/16 (Private C)
  if (a === 192 && b === 168) return true;
  // 198.18.0.0/15 (Benchmarking)
  if (a === 198 && (b === 18 || b === 19)) return true;
  // 198.51.100.0/24 (TEST-NET-2)
  if (a === 198 && b === 51) return true;
  // 203.0.113.0/24 (TEST-NET-3)
  if (a === 203 && b === 0) return true;
  // 224.0.0.0/4 (Multicast) & 240.0.0.0/4 (Reserved)
  if (a >= 224) return true;

  return false;
}

/**
 * Checks if an IPv6 address is in a private, loopback, or reserved range.
 */
function isPrivateIPv6(ip: string): boolean {
  const normalized = ip.toLowerCase();
  if (normalized === '::1' || normalized === '::') return true;
  if (normalized.startsWith('fc') || normalized.startsWith('fd')) return true; // Unique Local (ULA)
  if (normalized.startsWith('fe80:')) return true; // Link-local
  if (normalized.startsWith('::ffff:')) {
    // IPv4-mapped IPv6 address
    const ipv4 = normalized.replace('::ffff:', '');
    return isPrivateIPv4(ipv4);
  }
  return false;
}

/**
 * Validates a target URL against SSRF threats.
 * Returns an error string if unsafe, or null if safe.
 */
export async function validateUrlForSsrf(rawUrl: string): Promise<{ valid: boolean; error?: string; url?: URL }> {
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(rawUrl);
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }

  // 1. Protocol whitelist (http and https only)
  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    return { valid: false, error: `Disallowed protocol "${parsedUrl.protocol}". Only HTTP and HTTPS are permitted.` };
  }

  // 2. Port whitelist (Standard HTTP/HTTPS ports only)
  const port = parsedUrl.port ? parseInt(parsedUrl.port, 10) : parsedUrl.protocol === 'https:' ? 443 : 80;
  if (port !== 80 && port !== 443 && port !== 8080 && port !== 8443) {
    return { valid: false, error: `Disallowed port "${port}". Only standard web ports are permitted.` };
  }

  const hostname = parsedUrl.hostname.toLowerCase();

  // 3. Reject forbidden hostnames
  const forbiddenHostnames = [
    'localhost',
    '127.0.0.1',
    '0.0.0.0',
    '::1',
    'metadata.google.internal',
    'metadata',
    'instance-data',
  ];
  if (forbiddenHostnames.includes(hostname) || hostname.endsWith('.internal') || hostname.endsWith('.local') || hostname.endsWith('.localhost')) {
    return { valid: false, error: 'Access to internal or local hostnames is prohibited.' };
  }

  // 4. Resolve DNS and check resulting IP addresses
  try {
    const lookupResult = await lookupAsync(hostname, { all: true });
    if (!lookupResult || lookupResult.length === 0) {
      return { valid: false, error: 'Host could not be resolved via DNS' };
    }

    for (const entry of lookupResult) {
      if (entry.family === 4 && isPrivateIPv4(entry.address)) {
        return { valid: false, error: `Host resolves to private or loopback IPv4 address (${entry.address})` };
      }
      if (entry.family === 6 && isPrivateIPv6(entry.address)) {
        return { valid: false, error: `Host resolves to private or loopback IPv6 address (${entry.address})` };
      }
    }
  } catch (err: any) {
    return { valid: false, error: `DNS resolution failed: ${err.message}` };
  }

  return { valid: true, url: parsedUrl };
}
