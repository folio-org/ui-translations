/* eslint-disable import/no-extraneous-dependencies */
import { createIntlCache } from '@formatjs/intl';
import { get } from 'lodash';
import { createIntl } from 'react-intl';

export const getTranslationsByApp = (currentApp, masterTranslation) => {
  if (currentApp === 'all') return masterTranslation;
  else {
    const appTrans = {};
    Object.keys(masterTranslation).forEach((key) => {
      if (key.startsWith(currentApp)) appTrans[key] = masterTranslation[key];
    });
    return appTrans;
  }
};

export const getTranslationsByTable = (
  currentApp,
  currentTable,
  masterTranslation
) => {
  const appTranslations = getTranslationsByApp(currentApp, masterTranslation);
  if (currentTable === 'all') return appTranslations;
  else {
    const tableTrans = {};
    Object.keys(appTranslations).forEach((key) => {
      if (
        key
          .split('.', 2)
          .join('.')
          .endsWith(currentTable)
      ) {
        tableTrans[key] = appTranslations[key];
      }
    });
    return tableTrans;
  }
};

export const getAppsNames = (masterTranslation) => {
  return [
    ...new Set(
      Object.keys(masterTranslation).map((key) => key.substr(0, key.indexOf('.')))
    ),
  ];
};

export const getTablesNamesByApp = (currentApp, masterTranslation) => {
  const appTranslations = getTranslationsByApp(currentApp, masterTranslation);
  return [
    ...new Set(
      Object.keys(appTranslations).map((key) => key.split('.', 2)[1])
    ),
  ];
};

export const getLocaleLabel = (localeCode, intl) => {
  const cache = createIntlCache();
  const locale = {
    intl: createIntl(
      {
        locale: localeCode,
        messages: {},
      },
      cache
    ),
  };

  return intl.formatDisplayName(localeCode, { type: 'language' }) !== undefined
    ? `${intl.formatDisplayName(localeCode, {
      type: 'language',
    })} - ${locale.intl.formatDisplayName(localeCode, { type: 'language' })}`
    : intl.formatMessage({
      id: `stripes-core.ul.button.languageName.${localeCode}`,
    });
};

export function getFullName(user) {
  const lastName = get(user, 'personal.lastName', '');
  const firstName = get(user, 'personal.firstName', '');
  const middleName = get(user, 'personal.middleName', '');

  return `${lastName}${firstName ? ', ' : ' '}${firstName}${
    middleName ? ' ' : ''
  }${middleName}`;
}

export const ImportLocalesIcones = () => {
  const req = require.context(
    '!!react-svg-loader!./localesIcons/',
    true,
    /\.svg$/
  );
  return req.keys().reduce(
    (images, path) => Object.assign(images, {
      [path.slice(2, path.length - 4)]: req(path).default,
    }),
    {}
  );
};
