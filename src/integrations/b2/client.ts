import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

// Create an S3 client

const s3 = new S3Client({
  endpoint: process.env.B2_ENDPOINT,
  region: "us-east-005",
  credentials: {
    accessKeyId: process.env.B2_KEY_ID!,
    secretAccessKey: process.env.B2_APPLICATION_KEY!,
  },
});

// Public link for a file in the lab reports bucket. Encoding is what keeps
// names with "#", "+", or spaces working; "#" would otherwise start a fragment.
export function labReportUrl(key: string): string {
  return `${process.env.B2_PUBLIC_URL}/${encodeURIComponent(key)}`;
}

export async function listLabReports() {
  const response = await s3.send(
    new ListObjectsV2Command({ Bucket: process.env.B2_BUCKET }),
  );
  return (response.Contents ?? []).map((obj) => {
    const key = obj.Key!;
    const dot = key.lastIndexOf(".");
    return {
      key,
      name: key.slice(0, dot),
      ext: key.slice(dot + 1),
      url: labReportUrl(key),
    };
  });
}
