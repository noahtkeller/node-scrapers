import got from 'got';

const facilities = {
  ['marioncountyclerk.org']: 'https://nvweb.marioncountyclerk.org/BrowserView/api/document'
};

export default async function newVision({ facility, id }) {
  if (!facility || !id || !Reflect.has(facilities, facility)) {
    throw 'Bad request';
  }

  const host = facilities[facility];
  const meta = { facility, id };
  const pages = [];

  const res = await got.post(host, { json: { Token: null, ID: id  } }).json();
  for (const key in res) {
    if (res[key] !== null && res[key] !== undefined) {
      meta[key] = res[key];
    }
  }

  if (meta.doc_pages) {
    for (let i = 1; i <= meta.doc_pages; i++) {
      const res = await got.post(host, { json: { Token: null, ID: id, Convert: true, Page: String(i) } }).json();
      if ('hi_res' in res) {
        pages.push(res.hi_res);
      }
    }
  }

  return { meta, pages };
}
