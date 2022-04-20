import { omit } from 'ramda';

export const getDateFormat = (isoDate: number): string => {
  const date = new Date(isoDate);
  return `${date.getDate()}.${
    date.getMonth() + 1
  }.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}`;
};

export const omitAttributesForEquals = omit([
  'agent',
  'source',
  'address',
  'sourceEvent',
  'textLocale',
  'attachments',
  'suggestedActions'
]);
