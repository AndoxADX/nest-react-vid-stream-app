import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Video, VideoDocument } from '../model/video.schema';
import { createReadStream, statSync } from 'fs';
import { join } from 'path';
import { Request, Response } from 'express';
import { checkIfFileOrDirectoryExists } from './directory.helper';

@Injectable()
export class DirectoryService {
  constructor(
    @InjectModel(Video.name) private videoModel: Model<VideoDocument>,
  ) {}
 
  // create 
  async createDirectory(): Promise<any> {
    checkIfFileOrDirectoryExists('')
  
  }

  // read
  async readVideo(id): Promise<any> {
    if (id.id) {
      return this.videoModel
        .findOne({ _id: id.id })
        .populate('createdBy')
        .exec();
    }
    return this.videoModel.find().populate('createdBy').exec();
  }
  
  // update
  async update(id, video: Video): Promise<Video> {
    return await this.videoModel.findByIdAndUpdate(id, video, { new: true });
  }

  // delete
  async delete(id): Promise<any> {
    return await this.videoModel.findByIdAndRemove(id);
  }
}
