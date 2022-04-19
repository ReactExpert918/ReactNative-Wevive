import { Upload } from 'react-native-tus-client';
 
export default function uploadFile() {
  const upload = new Upload(file, {
    endpoint: 'https://master.tus.io/files/', // use your tus server endpoint instead
    onError: error => console.log('error', error),
    onSuccess: () => {
      console.log('Upload completed. File url:', upload.url);
    },
    onProgress: (uploaded, total) => console.log(
      `Progress: ${(uploaded/total*100)|0}%`)
  });
  upload.start();
  })
.catch(e => console.log('error', e));
}