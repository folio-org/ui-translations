/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import stripesFinalForm from '@folio/stripes-final-form';
import {
  Button,
  Icon,
  List,
  MultiColumnList,
  Pane,
  PaneFooter,
  Paneset,
  Tooltip,
} from '@folio/stripes-components';
import { FieldArray } from 'react-final-form-arrays';
import { AppIcon } from '@folio/stripes-core';
import { getFullName, getLocaleLabel, ImportLocalesIcones } from '../../utils/utils';
import EditTranslatorsModal from './EditTranslatorsModal';

function LanguagesTranslatorsForm({
  pristine,
  submitting,
  handleSubmit,
  form,
  usersList,
  patronGroups,
}) {
  const [ShowEditModal, setShowEditModal] = useState(false);
  const [SelectedRow, setSelectedRow] = useState();
  let Fields;

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

  const renderTranslatorsFormatter = (lang) => {
    const translators = usersList.filter((langTrans) => {
      return lang.translators.some((user) => {
        return langTrans.id === user;
      });
    });

    return (
      <List
        listStyle="bullets"
        marginBottom0
        items={translators}
        itemFormatter={(item) => (
          <li>
            {
              <div
                style={{
                  display: 'flex',
                  flex: 1,
                  justifyContent: 'space-between',
                  // flexFlow: 'column',
                }}
              >
                <div>
                  <AppIcon app="users" size="small">
                    {getFullName(item)}
                  </AppIcon>
                </div>
                <div>
                  <Button
                    buttonStyle="slim"
                    id="clickable-remove"
                    marginBottom0
                    onClick={() => {
                      lang.translators = lang.translators.filter(
                        (trans) => trans !== item.id
                      );
                      Fields.update(lang.rowIndex, lang);
                    }}
                  >
                    <Icon icon="times-circle" size="small" />
                  </Button>
                </div>
              </div>
            }
          </li>
        )}
      />
    );
  };

  const onAddNewTranslators = (newTrans) => {
    SelectedRow.translators = [...SelectedRow.translators, ...newTrans];
    Fields.update(SelectedRow.rowIndex, SelectedRow);
  };

  const renderAddNewTranslatorsModal = () => {
    const modalList = SelectedRow
      ? usersList.filter(
        (user) => !SelectedRow.translators.find((id) => user.id === id)
      )
      : usersList;

    return (
      <EditTranslatorsModal
        onClose={() => setShowEditModal(false)}
        open={ShowEditModal}
        onSave={onAddNewTranslators}
        usersList={modalList}
        patronGroups={patronGroups}
        currentLanguage={SelectedRow ? SelectedRow.localeCode : ''}
      />
    );
  };

  const renderLanguagesList = ({ fields }) => {
    Fields = fields;
    return (
      <>
        <MultiColumnList
          interactive={false}
          contentData={fields.value}
          visibleColumns={['localeCode', 'translators', 'Actions']}
          columnWidths={{
            localeCode: '45%',
            translators: '35%',
            Actions: '15%',
          }}
          columnMapping={{
            localeCode: (
              <FormattedMessage id="ui-translations.settings.languages.columns.name" />
            ),
            translators: (
              <FormattedMessage id="ui-translations.settings.languagesTranslators.columns.translators" />
            ),
            Actions: (
              <FormattedMessage id="ui-translations.settings.languages.columns.actions" />
            ),
          }}
          formatter={{
            localeCode: (lang) => (
              <Icon
                icon={
                  flags[lang.localeCode] ? flags[lang.localeCode] : 'flag'
                }
              >
                {getLocaleLabel(lang.localeCode, intl)}
              </Icon>
            ),
            translators: (lang) => renderTranslatorsFormatter(lang),
            Actions: (lang) => (
              <Tooltip
                id="add-translators-button-tooltip"
                text={
                  <FormattedMessage id="ui-translations.settings.languagesTranslators.addTranslators.toolTip" />
                }
              >
                {({ ref, ariaIds }) => (
                  <div>
                    <Button
                      buttonStyle="primary"
                      aria-labelledby={ariaIds.text}
                      ref={ref}
                      align="end"
                      type="button"
                      id={`clickable-add-translators-${lang.localeCode}`}
                      marginBottom0
                      onClick={() => {
                        setSelectedRow(lang);
                        setShowEditModal(true);
                      }}
                    >
                      <Icon icon="plus-sign" />
                    </Button>
                  </div>
                )}
              </Tooltip>
            ),
          }}
        />
        {renderAddNewTranslatorsModal()}
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
            <FormattedMessage id="ui-translations.settings.languagesTranslators.lable" />
          }
          paneSub={
            <FormattedMessage
              id="ui-translations.settings.languages.pane.subHeader"
              values={{
                count: form.getState().values.languagesList.length,
              }}
            />
          }
          //   lastMenu={renderAddNewLanguagesButton()}
        >
          <form id="form-translation-languages" onSubmit={handleSubmit}>
            <FieldArray name="languagesList" component={renderLanguagesList} />
          </form>
        </Pane>
      </Paneset>
    </>
  );
}

LanguagesTranslatorsForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  form: PropTypes.object.isRequired,
  usersList: PropTypes.arrayOf(PropTypes.object),
  patronGroups: PropTypes.arrayOf(PropTypes.object),
};

export default stripesFinalForm({
  navigationCheck: true,
  subscription: {
    values: true,
  },
  mutators: {},
  validateOnBlur: true,
})(LanguagesTranslatorsForm);
