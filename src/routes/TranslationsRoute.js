import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { stripesConnect } from '@folio/stripes-core';
import { useIntl } from 'react-intl';
import { get, isEqual } from 'lodash';
import TranslationWrapper from '../components/TranslationWrapper/TranslationWrapper';
import useQueryParams from '../components/Hooks/useQueryParams';

function TranslationsRoute(props) {
  // Current locale query param
  const [currentLocale, setCurrentLocale] = useQueryParams('locale', '');

  // Locales states
  const [masterTranslation, setMasterTranslation] = useState({});
  const [localeTranslations, setLocaleTranslations] = useState({});

  const intl = useIntl();

  // Get all locales translations
  const allTranslations = (props.resources.translations || {}).records || [];

  // Filter locale translations
  const getLocalTranslations = (locale) => {
    return get(allTranslations.find(
      (curTrans) => curTrans.localeCode === locale
    ), ['messages'], {});
  };

  useEffect(() => {
    if (!isEqual(getLocalTranslations('en'), masterTranslation)) {
      setMasterTranslation(getLocalTranslations('en'));
    }
    if (!isEqual(getLocalTranslations(currentLocale), localeTranslations)) {
      setLocaleTranslations(getLocalTranslations(currentLocale));
    }
  });

  return (
    <TranslationWrapper
      {...props}
      currentLocale={currentLocale}
      setCurrentLocale={setCurrentLocale}
      masterTranslation={masterTranslation}
      localeTranslations={localeTranslations}
      // Pre defiend fasets and filters
      activeFilters={['locale', 'app', 'table', 'status']}
      paneTitle={
        intl.formatMessage({
          id: 'ui-translations.meta.title',
        })
      }
    />
  );
}

TranslationsRoute.propTypes = {
  resources: PropTypes.shape({
    translations: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
  }),
};

TranslationsRoute.manifest = {
  translations: {
    type: 'okapi',
    path: 'translations?limit=1000',
    records: 'translations',
  },
};

export default stripesConnect(TranslationsRoute);
