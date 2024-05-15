// Utility function to transform imageUrl
const transformImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    const fileIdMatch = imageUrl.match(/id=([^&]+)/);
    if (fileIdMatch) {
      const fileId = fileIdMatch[1];
      return `/api/image/${fileId}`;
    }
    return imageUrl;
  };
  
  // Helper function to transform imageUrls in nested objects
  const transformImageUrlsInObject = (obj) => {
    if (Array.isArray(obj)) {
      return obj.map(item => transformImageUrlsInObject(item));
    } else if (obj !== null && typeof obj === 'object') {
      const transformedObj = { ...obj };
      for (const key in transformedObj) {
        if (key === 'curso' && transformedObj[key].imageUrl) {
          transformedObj[key].imageUrl = transformImageUrl(transformedObj[key].imageUrl);
        } else if (typeof transformedObj[key] === 'object') {
          transformedObj[key] = transformImageUrlsInObject(transformedObj[key]);
        }
      }
      return transformedObj;
    }
    return obj;
  };
  
  export { transformImageUrl, transformImageUrlsInObject };