import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from './confige';

const uploadFile = (file: File, filePath: string) => {
  return new Promise<string>(async (resolve, reject) => {
    const storageRef = ref(storage, filePath);
    try {
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      resolve(url);
    } catch (error) {
      reject(error);
    }
  });
};

export default uploadFile;
