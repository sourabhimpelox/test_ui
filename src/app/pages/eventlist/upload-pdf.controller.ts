import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import * as multer from 'multer';

@Controller('upload-pdf')
export class UploadPdfController {
  private s3 = new AWS.S3();

  constructor() {
    AWS.config.update({
      accessKeyId: 'YOUR_AWS_ACCESS_KEY',
      secretAccessKey: 'YOUR_AWS_SECRET_KEY',
      region: 'YOUR_AWS_REGION',
    });
  }

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: multer.memoryStorage(), // Store file in memory
  }))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      const fileName = `${uuidv4()}.pdf`; // Unique file name using UUID
      const s3Params = {
        Bucket: 'YOUR_S3_BUCKET_NAME',
        Key: fileName,
        Body: file.buffer,
        ContentType: 'application/pdf',
        ACL: 'public-read', // Set file permissions (can be private as well)
      };

      // Upload the file to S3
      const uploadResult = await this.s3.upload(s3Params).promise();
      console.log('File uploaded successfully:', uploadResult);

      return { message: 'File uploaded successfully', fileUrl: uploadResult.Location };
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      throw error;
    }
  }
}
