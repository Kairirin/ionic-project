import { IntlCurrencyPipe } from './intl-currency.pipe';

describe('IntlCurrencyPipe', () => {
  it('create an instance', () => {
    const pipe = new IntlCurrencyPipe();
    expect(pipe).toBeTruthy();
  });
});
