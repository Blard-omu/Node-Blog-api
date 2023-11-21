

// export const calculateReadingTime = (text) => {
//     const wordsPerMin = 200;
//     const wordCount = text.trim().split(/\s+/).length;
//     const readingTime = Math.ceil(wordCount / wordsPerMin);

//     return readingTime > 1 ? `${readingTime} mins` : `${readingTime} min`;
// };

export const calculateReadingTime = (text) => {
    const wordsPerMin = 200;
    const wordCount = text.trim().split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMin);
  
    return readingTime;
  };
  