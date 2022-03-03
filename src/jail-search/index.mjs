import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cheerio from 'cheerio';
import got from 'got';

// marion so lowest 3898956;
// marion so has picture 4319051;

export const keyMap = {
  txtSuffix: 'suffix',
  txtBooking: 'bookingNumber',
  txtPIN: 'inmateId',
  txtReleaseDate: 'releaseDate',
  txtBookingDate: 'bookingDate',
  txtEyes: 'eyeColor',
  txtHair: 'hairColor',
  txtWeight: 'weight',
  txtDOB: 'dob',
  txtZipCode: 'zipCode',
  txtCity: 'city',
  txtState: 'state',
  txtLastName: 'lastName',
  txtFirstName: 'firstName',
  txtMiddleName: 'middleName',
  txtRace: 'race',
  txtSex: 'gender',
  txtHeight: 'height',
}

const unavailablePath = join(dirname(fileURLToPath(import.meta.url)), './photo-unavailable.b64');
const photoUnavailable = await readFile(unavailablePath, 'base64');

const facilities = {
  'jail.marionso.com': {
    info: 'http://jail.marionso.com/Details.aspx?InmateRID=',
    mugshot: 'http://jail.marionso.com/FullsizeMugshotHandler.ashx?InmateRID=',
  },
};

export default async function jailSearch({ inmateRid, facility }) {
  if (!inmateRid || !facility || !facilities[facility]) {
    throw 'Bad Request';
  }
  const bookingUrl = `${facilities[facility].info}${inmateRid}`;
  const pictureUrl = `${facilities[facility].mugshot}${inmateRid}`;
  const [{ body }, picRes] = await Promise.all([got(bookingUrl), got(pictureUrl)]);
  const person = { inmateRid, bookingUrl };

  if (picRes.headers['content-type'] !== 'text/html') {
    if (picRes.rawBody.toString('base64') !== photoUnavailable) {
      person.pictureUrl = pictureUrl;
      person.picture = picRes.rawBody;
    }
  }

  const $ = cheerio.load(body);
  $('input').each((i, { attribs: { name, value } }) => {
    if (keyMap[name] && value && value.trim()) {
      person[keyMap[name]] = value.trim();
    }
  });

  return person;
}
