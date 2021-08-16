import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Icon,
  MultiColumnList,
  Pane,
  PaneFooter,
  Paneset,
} from '@folio/stripes-components';
import { FieldArray } from 'react-final-form-arrays';
import { FormattedMessage, useIntl } from 'react-intl';
import stripesFinalForm from '@folio/stripes-final-form';
import { getLocaleLabel, ImportLocalesIcones } from '../../utils/utils';
import SupportedLocales from '../../utils/SupportedLocales';
import AddNewLanguageModal from './components/AddNewLanguageModal';

function LanguagesForm({ pristine, submitting, handleSubmit, form }) {
  const [ShowAddNewModal, setShowAddNewModal] = useState(false);

  const flags = ImportLocalesIcones();
  const intl = useIntl();

  const renderPaneFooter = () => {
    return (
      <PaneFooter
        renderEnd={
          <Button
            buttonStyle="primary mega"
            disabled={pristine || submitting}
            id="clickable-tenantLocales"
            marginBottom0
            type="submit"
            onClick={handleSubmit}
          >
            <FormattedMessage id="stripes-core.button.save" />
          </Button>
        }
        renderStart={
          <Button
            buttonStyle="default mega"
            disabled={pristine || submitting}
            id="clickable-cancel"
            marginBottom0
            onClick={form.reset}
          >
            <FormattedMessage id="stripes-components.cancel" />
          </Button>
        }
      />
    );
  };

  const renderAddNewLanguagesButton = () => {
    return (
      <div>
        <div>
          <Button
            id="add-new-languages-btn"
            buttonStyle="primary"
            onClick={() => setShowAddNewModal(true)}
            marginBottom0
          >
            <Icon icon="plus-sign">
              <FormattedMessage id="ui-translations.settings.languages.addLocales" />
            </Icon>
          </Button>
        </div>
      </div>
    );
  };

  const onAddNewLangaues = (newLanguages) => {
    return newLanguages.map((lang) => form.mutators.push('languagesList', lang));
  };

  const renderAddNewLanguagesModal = (fields) => {
    // Filter already selected languages to prevent them from being selected again
    const modalList = SupportedLocales.filter(
      (suppLang) => !fields.value.find(
        (selectedLang) => suppLang.localeCode === selectedLang.localeCode
      )
    );

    return (
      <AddNewLanguageModal
        onClose={() => setShowAddNewModal(false)}
        open={ShowAddNewModal}
        onSave={onAddNewLangaues}
        LanguagesList={modalList}
      />
    );
  };

  const renderLanguagesList = ({ fields }) => {
    return (
      <>
        <MultiColumnList
          interactive={false}
          contentData={fields.value}
          visibleColumns={['name', 'localeCode', 'Actions']}
          columnWidths={{
            name: '60%',
            localeCode: '25%',
            Actions: '15%',
          }}
          columnMapping={{
            name: (
              <FormattedMessage id="ui-translations.settings.languages.columns.name" />
            ),
            localeCode: (
              <FormattedMessage id="ui-translations.settings.languages.columns.localeCode" />
            ),
            Actions: (
              <FormattedMessage id="ui-translations.settings.languages.columns.actions" />
            ),
          }}
          formatter={{
            name: (lang) => (
              <Icon
                icon={flags[lang.localeCode] ? flags[lang.localeCode] : 'flag'}
              >
                {getLocaleLabel(lang.localeCode, intl)}
              </Icon>
            ),
            Actions: (lang) => (
              <Button
                buttonStyle="fieldControl"
                align="end"
                type="button"
                id={`clickable-remove-tenantLocales-${lang.localeCode}`}
                onClick={() => fields.remove(lang.rowIndex)}
              >
                <Icon icon="trash" />
              </Button>
            ),
          }}
        />
        {renderAddNewLanguagesModal(fields)}
      </>
    );
  };

  return (
    <>
      <Paneset>
        <Pane
          fluidContentWidth
          footer={renderPaneFooter()}
          id="pane-translation-languages-form"
          paneTitle={
            <FormattedMessage id="ui-translations.settings.languages.lable" />
          }
          paneSub={
            <FormattedMessage
              id="ui-translations.settings.languages.pane.subHeader"
              values={{
                count: form.getState().values.languagesList.length,
              }}
            />
          }
          lastMenu={renderAddNewLanguagesButton()}
        >
          <form id="form-translation-languages" onSubmit={handleSubmit}>
            <FieldArray name="languagesList" component={renderLanguagesList} />
          </form>
        </Pane>
      </Paneset>
    </>
  );
}

LanguagesForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  form: PropTypes.object.isRequired,
};

export default stripesFinalForm({
  navigationCheck: true,
  subscription: {
    values: true,
  },
  validateOnBlur: true,
})(LanguagesForm);
