import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { isEqual, sortBy } from 'lodash';
import { stripesConnect, withStripes } from '@folio/stripes-core';
import AssignedLanguagesContext from './AssignedLanguagesContext';

function AssignedLanguagesProvider(props) {
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    const languageTranslators = sortBy(
      (props.resources.languageTranslators || {}).records || [],
      ['localeCode']
    );
    if (!isEqual(languageTranslators, languages)) {
      setLanguages(languageTranslators);
    }
  }, [props.resources.languageTranslators]);

  const getLanguages = () => {
    return languages.filter((lang) => {
      return lang.translators.some(
        (translator) => translator === props.stripes.user.user.id
      );
    });
  };

  return (
    <AssignedLanguagesContext.Provider value={getLanguages()}>
      {props.children}
    </AssignedLanguagesContext.Provider>
  );
}

AssignedLanguagesProvider.propTypes = {
  children: PropTypes.node,
  stripes: PropTypes.object,
  resources: PropTypes.shape({
    languageTranslators: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
  }),
};
AssignedLanguagesProvider.manifest = {
  languageTranslators: {
    type: 'okapi',
    path: 'languageTranslators?limit=1000',
    records: 'languageTranslators',
    resourceShouldRefresh: true,
  },
};
export default withStripes(stripesConnect(AssignedLanguagesProvider));
