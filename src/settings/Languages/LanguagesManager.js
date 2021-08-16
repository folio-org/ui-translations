/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { get, isEqual, sortBy } from 'lodash';
import {
  Callout,
  ConfirmationModal,
  Icon,
  List,
} from '@folio/stripes-components';
import LanguagesForm from './LanguagesForm';
import { getLocaleLabel } from '../../utils/utils';

function LanguagesManager(props) {
  const [languagesList, setLanguagesList] = useState([]);
  const [openConfirmDeleteModal, setOpenConfirmDeleteModal] = useState(false);
  const [deletedLangauges, setDeletedLangauges] = useState([]);

  const intl = useIntl();
  let callout;

  useEffect(() => {
    const languages = sortBy((props.resources.languages || {}).records || [], [
      'localeCode',
    ]);
    if (!isEqual(languages, languagesList)) {
      setLanguagesList(languages);
    }
  }, [props.resources.languages]);

  const onShowCallout = (message) => {
    if (callout) {
      callout.sendCallout({ message });
    }
  };

  // In case you delete any language, you need to get languageTranslatorsId to perform languageTranslators delete trigger.
  const getLanguageTranslatorsId = (localeCode) => {
    return get(((props.resources.languageTranslators || {}).records || [])
      .find((loc) => loc.localeCode === localeCode), ['id'], {});
  };

  // In case you delete any language, you need to get languageId to perform language delete trigger(because you delete from mapped array)
  const getLanguageId = (localeCode) => {
    return get(((props.resources.translations || {}).records || [])
      .find(
        (loc) => loc.localeCode === localeCode
      ), ['id'], {});
  };

  const onConfirmDeleteLanguages = () => {
    const res = deletedLangauges.map((loc) => props.mutator.languages
      .DELETE({ id: loc.id })
      // Trigger delete language record from language-translators table after deleting the language(maybe removed after doing this from API)
      .then(() => {
        props.mutator.languageTranslators.DELETE({
          id: getLanguageTranslatorsId(loc.localeCode),
        });
      })
      // Trigger delete language translations record from translations table after deleting the language(maybe removed after doing this from API)
      .then(() => {
        props.mutator.translations.DELETE({
          id: getLanguageId(loc.localeCode),
        });
      }));

    Promise.resolve(res).then(() => {
      setOpenConfirmDeleteModal(false);
      onShowCallout(
        <div>
          <strong>
            <FormattedMessage id="ui-translations.settings.languages.callout.deletedMessage" />
          </strong>
          <List
            listStyle="bullets"
            items={deletedLangauges}
            itemFormatter={(item) => (
              <li>{getLocaleLabel(item.localeCode, intl)}</li>
            )}
          />
        </div>
      );
    });
  };

  const renderDeleteLanguagesModal = () => {
    return (
      <ConfirmationModal
        id="delete-user-locale-confirmation-modal"
        open={openConfirmDeleteModal}
        onConfirm={onConfirmDeleteLanguages}
        onCancel={() => {
          setLanguagesList(
            sortBy((props.resources.languages || {}).records || [], [
              'localeCode',
            ])
          );
          setOpenConfirmDeleteModal(false);
        }}
        confirmLabel={
          <FormattedMessage id="ui-translations.buttons.confirmDelete" />
        }
        heading={
          <Icon icon="exclamation-circle" size="large">
            <FormattedMessage id="ui-translations.settings.languages.deleteModal.heading" />
          </Icon>
        }
        message={
          <div>
            <div>
              <FormattedMessage id="ui-translations.settings.languages.deleteModal.message.header" />
              <List
                listStyle="bullets"
                items={deletedLangauges}
                itemFormatter={(item) => (
                  <strong>
                    <li>{getLocaleLabel(item.localeCode, intl)}</li>
                  </strong>
                )}
              />
              <FormattedMessage id="ui-translations.settings.languages.deleteModal.message" />
            </div>
          </div>
        }
      />
    );
  };

  const onCreateNewLangauges = (newlangauges) => {
    const res = newlangauges.forEach((newLang) => {
      props.mutator.languages
        .POST({
          name: newLang.name,
          localeCode: newLang.localeCode,
        })
        // Trigger insert language record into language-translators table after inserting the language(maybe removed after doing this from API)
        .then(() => {
          props.mutator.languageTranslators.POST({
            localeCode: newLang.localeCode,
            translators: [],
          });
        })
        // Trigger insert language translations record into translations table after inserting the language(maybe removed after doing this from API)
        .then(() => {
          props.mutator.translations.POST({
            localeCode: newLang.localeCode,
            messages: {},
          });
        });
    });

    Promise.resolve(res).then(() => {
      onShowCallout(
        <div>
          <strong>
            <FormattedMessage id="ui-translations.settings.languages.callout.message.addNew" />
          </strong>
          <List
            listStyle="bullets"
            items={newlangauges}
            itemFormatter={(item) => (
              <li>{getLocaleLabel(item.localeCode, intl)}</li>
            )}
          />
        </div>
      );
    });
  };

  const onFormSubmit = (values) => {
    // Get list of deleted languages
    const deletedLanguages = languagesList.filter((lang) => {
      return !values.languagesList.some((oldLang) => {
        return lang.localeCode === oldLang.localeCode;
      });
    });

    // Get list of new added languages
    const newLanguages = values.languagesList.filter((oldLang) => {
      return !languagesList.some((lang) => {
        return oldLang.localeCode === lang.localeCode;
      });
    });

    if (newLanguages.length) onCreateNewLangauges(newLanguages);

    if (deletedLanguages.length) {
      setDeletedLangauges(deletedLanguages);
      setOpenConfirmDeleteModal(true);
    }
  };

  return (
    <>
      <LanguagesForm
        {...props}
        onSubmit={onFormSubmit}
        initialValues={{
          languagesList,
        }}
      />
      <Callout
        ref={(ref) => {
          callout = ref;
        }}
      />
      {renderDeleteLanguagesModal()}
    </>
  );
}

