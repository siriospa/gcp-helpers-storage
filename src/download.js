// Copyright 2024 Sirio S.p.A.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const path = require("path")
const { Storage } = require("@google-cloud/storage")
const log = require("@siriospa/gcp-functions-logger")

/**
 * Downloads all files from given bucket.
 *
 * @param {string} bucket Bucket name.
 * @param {string} destination Destination path.
 */
exports.bucket = async (bucket, destination = __dirname) => {
  const storage = new Storage()
  const source = storage.bucket(bucket)
  const [files] = await source.getFiles()

  files.forEach(({ name }) => this.file(name, source, destination))
}

/**
 * Downloads a file from the given bucket.
 *
 * @param {string} file File name.
 * @param {Bucket} bucket Google Cloud Storage bucket object.
 * @param {string} destination Destination path.
 */
exports.file = async (file, bucket, destination = __dirname) =>
  bucket
    .file(file)
    .download({
      destination: path.join(destination, file),
    })
    .then(() => log.info(`Downloading "${file}".`))
    .catch(() => log.error(`Failed downloading "${file}".`))
