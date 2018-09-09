import { expect } from 'chai';
import ReadingTime from '../utils/ReadingTime';

describe('Article reading time', () => {
  it('should return reading time for article', () => {
    const articleBody = 'I love my life, even if others hate me';
    const time = ReadingTime.wordCount(articleBody);
    expect(time).to.equal('1 min read');
  });
});
