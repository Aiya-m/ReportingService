import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuid } from "uuid";

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});

const BUCKET = process.env.BUCKET;

export const uploadToS3 = async ({file, userId}) => {
    const key = `${userId}/${uuid()}`;
    const command = new PutObjectCommand({ Bucket:BUCKET, Key: key, Body: file.buffer, ContentType: file.mimetype, });

    try {
        await s3.send(command);
        return { key };
    } catch (error) {
        console.log(error);
        return { error };
    }
};