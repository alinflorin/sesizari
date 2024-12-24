import { useCallback } from "react";
import { getDownloadURL, uploadBytes, ref, getBlob } from "firebase/storage";
import { firebaseStorage } from "../providers/firebase";

export default function useFiles() {
  const uploadFile = useCallback(
    async (
      data: Blob,
      fileName: string,
      path = "/",
      contentType = "application/octet-stream"
    ) => {
      const fileRef = ref(firebaseStorage, path + "/" + fileName);
      const uploadResult = await uploadBytes(fileRef, data, {
        contentType: contentType,
      });
      return await getDownloadURL(uploadResult.ref);
    },
    []
  );

  const downloadFile = useCallback(async (fileName: string, path = "/") => {
    const fileRef = ref(firebaseStorage, path + "/" + fileName);
    return await getBlob(fileRef);
  }, []);

  return { uploadFile, downloadFile };
}
