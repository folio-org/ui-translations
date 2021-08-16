import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Checkbox,
  Icon,
  Layout,
  Modal,
  ModalFooter,
  MultiColumnList,
} from '@folio/stripes-components';
import { FormattedMessage, useIntl } from 'react-intl';
import { getLocaleLabel, ImportLocalesIcones } from '../../../utils/utils';

function AddNewLanguageModal(props) {
  const intl = useIntl();
  const [selection, setSelection] = useState({});
  const flags = ImportLocalesIcones();

  useEffect(() => {
    if (props.LanguagesList.length !== Object.values(selection).length) {
      const selectionData = {};
      props.LanguagesList.forEach((lang) => {
        selectionData[lang.localeCode] = false;
      });
      setSelection(selectionData);
    }
  }, [props.LanguagesList]);

  const onSaveAndClose = () => {
    const LanguagesList = props.LanguagesList.filter(
      (ul) => selection[ul.localeCode]
    );
    props.onSave(LanguagesList);
    props.onClose();
  };

  const onCancel = () => {
    props.onClose();
    setSelection({
      selection: {},
    });
  };

  const onToggleBulkSelection = () => {
    const select = Object.values(selection).includes(false);
    const selectionData = {};

    props.LanguagesList.forEach((ll) => {
      selectionData[ll.localeCode] = select;
    });
    setSelection(selectionData);
  };

  const onToggleSelection = (ll) => {
    setSelection({
      ...selection,
      [ll.localeCode]: !selection[ll.localeCode],
    });
  };


  const renderModalFooter = () => {
    const isSelected = Object.values(selection).includes(true);

    return (
      <ModalFooter>
        <Button
          buttonStyle="primary"
          id="save-languages-list-btn"
          onClick={() => onSaveAndClose()}
          disabled={!isSelected}
        >
          <FormattedMessage id="ui-translations.buttons.addAndClose" />
        </Button>
        <Button onClick={onCancel}>
          <FormattedMessage id="stripes-core.button.cancel" />
        </Button>
      </ModalFooter>
    );
  };

  return (
    <Modal
      footer={renderModalFooter()}
      open={props.open}
      onClose={props.onClose}
      dismissible
      label={
        <Icon icon="plus-sign">
          <FormattedMessage id="ui-translations.settings.languages.addModal.header" />
        </Icon>
      }
    >
      <Layout className="textCentered">
        <FormattedMessage
          id="ui-translations.settings.languages.addModal.languagesListFound"
          values={{ count: props.LanguagesList.length }}
        />
      </Layout>
      <MultiColumnList
        interactive={false}
        contentData={props.LanguagesList}
        visibleColumns={['selected', 'name', 'localeCode']}
        columnWidths={{ selected: '5%', name: '85%', localeCode: '10%' }}
        columnMapping={{
          selected: (
            <Checkbox
              name="selected-all"
              checked={Object.values(selection).includes(false) !== true}
              onChange={onToggleBulkSelection}
              onMouseDown={(e) => e.preventDefault()}
            />
          ),
          name: intl.formatMessage({
            id: 'ui-translations.settings.languages.columns.name',
          }),
          localeCode: (
            <FormattedMessage id="ui-translations.settings.languages.columns.localeCode" />
          ),
        }}
        formatter={{
          selected: (ul) => (
            <Checkbox
              name={`selected-${ul.localeCode}`}
              checked={!!selection[ul.localeCode]}
              onChange={() => onToggleSelection(ul)}
            />
          ),
          name: (ul) => (
            <Icon icon={flags[ul.localeCode] ? flags[ul.localeCode] : 'flag'}>
              {getLocaleLabel(ul.localeCode, intl)}
            </Icon>
          ),
        }}
        isSelected={({ item }) => selection[item.localeCode]}
      />
    </Modal>
  );
}
AddNewLanguageModal.propTypes = {
  LanguagesList: PropTypes.arrayOf(PropTypes.object),
  open: PropTypes.bool,
  onSave: PropTypes.func,
  onClose: PropTypes.func,
};

export default AddNewLanguageModal;
