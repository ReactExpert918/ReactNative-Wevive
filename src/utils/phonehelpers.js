import phoneCodes from '../../phones.json';
export const getContactName = (c, reverse) => {
  let n = "";
  let columns = ['givenName','familyName'];
  if (reverse) columns.reverse();
  if (c[columns[0]]) {
    n += c[columns[0]];
  }
  if (c[columns[1]]) {
    if (n != "") n += " ";
    n += c[columns[1]];
  }
  return n;
}

export const clearContacts = (contacts, geo) => {
  return contacts
    .filter((r) => r.givenName?.length || r.familyName?.length)
    .filter((r) => r.phoneNumbers.length > 0 && r.phoneNumbers[0].number.length)
    .map((r, i) => ({
      givenName: r.givenName,
      familyName: r.familyName,
      key: i,
      humanValue: getContactName(r),
      value: getContactName(r, true),
      labels: r.phoneNumbers.map((p) =>
        clearPhoneNumber(geo.country_code, p.number),
      ),
      label: r.phoneNumbers[0].number,
      clearLabel: clearPhoneNumber(geo.country_code, r.phoneNumbers[0].number),
    }))
    .sort((a, b) => {
      return a.familyName[0] < b.familyName[0];
    });
};

export const clearPhoneNumber = (country, number) => {
  if (number) {
    let cleanNumber = number.replace(/[^0-9+]+/g, '');
    cleanNumber = removeInternationalPrefix(cleanNumber);
    if (cleanNumber.indexOf('+') !== 0) {
      cleanNumber =
        getCountryPhoneCode(country) + removeTrunkPrefix(country, cleanNumber);
    }
    return cleanNumber;
  }
  return number;
};
export const removeInternationalPrefix = (number) => {
  //FIXME: more international prefixes;
  let cleanedNumber = number;
  let trunkPrefixes = ['00', '011'];
  trunkPrefixes.map((p) => {
    const trunkPrefixRegex = new RegExp(`^(${p})`, 'g');
    cleanedNumber = cleanedNumber.replace(trunkPrefixRegex, '+');
  });
  return cleanedNumber;
};

export const removeTrunkPrefix = (country, number) => {
  const non_standard_prefixes = {
    AZ: '8',
    MX: '01',
    MN: '01|02',
    TM: '8',
    UZ: '8',
    KZ: '8',
    RU: '8',
    BY: '8',
    HU: '06',
    LT: '8',
  };
  let trunkPrefix = '0';
  if (country && typeof non_standard_prefixes[country] !== 'undefined') {
    trunkPrefix = non_standard_prefixes[country];
  }
  const trunkPrefixRegex = new RegExp(`^(${trunkPrefix})`, 'g');
  return number.replace(trunkPrefixRegex, '');
};

export const getCountryPhoneCode = (country) => {
  if (!country || !phoneCodes[country]) {
    return "+44";
  }
  if (Array.isArray(phoneCodes[country])) {
    return `+${phoneCodes[country][0]}`;
  } else {
    return `+${phoneCodes[country]}`;
  }
};
