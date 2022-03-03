import 'mocha';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import civitek from '../../src/civitek/index.mjs';

puppeteer.use(StealthPlugin())

describe('Civitek', () => {
  it('should do something', async() => {
    await puppeteer.launch({ headless: false, args:['--disable-features=site-per-process','--no-sandbox'] });
    const cases = await civitek(puppeteer, { county: 42, courtType: 'CT' });
    console.log(cases);
  });
});
