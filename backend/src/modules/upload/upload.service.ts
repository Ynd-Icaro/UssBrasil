import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UploadService {
  private useCloudinary = false;

  constructor(private configService: ConfigService) {
    const cloudName = this.configService.get('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.configService.get('CLOUDINARY_API_KEY');
    const apiSecret = this.configService.get('CLOUDINARY_API_SECRET');

    // Only configure Cloudinary if all credentials are present and not placeholder values
    if (cloudName && apiKey && apiSecret && 
        cloudName !== 'your_cloud_name' && 
        apiKey !== 'your_api_key' && 
        apiSecret !== 'your_api_secret') {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
      });
      this.useCloudinary = true;
      console.log('Cloudinary configured successfully');
    } else {
      console.log('Cloudinary not configured, using local storage');
    }
  }

  async uploadImage(file: Express.Multer.File, folder = 'products'): Promise<{ url: string; publicId: string }> {
    if (!file) {
      throw new BadRequestException('Arquivo não fornecido');
    }

    // Validate file type
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Tipo de arquivo não permitido. Use JPEG, PNG, WebP ou GIF');
    }

    // If Cloudinary is configured and working, use it
    if (this.useCloudinary) {
      try {
        return await this.uploadToCloudinary(file, folder);
      } catch (error) {
        console.warn('Cloudinary upload failed, falling back to local storage:', error.message);
        return this.uploadLocally(file, folder);
      }
    }

    // Otherwise, save locally
    return this.uploadLocally(file, folder);
  }

  private async uploadToCloudinary(file: Express.Multer.File, folder: string): Promise<{ url: string; publicId: string }> {
    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: `ussbrasil/${folder}`,
          transformation: [
            { width: 1200, height: 1200, crop: 'limit' },
            { quality: 'auto:good' },
            { fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      ).end(file.buffer);
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  }

  private async uploadLocally(file: Express.Multer.File, folder: string): Promise<{ url: string; publicId: string }> {
    try {
      // Create uploads directory if it doesn't exist
      const uploadsDir = path.join(process.cwd(), 'uploads', folder);
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      // Generate unique filename
      const ext = path.extname(file.originalname) || '.jpg';
      const filename = `${uuid()}${ext}`;
      const filepath = path.join(uploadsDir, filename);

      // Save file
      fs.writeFileSync(filepath, file.buffer);

      // Return URL (relative path that can be served statically)
      const url = `/uploads/${folder}/${filename}`;
      const publicId = `local_${folder}_${filename}`;

      return { url, publicId };
    } catch (error) {
      console.error('Local upload error:', error);
      throw new BadRequestException('Erro ao fazer upload da imagem');
    }
  }

  async uploadMultipleImages(files: Express.Multer.File[], folder = 'products'): Promise<{ url: string; publicId: string }[]> {
    const uploadPromises = files.map(file => this.uploadImage(file, folder));
    return Promise.all(uploadPromises);
  }

  async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      // Don't throw, just log - image might already be deleted
    }
  }
}
