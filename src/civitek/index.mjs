
export default async function civitek(puppeteer, { county, courtType, lastCaseNumber }) {
  const url = `https://www.civitekflorida.com/ocrs/county/${county}/disclaimer.xhtml`
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url);
  await page.waitFor('#j_idt42\\:j_idt44');
  await page.click('#j_idt42\\:j_idt44');
  await page.waitFor('li.ui-tabs-header:nth-child(3) > a:nth-child(1)');
  await page.click('li.ui-tabs-header:nth-child(3) > a:nth-child(1)');
  await page.waitFor('#form\\:search_tab\\:date_cs_court1_input');

  // Fill out form
  await page.click(`#form\\:search_tab\\:date_cs_court1_label`);
  await new Promise((res) => setTimeout(res, 250));
  await page.select('#form\\:search_tab\\:date_cs_court1_input', courtType);
  await new Promise((res) => setTimeout(res, 250));
  await page.type('#form\\:search_tab\\:date_start_input', '03/01/2022');
  await new Promise((res) => setTimeout(res, 250));
  await page.type('#form\\:search_tab\\:date_end_input', '03/10/2022');
  await new Promise((res) => setTimeout(res, 2000));

  // Press Submit
  await new Promise((res) => setTimeout(res, 250));
  await page.click('#form button[type="submit"]');
  await new Promise((res) => setTimeout(res, 20000));

  // await page.waitFor('#dateRangeSearchResult\\:caseSearchResultsByDatesTable_data');
  // const allCases = await page.evaluate((lastCase) => {
  //   const tbody = document.querySelector('#dateRangeSearchResult\\:caseSearchResultsByDatesTable_data');
  //   const rows = tbody.querySelectorAll('tr');
  //   return Array.from(rows, (row) => row.innerText.split('\t'));
  // }, 'lastCase');
  // await browser.close();
  // return [];
  // return allCases.map(([ caseNumber, filingDate, status ]) => ({ courtType, caseNumber, filingDate, status }));
}
