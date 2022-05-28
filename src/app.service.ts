import { Body, HttpStatus, Injectable, Req, Res } from '@nestjs/common';
import path from 'path';
import fs from 'fs';

@Injectable()
export class AppService {
  // getHello(): string {
  //   return 'Hello World!';
  // }
  relative(...paths) {
    const finalPath = paths.reduce((a, b) => path.join(a, b), process.cwd());
    if (path.relative(process.cwd(), finalPath).startsWith('..')) {
      throw new Error(
        'Failed to resolve path outside of the working directory',
      );
    }
    return finalPath;
  }

  flashify(req, obj) {
    let error = req.flash('error');
    if (error && error.length > 0) {
      if (!obj.errors) {
        obj.errors = [];
      }
      obj.errors.push(error);
    }
    let success = req.flash('success');
    if (success && success.length > 0) {
      if (!obj.successes) {
        obj.successes = [];
      }
      obj.successes.push(success);
    }
    obj.isloginenabled = !!process.env.KEY;
    return obj;
  }

  isimage(f) {
    for (const ext of this.EXT_IMAGES) {
      if (f.endsWith(ext)) {
        return true;
      }
    }
    return false;
  }

  SMALL_IMAGE_MAX_SIZE = 750 * 1024; // 750 KB
  EXT_IMAGES = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif', '.tiff'];

  getList(@Req() req, @Res() res: any) {
    if (res.stats.isDirectory()) {
      if (!req.url.endsWith('/')) {
        return res.redirect(req.url + '/');
      }

      let readDir = new Promise((resolve, reject) => {
        fs.readdir(this.relative(res.filename), (err, filenames) => {
          if (err) {
            return reject(err);
          }
          return resolve(filenames);
        });
      });

      readDir
        .then((filenames: string[]) => {
          const promises = filenames.map(
            (f) =>
              new Promise((resolve, reject) => {
                fs.stat(this.relative(res.filename, f), (err, stats) => {
                  if (err) {
                    console.warn(err);
                    return resolve({
                      name: f,
                      error: err,
                    });
                  }
                  resolve({
                    name: f,
                    isdirectory: stats.isDirectory(),
                    issmallimage:
                      this.isimage(f) && stats.size < this.SMALL_IMAGE_MAX_SIZE,
                    size: stats.size,
                  });
                });
              }),
          );

          Promise.all(promises)
            .then((files) => {
              res.render(
                'list',
                this.flashify(req, {
                  path: res.filename,
                  files: files,
                }),
              );
            })
            .catch((err) => {
              console.error(err);
              res.render(
                'list',
                this.flashify(req, {
                  path: res.filename,
                  errors: [err],
                }),
              );
            });
        })
        .catch((err) => {
          console.warn(err);
          res.render(
            'list',
            this.flashify(req, {
              path: res.filename,
              errors: [err],
            }),
          );
        });
    }
    // return res.status(HttpStatus.CREATED).json({
    //   files,
    // });
  }
}
