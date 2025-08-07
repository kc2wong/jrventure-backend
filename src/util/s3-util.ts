import {
  CopyObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

export const s3client = new S3Client({});

export const approvalBucketName = 'jr-venture-media-approval-bucket';
export const publicBucketName = 'jr-venture-media-public-bucket';

export const doesFileExist = async (
  bucket: string,
  key: string
): Promise<boolean> => {
  try {
    await s3client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    return true; // exists
  } catch (_err: any) {
    return false;
  }
};

export const copyObject = async (
  bucket: string,
  oldKey: string,
  newKey: string
): Promise<number> => {
  // 1. Copy the object
  const _result = await s3client.send(
    new CopyObjectCommand({
      Bucket: bucket,
      CopySource: oldKey, // source bucket/key
      Key: newKey, // new key
    })
  );
  const head = await s3client.send(
    new HeadObjectCommand({
      Bucket: bucket,
      Key: newKey,
    })
  );
  return head.ContentLength ?? 0;
};

export const deleteObject = async (bucket: string, key: string) => {
  await s3client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  );
};
