// @flow
import * as RNLocalize from 'react-native-localize';
import i18n from 'i18n-js';

import en from './translations/en.json';

i18n.translations = {
  en,
};
i18n.fallbacks = true;

const fallback = { languageTag: 'en', isRTL: false };
const languages = Object.keys(i18n.translations);
const { languageTag } = RNLocalize.findBestAvailableLanguage(languages) || fallback;

i18n.locale = languageTag;

// Takes a count that might be a localized string with delimiters and turns it
// into a number we can use for determining the right plural form
const normalizeCount = (count, locale) => {
  const separator = i18n.t('number.format.separator', { locale: locale });
  const delimiter = i18n.t('number.format.delimiter', { locale: locale });
  const pieces = count.toString().split(separator);
  let parsableString = pieces.join('.');
  if (pieces.length === 2) {
    parsableString = pieces[0].replace(delimiter, '') + '.' + pieces[1];
  } else {
    parsableString = pieces[0].replace(delimiter, '');
  }
  return parseFloat(parsableString);
};

// common pluralization rules are from iNaturalist web
const eastSlavic = (count, locale) => {
  const n = normalizeCount(count, locale) || 0;
  const mod10 = n % 10;
  const mod100 = n % 100;
  const isWhole = parseInt(n, 0) === n;
  if (mod10 === 1 && mod100 !== 11) {
    return ['one'];
  }
  if (
    (mod10 >= 2 && mod10 <= 4 && isWhole)
    && !(mod100 >= 12 && mod100 <= 14 && isWhole)
  ) {
    return ['few'];
  }
  if (
    mod10 === 0
    || (mod10 >= 5 && mod10 <= 9 && isWhole)
    || (mod100 >= 11 && mod100 <= 14 && isWhole)
  ) {
    return ['many'];
  }
  return ['other'];
};

const oneUptoTwoOther = (count, locale) => {
  const n = normalizeCount(count, locale) || 0;
  const isWhole = parseInt(n, 0) === n;
  return n && n >= 0 && n < 2 && isWhole ? ['one'] : ['other'];
};

const other = () => ['other'];

// Override default to deal with English-style delimiters
i18n.pluralization.default = (count) => {
  switch (normalizeCount(count, 'en')) {
    case 0: return ['zero', 'other'];
    case 1: return ['one'];
    default: return ['other'];
  }
};

i18n.pluralization.fr = (count) => oneUptoTwoOther(count);
i18n.pluralization.ja = other;
i18n.pluralization.ro = function (count) {
  var n = normalizeCount(count, 'ro') || 0;
  var mod100 = n % 100;
  var isWhole = parseInt(n, 0) === n;
  if (n === 1) {
    return ['one'];
  }
  if (
    n === 0
    || (mod100 >= 1 && mod100 <= 19 && isWhole)
  ) {
    return ['few'];
  }
  return ['other'];
};
i18n.pluralization.ru = (count) => eastSlavic(count);
i18n.pluralization['zh-TW'] = other;

export default i18n;
