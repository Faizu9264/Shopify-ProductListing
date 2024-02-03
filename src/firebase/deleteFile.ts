import { deleteObject, ref } from 'firebase/storage';
import { storage } from './confige';

const deleteFile = (filePath: string) => {
  const imageRef = ref(storage, filePath);
  return deleteObject(imageRef);
};

export default deleteFile;
