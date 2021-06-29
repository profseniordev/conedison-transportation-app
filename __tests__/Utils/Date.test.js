import { formatDate, renderTime } from '../../src/Utils/Date';

describe('formatDate', () => {
  it('correct data', () => {
    const dateValue = new Date('20 April 2021');
    const dateFormat = 'DD/MM/YYYY';

    const result = formatDate(dateValue, dateFormat);

    expect(result).toBe('20/04/2021');
  });

  it('no date data', () => {
    const dateValue = '';
    const dateFormat = 'DD/MM/YYYY';

    const result = formatDate(dateValue, dateFormat);

    expect(result).toBe('None');
  });
});

describe('renderTime', () => {
  it('correct data', () => {
    const value = 2.666;

    const result = renderTime(value);

    expect(result).toBe('2.67');
  });

  it('wrong data', () => {
    const value = '2.666';

    try {
      renderTime(value);
    } catch (error) {
      expect(error.message).toBe('time.toFixed is not a function');
    }
  });

  it('NaN data', () => {
    const result = renderTime('1qwe');
    expect(result).toBe('1qwe');
  });
});
