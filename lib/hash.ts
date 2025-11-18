import { md5 } from "@noble/hashes/legacy.js";
import { sha256, sha512 } from "@noble/hashes/sha2.js";
import { bytesToHex } from "@noble/hashes/utils.js";

export type HashAlgorithm = "md5" | "sha256" | "sha512";

export async function computeHash(input: string, algo: HashAlgorithm): Promise<string> {
  const data = new TextEncoder().encode(input);
  switch (algo) {
    case "md5":
      return bytesToHex(md5(data));
    case "sha256":
      return bytesToHex(sha256(data));
    case "sha512":
      return bytesToHex(sha512(data));
    default:
      return "";
  }
}
