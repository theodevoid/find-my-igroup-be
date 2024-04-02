import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Request } from 'express';

export enum BUCKETS {
  PAYMENTS = 'payments',
}

@Injectable({ scope: Scope.REQUEST })
export class SupabaseService {
  private clientInstance: SupabaseClient;

  constructor(@Inject(REQUEST) private readonly request: Request) {}

  public getClient() {
    if (this.clientInstance) {
      return this.clientInstance;
    }

    this.clientInstance = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY,
    );

    return this.clientInstance;
  }

  private extractFileExtension(mimetype: string) {
    return mimetype.split('/')[1];
  }

  public async uploadToStorage(file: any) {
    const fileExtension = this.extractFileExtension(file.mimetype);
    const filePath = `${new Date().getTime()}.${fileExtension}`;

    const { data, error } = await this.getClient()
      .storage.from(BUCKETS.PAYMENTS)
      .upload(filePath, file.buffer);

    if (error) throw new InternalServerErrorException('upload failed');

    const uploadedFilePublicUrl = this.getClient()
      .storage.from(BUCKETS.PAYMENTS)
      .getPublicUrl(data.path);

    return uploadedFilePublicUrl;
  }
}
