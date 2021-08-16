import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { isEqual, sortBy } from 'lodash';
import { stripesConnect } from '@folio/stripes-core';
import LanguagesContext from './LanguagesContext';

function LanguagesProvider(props) {
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    const transLanguages = sortBy(
      (props.resources.languages || {}).records || [],
      ['localeCode']
    );
    if (!isEqual(transLanguages, languages)) {
      setLanguages(transLanguages);
    }
  }, [props.resources.languages]);

  return (
    <LanguagesContext.Provider value={languages}>
      {props.children}
    </LanguagesContext.Provider>
  );
}

LanguagesProvider.propTypes = {
  children: PropTypes.node,
  resources: PropTypes.shape({
    languages: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
  }),
};
LanguagesProvider.manifest = {
  languages: {
    type: 'okapi',
    path: 'languages?limit=1000',
    records: 'languages',
    resourceShouldRefresh: true,
  },
};
export default stripesConnect(LanguagesProvider);
