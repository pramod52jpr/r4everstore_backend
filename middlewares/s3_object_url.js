const { S3Client, GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3Client = new S3Client({
    region: "ap-south-1",
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY,
    }
});

exports.getObjectUrl = async (key) => {
    const command = new GetObjectCommand({
        Bucket: "r4everstore",
        Key: key,
    })
    const url = await getSignedUrl(s3Client, command);
    return url;
}

exports.putObjectUrl = async (filename) => {
    const command = new PutObjectCommand({
        Bucket: "r4everstore",
        Key: filename,
        // ContentType: contentType,
    });
    const url = await getSignedUrl(s3Client, command, {expiresIn: 60});
    return url;
}