import { convertDateToString } from '../../src/Utils/DateHelper';

describe('convertDateToString', () => {
  it('corrent data', () => {
    const date = new Date('05 October 2011 14:48');
    const result = convertDateToString(date);

    expect(result).toBe('10/5/2011 14:48');
  });

  it('wrong data', () => {
    const date = '05 October 2011 14:48';

    try {
      convertDateToString(date);
    } catch (error) {
      expect(error.message).toBe('date.getMonth is not a function');
    }
  });
});
