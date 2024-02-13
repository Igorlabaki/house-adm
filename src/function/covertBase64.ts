export function convertFileToBase64(file: any) {
  return new Promise((resolve, reject) => {
    const reader: any = new FileReader();

    reader.onload = () => {
      if (reader.result) {
        const base64String = reader.result?.split(',')[1];
        resolve(base64String);
      } else {
        reject(new Error('Failed to convert file to base64.'));
      }
    };

    reader.onerror = (error: any) => {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
}
