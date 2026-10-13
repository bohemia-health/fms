import {
  S3Client,
  CreateBucketCommand,
  PutObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";

// Create an S3 client

const s3 = new S3Client({
  endpoint: process.env.B2_ENDPOINT,
  region: "us-east-005",
  credentials: {
    accessKeyId: process.env.B2_KEY_ID!,
    secretAccessKey: process.env.B2_APPLICATION_KEY!,
  },
});

export async function listLabReports() {
  const response = await s3.send(
    new ListObjectsV2Command({ Bucket: process.env.B2_BUCKET }),
  );
  console.log(response.Contents);
  return (response.Contents ?? []).map((obj) => ({
    name: obj.Key,
    url: `${process.env.B2_PUBLIC_URL}/${obj.Key}`,
  }));
}
