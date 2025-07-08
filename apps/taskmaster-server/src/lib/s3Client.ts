import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Readable } from "stream";
import dotenv from "dotenv";
dotenv.config();

interface UploadParams {
  key: string;
  body: Buffer | Readable;
  contentType: string;
  acl?: "private" | "public-read";
}

const s3 = new S3Client({
  region: process.env.S3_REGION,
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
  forcePathStyle: false, // для vHosted
});

export const uploadToS3 = async ({
  key,
  body,
  contentType,
  acl = "public-read",
}: UploadParams): Promise<string> => {
  const params: PutObjectCommandInput = {
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: key,
    Body: body,
    ContentType: contentType,
    ACL: acl,
  };

  const command = new PutObjectCommand(params);
  await s3.send(command);

  // Генерация публичной ссылки
  const url = `${process.env.S3_ENDPOINT!.replace(
    "https://",
    `https://${process.env.S3_BUCKET_NAME!}.`
  )}/${key}`;

  return url;
};

export const deleteObjectFromS3 = async (key: string): Promise<void> => {
  const command = new DeleteObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: key,
  });

  await s3.send(command);
};
