import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { get, isEqual, sortBy } from 'lodash';
import { Callout, List } from '@folio/stripes-components';
import { FormattedMessage, useIntl } from 'react-intl';
import LanguagesTranslatorsForm from './LanguagesTranslatorsForm';
import { getLocaleLabel } from '../../utils/utils';

function LanguagesTranslatorsManager(props) {
  const [languagesList, setLanguagesList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [patronGroups, setPatronGroups] = useState([]);

  const intl = useIntl();
  let callout;

  useEffect(() => {
    // Fetch languages translators
    const languages = sortBy(
      (props.resources.languageTranslators || {}).records || [],
      ['localeCode']
    );

    // Fetch users
    const users = get(props.resources.users, ['records'], []);

    // Fetch patron groups
    const groups = get(props.resources.patronGroups, ['records'], []);

    if (!isEqual(languages, languagesList)) {
      setLanguagesList(languages);
    }

    if (!isEqual(users, usersList)) {
      setUsersList(users);
    }

    if (!isEqual(groups, patronGroups)) {
      setPatronGroups(groups);
    }
  }, [
    props.resources.languageTranslators,
    props.resources.users,
    props.resources.patronGroups,
  ]);

  const onShowCallout = (message) => {
    if (callout) {
      callout.sendCallout({ message });
    }
  };

  const onUpdateLanguagesTranslators = (updatedLanguages) => {
    const res = updatedLanguages.forEach((updatedLang) => {
      delete updatedLang.rowIndex;
      props.mutator.languageTranslatorId.replace(updatedLang.id);
      props.mutator.languageTranslators.PUT(updatedLang);
    });

    Promise.resolve(res).then(() => {
      onShowCallout(
        <div>
          <strong>
            <FormattedMessage id="ui-translations.settings.callout.updatedLanguages.success" />
          </strong>
          <List
            listStyle="bullets"
            items={updatedLanguages}
            itemFormatter={(item) => (
              <li>{getLocaleLabel(item.localeCode, intl)}</li>
            )}
          />
        </div>
      );
    });
  };

  const onFormSubmit = (values) => {
    const updatedLanguages = values.languagesList.filter((newLang) => {
      return languagesList.some((oldLang) => {
        return (
          newLang.translators !== oldLang.translators &&
          newLang.localeCode === oldLang.localeCode
        );
      });
    });

    if (updatedLanguages.length) onUpdateLanguagesTranslators(updatedLanguages);
  };

  return (
    <>
      <LanguagesTranslatorsForm
        {...props}
        onSubmit={onFormSubmit}
        initialValues={{
          languagesList,
        }}
        usersList={usersList}
        patronGroups={patronGroups}
      />
      <Callout
        ref={(ref) => {
          callout = ref;
        }}
      />
    </>
  );
}

LanguagesTranslatorsManager.propTypes = {
  resources: PropTypes.shape({
    users: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
    patronGroups: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
    languageTranslators: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
    languageTranslatorId: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }),
  }).isRequired,
  mutator: PropTypes.shape({
    languageTranslators: PropTypes.shape({
      GET: PropTypes.func.isRequired,
      reset: PropTypes.func.isRequired,
      PUT: PropTypes.func.isRequired,
    }),
    languageTranslatorId: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }),
  }).isRequired,
};
LanguagesTranslatorsManager.manifest = Object.freeze({
  users: {
    type: 'okapi',
    records: 'users',
    path: 'users?limit=10000',
    // resourceShouldRefresh: true,
  },
  patronGroups: {
    type: 'okapi',
    path: 'groups',
    params: {
      query: 'cql.allRecords=1 sortby group',
      limit: '200',
    },
    records: 'usergroups',
  },
  languageTranslatorId: '',
  languageTranslators: {
    type: 'okapi',
    records: 'languageTranslators',
    path: 'languageTranslators?limit=1000',
    resourceShouldRefresh: true,
    PUT: {
      path: 'languageTranslators',
    },
  },
});

export default LanguagesTranslatorsManager;
