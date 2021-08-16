import React from 'react';
import PropTypes from 'prop-types';
import { Button, SearchField } from '@folio/stripes-components';
import { FormattedMessage, useIntl } from 'react-intl';

function SearchBox({
  currentLocale,
  searchTerm,
  selectedIndex,
  setSelectedIndex,
  onActivateSearch,
  onChangeSearchTerm,
}) {
  const intl = useIntl();

  const searchableIndexes = [
    {
      label: intl.formatMessage({
        id: 'ui-translations.searchBox.searchOptions.allFields',
      }),
      value: 'allFields',
    },
    {
      label: intl.formatMessage({
        id: 'ui-translations.resultsPane.columns.originText',
      }),
      value: 'originText',
    },
    {
      label: intl.formatMessage({
        id: 'ui-translations.resultsPane.columns.translatedText',
      }),
      value: 'translatedText',
    },
    {
      label: intl.formatMessage({
        id: 'ui-translations.searchBox.searchOptions.translationKey',
      }),
      value: 'translationKey',
    },
  ];

  const clearValue = () => {
    onChangeSearchTerm('');
    onActivateSearch('false');
  };

  const onHandleChangeSearchTerm = (e) => {
    onChangeSearchTerm(e.target.value);
    onActivateSearch('false');
  };

  const onChangeSelectedIndex = (e) => {
    setSelectedIndex(e.target.value);
  };

  const onHandleSearchBox = () => {
    onActivateSearch('true');
  };

  return (
    <div>
      <SearchField
        onClear={clearValue}
        value={searchTerm}
        onChange={onHandleChangeSearchTerm}
        placeholder={
          currentLocale === ''
            ? intl.formatMessage({
              id: 'ui-translations.searchBox.validate.noLangaugeFound',
            })
            : intl.formatMessage({
              id: 'ui-translations.searchBox.enterSearchTerm',
            })
        }
        aria-label="Search for translations."
        clearSearchId="translations-search-button"
        id="clear-translations-sesrch-field"
        searchableIndexes={searchableIndexes}
        onChangeIndex={onChangeSelectedIndex}
        selectedIndex={selectedIndex}
        disabled={currentLocale === ''}
      />
      <Button
        buttonStyle="primary"
        disabled={searchTerm === '' || currentLocale === ''}
        fullWidth
        id="clickable-search-translations"
        marginBottom0
        onClick={() => onHandleSearchBox()}
      >
        <FormattedMessage id="stripes-smart-components.search" />
      </Button>
    </div>
  );
}

SearchBox.propTypes = {
  currentLocale: PropTypes.string,
  searchTerm: PropTypes.string,
  selectedIndex: PropTypes.string,
  setSelectedIndex: PropTypes.func,
  onActivateSearch: PropTypes.func,
  onChangeSearchTerm: PropTypes.func,
};

export default SearchBox;
