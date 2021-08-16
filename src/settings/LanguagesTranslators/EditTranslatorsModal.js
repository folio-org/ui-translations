import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  Button,
  Checkbox,
  Col,
  Icon,
  Modal,
  ModalFooter,
  MultiColumnList,
  Row,
  Select,
} from '@folio/stripes-components';
import { AppIcon } from '@folio/stripes-core';
import { getFullName, getLocaleLabel } from '../../utils/utils';

function EditTranslatorsModal(props) {
  const intl = useIntl();
  const [selection, setSelection] = useState({});
  const [currentGroup, setCurrentGroup] = useState('allGroups');
  const [filterdUsers, setFilterdUsers] = useState(props.usersList);

  useEffect(() => {
    if (props.usersList.length !== Object.values(selection).length) {
      const selectionData = {};
      props.usersList.forEach((user) => {
        selectionData[user.id] = false;
      });
      setSelection(selectionData);
    }
  }, [props.usersList]);

  useEffect(() => {
    if (currentGroup === 'allGroups') {
      setFilterdUsers(props.usersList);
    } else {
      setFilterdUsers(
        props.usersList.filter((user) => user.patronGroup === currentGroup)
      );
    }
  }, [currentGroup]);

  const onSaveAndClose = () => {
    const usersList = props.usersList
      .filter((user) => selection[user.id])
      .map((user) => user.id);
    props.onSave(usersList);
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

    filterdUsers.forEach((user) => {
      selectionData[user.id] = select;
    });
    setSelection(selectionData);
  };

  const onToggleSelection = (user) => {
    setSelection({
      ...selection,
      [user.id]: !selection[user.id],
    });
  };

  const renderModalFooter = () => {
    const isSelected = Object.values(selection).includes(true);

    return (
      <ModalFooter>
        <Button
          buttonStyle="primary"
          id="save-user-list-btn"
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

  const onChangePatronGroup = (e) => {
    setCurrentGroup(e.target.value);
  };

  const renderPatronGroupsSelect = () => {
    const dataOptions = [
      {
        label: intl.formatMessage({
          id:
            'ui-translations.settings.languagesTranslators.editModal.patronGroups.options.all',
        }),
        value: 'allGroups',
      },
      ...props.patronGroups.map((group) => ({
        label: intl.formatMessage({
          id: `ui-users.patronGroups.group.${group.group}`,
          defaultMessage: group.group,
        }),
        value: group.id,
      })),
    ];

    return (
      <Row>
        <Col xs={6}>
          <Select
            id={`language-translators-${currentGroup}`}
            label={
              <FormattedMessage id="ui-translations.settings.languagesTranslators.filterByGroup" />
            }
            marginBottom0
            value={currentGroup}
            dataOptions={dataOptions}
            onChange={(e) => onChangePatronGroup(e)}
          />
        </Col>
      </Row>
    );
  };

  const renderPatronGroupsFormater = (user) => {
    const groupName = props.patronGroups.find(
      (group) => group.id === user.patronGroup
    );
    return groupName ? (
      <FormattedMessage
        id={`ui-users.patronGroups.group.${groupName.group}`}
        defaultMessage={groupName.group}
      />
    ) : (
      ''
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
          <FormattedMessage
            id="ui-translations.settings.languagesTranslators.addTranslators"
            values={{
              currentLanguage: getLocaleLabel(props.currentLanguage, intl)
            }}
          />
        </Icon>
      }
    >
      {renderPatronGroupsSelect()}
      <MultiColumnList
        interactive={false}
        contentData={filterdUsers}
        visibleColumns={['selected', 'personal', 'patronGroup']}
        columnWidths={{ selected: '5%', personal: '70%', patronGroup: '25%' }}
        columnMapping={{
          selected: (
            <Checkbox
              name="selected-all"
              checked={Object.values(selection).includes(false) !== true}
              onChange={onToggleBulkSelection}
              onMouseDown={(e) => e.preventDefault()}
            />
          ),
          personal: intl.formatMessage({
            id: 'ui-translations.settings.languagesTranslators.columns.user',
          }),
          patronGroup: intl.formatMessage({
            id: 'ui-translations.settings.languagesTranslators.columns.group',
          }),
        }}
        formatter={{
          selected: (user) => (
            <Checkbox
              name={`selected-${user.id}`}
              checked={!!selection[user.id]}
              onChange={() => onToggleSelection(user)}
            />
          ),
          personal: (user) => (
            <AppIcon app="users" size="small">
              {getFullName(user)}
            </AppIcon>
          ),
          patronGroup: (user) => renderPatronGroupsFormater(user),
        }}
        isSelected={({ item }) => selection[item.id]}
      />
    </Modal>
  );
}

EditTranslatorsModal.propTypes = {
  usersList: PropTypes.arrayOf(PropTypes.object),
  // eslint-disable-next-line react/no-unused-prop-types
  patronGroups: PropTypes.arrayOf(PropTypes.object),
  open: PropTypes.bool,
  onSave: PropTypes.func,
  onClose: PropTypes.func,
  currentLanguage: PropTypes.string
};

export default EditTranslatorsModal;
