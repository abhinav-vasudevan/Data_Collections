import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

function getConfig() {
  const region = process.env.AWS_REGION;
  const bucket = process.env.S3_BUCKET;
  if (!region || !bucket) {
    throw new Error("AWS_REGION and S3_BUCKET must be set to use S3 uploads");
  }
  return { region, bucket } as const;
}

function getClient() {
  const { region, bucket } = getConfig();
  return { client: new S3Client({ region }), bucket } as const;
}

export async function putObject(params: {
  key: string;
  body: Buffer;
  contentType: string;
}): Promise<void> {
  const { client, bucket } = getClient();
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: params.key,
    Body: params.body,
    ContentType: params.contentType,
  });
  await client.send(command);
}
