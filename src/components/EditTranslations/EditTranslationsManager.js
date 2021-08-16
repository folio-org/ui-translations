import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { Modal } from '@folio/stripes-components';
import { AppIcon, stripesConnect, withStripes } from '@folio/stripes-core';
import EditTranslationsForm from './EditTranslationsForm';

function EditTranslationsManager({
  open,
  onClose,
  item,
  currentLocale,
  stripes,
  resources,
  mutator,
}) {
  const intl = useIntl();

  const appName = item.translationKey
    ? item.translationKey.substr(0, item.translationKey.indexOf('.'))
    : '';
  const tableName = item.translationKey
    ? item.translationKey.split('.', 2)[1]
    : '';

  const onFormSubmit = (values) => {
    const newTrans = { [item.translationKey]: values.translatedText };

    const record = ((resources.translations || {}).records || []).find(
      (loc) => loc.localeCode === currentLocale
    );
    mutator.translationId.replace(record.id);
    record.messages = Object.assign(record.messages, newTrans);
    mutator.translations.PUT(record).then(() => {
      onClose();
      if (intl.locale === currentLocale) {
        stripes.setTranslations(newTrans);
      }
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      label={
        <AppIcon app="translations" size="small">
          <FormattedMessage
            id="ui-translations.editTranslation.modal.header"
            defaultMessage="{appName} App - Translation of {tableName}"
            values={{
              tableName: (
                <FormattedMessage
                  id={`ui-translations.filters.options.tableFilter.${tableName}`}
                  defaultMessage={tableName}
                />
              ),
              appName: (
                <FormattedMessage
                  id={`${appName}.meta.title`}
                  defaultMessage={appName.replace('ui-', '')}
                />
              ),
            }}
          />
        </AppIcon>
      }
    >
      <EditTranslationsForm
        onSubmit={onFormSubmit}
        initialValues={{
          translatedText: item.translatedText,
        }}
        onClose={onClose}
        item={item}
      />
    </Modal>
  );
}

EditTranslationsManager.propTypes = {
  stripes: PropTypes.object,
  item: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  currentLocale: PropTypes.string,
  resources: PropTypes.shape({
    translations: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object),
    }),
    translationId: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }),
  }),
  mutator: PropTypes.shape({
    translations: PropTypes.shape({
      GET: PropTypes.func.isRequired,
      reset: PropTypes.func.isRequired,
      POST: PropTypes.func.isRequired,
      PUT: PropTypes.func.isRequired,
    }),
    translationId: PropTypes.shape({
      replace: PropTypes.func.isRequired,
    }),
  }),
};

EditTranslationsManager.manifest = {
  translations: {
    type: 'okapi',
    path: 'translations?limit=1000',
    records: 'translations',
    POST: {
      path: 'translations',
    },
    PUT: {
      path: 'translations',
    },
  },
  translationId: '',
};

export default stripesConnect(withStripes(EditTranslationsManager));
