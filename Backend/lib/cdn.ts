import "dotenv/config";

const ASSET_BASE_URL = process.env.ASSET_BASE_URL;

// e.g. "https://your-bucket.s3.eu-west-2.amazonaws.com"
// or later if I implement cloudfront: "https://cdn.yourdomain.com"

export function assetUrl(key: string): string {
  return `${ASSET_BASE_URL}/${key}`;
}