import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Checkbox,
  Icon,
  InfoPopover,
  MultiColumnList,
  Tooltip,
} from '@folio/stripes-components';
import { FormattedMessage, useIntl } from 'react-intl';
import { IfPermission, withStripes } from '@folio/stripes-core';
import Highlighter from 'react-highlight-words';
import { getLocaleLabel } from '../../utils/utils';
import EditTranslationsManager from '../EditTranslations/EditTranslationsManager';
import style from './ResultsPane.css';

function ResultsPane({
  currentLocale,
  searchTerm,
  selectedIndex,
  searchActive,
  selection,
  setSelection,
  contentData,
}) {
  const intl = useIntl();
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});

  useEffect(() => {
    if (contentData.length !== Object.values(selection).length) {
      const selectionData = {};
      contentData.forEach((trans) => {
        selectionData[trans.translationKey] = false;
      });
      setSelection(selectionData);
    }
  }, [contentData]);

  const onToggleBulkSelection = () => {
    const select = Object.values(selection).includes(false);
    const selectionData = {};

    contentData.forEach((trans) => {
      selectionData[trans.translationKey] = select;
    });
    setSelection(selectionData);
  };

  const onToggleSelection = (trans) => {
    setSelection({
      ...selection,
      [trans.translationKey]: !selection[trans.translationKey],
    });
  };

  const actionsFormatter = (item) => {
    return (
      <>
        <IfPermission perm="ui-translations.create">
          <Tooltip
            id="translate-one-tooltip"
            text={
              <FormattedMessage
                id="ui-translations.buttons.tooltip.translate"
                defaultMessage="Translate to {localeName}"
                values={{
                  localeName: getLocaleLabel(currentLocale, intl),
                }}
              />
            }
          >
            {({ ref, ariaIds }) => (
              <div style={{ paddingRight: '0.25em', paddingLeft: '0.25em' }}>
                <Button
                  aria-labelledby={ariaIds.text}
                  ref={ref}
                  buttonStyle={item.translatedText ? 'primary' : 'default'}
                  marginBottom0
                  id="clickable-translate-one-item"
                  onClick={() => {
                    setOpenEditModal(true);
                    setSelectedItem(item);
                  }}
                  onMouseDown={(e) => e.preventDefault()}
                  disabled={Object.values(selection).includes(true)}
                >
                  {item.translatedText ? (
                    <FormattedMessage id="ui-translations.buttons.editItem" />
                  ) : (
                    <FormattedMessage id="ui-translations.buttons.translate" />
                  )}
                </Button>
              </div>
            )}
          </Tooltip>
        </IfPermission>
      </>
    );
  };

  const renderTranslationsEditModal = () => {
    return (
      <EditTranslationsManager
        onClose={() => setOpenEditModal(false)}
        open={openEditModal}
        currentLocale={currentLocale}
        item={selectedItem}
      />
    );
  };

  const stringHighlighter = (textToHighlight) => {
    return (
      <Highlighter
        searchWords={[searchTerm]}
        autoEscape
        textToHighlight={textToHighlight}
      />
    );
  };

  return (
    <>
      <MultiColumnList
        interactive={false}
        visibleColumns={[
          'rowIndex',
          'selected',
          'translationKey',
          'originText',
          'translatedText',
          'Actions',
        ]}
        columnWidths={
          searchActive === 'true' && selectedIndex === 'translationKey'
            ? {
              selected: '5%',
              rowIndex: '5%',
              translationKey: '30%',
              originText: '20%',
              translatedText: '20%',
              Actions: '15%',
            }
            : {
              selected: '5%',
              rowIndex: '5%',
              translationKey: '5%',
              originText: '33%',
              translatedText: '35%',
              Actions: '22%',
            }
        }
        columnMapping={{
          rowIndex: '#',
          selected: (
            <Checkbox
              name="selected-all"
              checked={Object.values(selection).includes(false) !== true}
              onChange={onToggleBulkSelection}
              onMouseDown={(e) => e.preventDefault()}
            />
          ),
          translationKey: <Icon icon="key" />,
          Actions: intl.formatMessage({
            id: 'ui-translations.resultsPane.columns.actions',
          }),
          originText: intl.formatMessage({
            id: 'ui-translations.resultsPane.columns.originText',
          }),
          translatedText: intl.formatMessage({
            id: 'ui-translations.resultsPane.columns.translatedText',
          }),
        }}
        contentData={contentData}
        formatter={{
          selected: (trans) => (
            <Checkbox
              name={`selected-${trans.translationKey}`}
              checked={!!selection[trans.translationKey]}
              onChange={() => onToggleSelection(trans)}
              onMouseDown={(e) => e.preventDefault()}
            />
          ),
          rowIndex: (item) => contentData.findIndex(
            (index) => index.translationKey === item.translationKey
          ) + 1,
          translationKey: (item) => (searchActive === 'true' && selectedIndex === 'translationKey' ? (
            stringHighlighter(item.translationKey)
          ) : (
            <InfoPopover
              content={item.translationKey}
              icon="key"
              iconSize="medium"
              contentClass={style.infoPopover}
            />
          )),
          Actions: (item) => actionsFormatter(item),
          originText: (item) => (searchActive === 'true' && selectedIndex === 'originText'
            ? stringHighlighter(item.originText)
            : item.originText),

          translatedText: (item) => (searchActive === 'true' && selectedIndex === 'translatedText'
            ? stringHighlighter(item.translatedText)
            : item.translatedText),
        }}
        id="Apps-Translations-Multi-Column-List"
        autosize
        virtualize
      />
      {renderTranslationsEditModal()}
    </>
  );
}

ResultsPane.propTypes = {
  currentLocale: PropTypes.string,
  searchTerm: PropTypes.string,
  selectedIndex: PropTypes.string,
  searchActive: PropTypes.string,
  selection: PropTypes.object,
  setSelection: PropTypes.func,
  contentData: PropTypes.arrayOf(PropTypes.object),
};

export default withStripes(ResultsPane);
