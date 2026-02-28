import { S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from 'next/server';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export async function GET() {
  try {
    const bucket = process.env.AWS_S3_BUCKET_NAME;
    const prefix = process.env.AWS_S3_PREFIX || "";

    if (!bucket) {
      return NextResponse.json({ error: "AWS_S3_BUCKET_NAME is not defined" }, { status: 500 });
    }

    const listResp = await s3Client.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefix,
      })
    );

    if (!listResp.Contents || listResp.Contents.length === 0) {
      return NextResponse.json({ data: [] });
    }

    // Get the last 5 objects to have some history if needed, or just the latest
    const sortedObjects = [...listResp.Contents].sort(
      (a, b) => (b.LastModified?.getTime() || 0) - (a.LastModified?.getTime() || 0)
    ).slice(0, 5);

    const dataPromises = sortedObjects.map(async (obj) => {
      const getResp = await s3Client.send(
        new GetObjectCommand({
          Bucket: bucket,
          Key: obj.Key,
        })
      );
      const text = await getResp.Body.transformToString();
      return JSON.parse(text);
    });

    const results = await Promise.all(dataPromises);
    
    // The S3 data format seems to be { original_topic, timestamp, data: { ... } } or directly the JSON
    // based on user's first message and page.tsx content.
    // Let's normalize it for the dashboard.
    
    return NextResponse.json({ data: results });
  } catch (error) {
    console.error("S3 Fetch Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