LanguagesManager.propTypes = {
  resources: PropTypes.shape({
    languages: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
    translations: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
    translationId: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }),
    languageId: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }),
    languageTranslators: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
    languageTranslatorId: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }),
  }),
  mutator: PropTypes.shape({
    languageTranslators: PropTypes.shape({
      GET: PropTypes.func.isRequired,
      reset: PropTypes.func.isRequired,
      POST: PropTypes.func.isRequired,
    }),
    translations: PropTypes.shape({
      GET: PropTypes.func.isRequired,
      reset: PropTypes.func.isRequired,
      POST: PropTypes.func.isRequired,
      PUT: PropTypes.func.isRequired,
    }),
    languages: PropTypes.shape({
      GET: PropTypes.func.isRequired,
      reset: PropTypes.func.isRequired,
      POST: PropTypes.func.isRequired,
      PUT: PropTypes.func.isRequired,
    }),
    translationId: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }),
    languageId: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }),
    languageTranslatorId: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }),
  }),
};
LanguagesManager.manifest = Object.freeze({
  languageId: '',
  languages: {
    type: 'okapi',
    records: 'languages',
    path: 'languages?limit=1000',
    // resourceShouldRefresh: true,
    POST: {
      path: 'languages',
    },
    PUT: {
      path: 'languages',
    },
    DELETE: {
      path: 'languages',
    },
  },
  translationsId: '',
  translations: {
    type: 'okapi',
    records: 'translations',
    path: 'translations?limit=1000',
    // resourceShouldRefresh: true,
    POST: {
      path: 'translations',
    },
    DELETE: {
      path: 'translations',
    },
  },
  languageTranslatorId: '',
  languageTranslators: {
    type: 'okapi',
    records: 'languageTranslators',
    path: 'languageTranslators?limit=1000',
    // resourceShouldRefresh: true,
    POST: {
      path: 'languageTranslators',
    },
    DELETE: {
      path: 'languageTranslators',
    },
  },
});

export default LanguagesManager;
