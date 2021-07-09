// import data from "./data/data.json";
import fs from 'fs';
import request from 'request'


export async function download(url, dest) {

  /* Create an empty file where we can save data */
  const file = fs.createWriteStream(dest);

  /* Using Promises so that we can use the ASYNC AWAIT syntax */
  await new Promise((resolve, reject) => {
    request({
      /* Here you should specify the exact link to the file you are trying to download */
      uri: url,
      gzip: true,
    })
        .pipe(file)
        .on('finish', async () => {
          resolve();
        })
        .on('error', (error) => {
          reject(error);
        });
  })
      .catch((error) => {
        console.log({error})
        console.log(`Something happened: ${error}`);
      });
}
