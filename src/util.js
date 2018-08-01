import dateFns from 'date-fns';

export function splitTagList(tagList) {
  if (!tagList || tagList === '') return [];
  const regex = /(?<![\"'])\b\w+\b(?![\"'])|(?<=([\"']))[^\s].+?(?=\1)/;
  return taglist.match(regex);
}

export function formatDate(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }

  return dateFns.format(date, 'ddd, DD MMM YYYY HH:mm:ss ZZ');
}