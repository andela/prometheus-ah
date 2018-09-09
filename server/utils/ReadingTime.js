/**
 * @description controls the time required to read an article
 * @class
 */
class ReadingTime {
  /**
 * Get all users profile
 * @param {String} sentence - string of words
 * @returns {String} readingTime - Time required to read an article
 */
  static wordCount(sentence) {
    const regex = /\s+/gi;
    const noOfWord = sentence.trim().replace(regex, ' ').split(' ').length;
    const averageWordPerMin = 200;
    const readingTime = Math.ceil(noOfWord / averageWordPerMin);
    return `${readingTime} min read`;
  }
}

export default ReadingTime;
