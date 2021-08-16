import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Icon,
  Pane,
  Paneset,
  Tooltip,
} from '@folio/stripes-components';
import { FormattedMessage, useIntl } from 'react-intl';
import { AppIcon } from '@folio/stripes-core';
import ResultsPane from '../ResultsPane/ResultsPane';
import useQueryParams from '../Hooks/useQueryParams';
import ActiveFilters from '../Filters/ActiveFilters';
import {
  getAppsNames,
  getTablesNamesByApp,
  getTranslationsByTable,
} from '../../utils/utils';
import SearchBox from '../SearchBox/SearchBox';
import css from './TranslationWrapper.css';

function TranslationWrapper({
  activeFilters,
  currentLocale,
  setCurrentLocale,
  masterTranslation,
  localeTranslations,
  paneTitle,
}) {
  const intl = useIntl();

  // Search query params
  const [searchActive, setSearchActive] = useQueryParams('search', 'false');
  const [searchTerm, setSearchTerm] = useQueryParams('term', '');
  const [selectedIndex, setSelectedIndex] = useQueryParams(
    'index',
    'translatedText'
  );

  // Active filters query params
  const [currentApp, setCurrentApp] = useQueryParams('app', 'all');
  const [currentTable, setCurrentTable] = useQueryParams('table', 'all');
  const [currentStatus, setCurrentStatus] = useQueryParams('status', 'all');

  // Data states
  const [contentData, setContentData] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [selection, setSelection] = useState({});

  // App settings states
  const [showFilters, setShowFilters] = useState(true);
  const [showStats, setShowStats] = useState(false);

  // Reset all translations filters
  const resetAll = () => {
    setCurrentLocale('');
    setCurrentApp('all');
    setCurrentTable('all');
    setCurrentStatus('all');
    setSearchActive('false');
    setSearchTerm('');
    setSearchResults([]);
    setContentData([]);
    setSelectedIndex('translatedText');
    setShowStats(false);
  };

  const filterDataByStatus = () => {
    switch (currentStatus) {
      case 'all':
        return contentData;
      case 'translated':
        return contentData.filter(
          (trans) => trans.translatedText !== undefined
        );
      case 'notTranslated':
        return contentData.filter(
          (trans) => trans.translatedText === undefined
        );
      case 'englishOnly':
        return contentData.filter(
          (trans) => trans.translatedText === trans.originText
        );
      case 'noneEnglish':
        return contentData.filter(
          (trans) => trans.translatedText !== trans.originText
        );
      default:
        return contentData;
    }
  };

  const getResultTotalCount = () => {
    return (
      <FormattedMessage
        id="stripes-smart-components.searchResultsCountHeader"
        values={{
          count:
            searchActive === 'true'
              ? searchResults.length
              : filterDataByStatus().length,
        }}
      />
    );
  };

  // handle search results
  const getSearchResultsByValues = (data, term, index) => {
    return data.filter((value) => {
      return (value[index] ? value[index].toLowerCase() : '').includes(
        term.toLowerCase()
      );
    });
  };

  useEffect(() => {
    const dataToBeShow = [];
    const trans = getTranslationsByTable(
      currentApp,
      currentTable,
      masterTranslation
    );
    for (const key in trans) {
      if (key && currentLocale !== '') {
        dataToBeShow.push({
          originText: masterTranslation[key],
          translatedText: localeTranslations[key],
          translationKey: key,
        });
      }
    }
    if (searchActive === 'true') {
      setSearchResults(
        getSearchResultsByValues(dataToBeShow, searchTerm, selectedIndex)
      );
    } else setContentData(dataToBeShow);
  }, [
    currentLocale,
    currentApp,
    currentTable,
    currentStatus,
    masterTranslation,
    localeTranslations,
    selectedIndex,
    searchActive,
  ]);

  return (
    <>
      <Paneset>
        {showFilters ? (
          // search & filters pane
          <Pane
            defaultWidth="20%"
            paneTitle={
              <Icon icon="search">
                <FormattedMessage id="stripes-smart-components.searchAndFilter" />
              </Icon>
            }
            noOverflow
            lastMenu={
              <Tooltip
                id="Translation-hideFilters-tooltip"
                text={
                  <FormattedMessage id="ui-translations.buttons.tooltip.hideFilters" />
                }
              >
                {({ ref, ariaIds }) => (
                  <Button
                    buttonStyle="dropdownItem"
                    id="clickable-translations-hideFilters"
                    marginBottom0
                    onClick={() => setShowFilters(!showFilters)}
                    aria-labelledby={ariaIds.text}
                    ref={ref}
                  >
                    <Icon icon="chevron-double-left" />
                  </Button>
                )}
              </Tooltip>
            }
          >
            {
              <SearchBox
                ContentData={filterDataByStatus()}
                currentLocale={currentLocale}
                searchTerm={searchTerm}
                onChangeSearchTerm={setSearchTerm}
                searchActive={searchActive}
                onActivateSearch={setSearchActive}
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex}
              />
            }
            {
              <ActiveFilters
                activeFilters={activeFilters}
                currentLocale={currentLocale}
                setCurrentLocale={setCurrentLocale}
                currentApp={currentApp}
                setCurrentApp={(loc) => {
                  setCurrentApp(loc);
                  setCurrentTable('all');
                }}
                currentTable={currentTable}
                setCurrentTable={setCurrentTable}
                currentStatus={currentStatus}
                setCurrentStatus={setCurrentStatus}
                resetAll={resetAll}
                apps={getAppsNames(masterTranslation)}
                tables={getTablesNamesByApp(currentApp, masterTranslation)}
              />
            }
          </Pane>
        ) : (
          <div />
        )}
        {
          /* results pane */
          <Pane
            appIcon={<AppIcon app="translations" />}
            fluidContentWidth
            noOverflow
            paneTitle={paneTitle}
            paneSub={getResultTotalCount()}
            firstMenu={
              !showFilters ? (
                <Tooltip
                  id="Translation-showFilters-tooltip"
                  text={
                    <FormattedMessage id="ui-translations.buttons.tooltip.showFilters" />
                  }
                >
                  {({ ref, ariaIds }) => (
                    <Button
                      buttonStyle="dropdownItem"
                      id="clickable-translations-showFilter"
                      marginBottom0
                      onClick={() => setShowFilters(!showFilters)}
                      aria-labelledby={ariaIds.text}
                      ref={ref}
                    >
                      <Icon icon="chevron-double-right" />
                    </Button>
                  )}
                </Tooltip>
              ) : (
                <div />
              )
            }
            lastMenu={
              !showStats ? (
                <div style={{ paddingLeft: '0.7em', paddingRight: '0.7em' }}>
                  <Tooltip
                    id="Translation-showStats-tooltip"
                    text={
                      <FormattedMessage id="ui-translations.buttons.tooltip.showStats" />
                    }
                  >
                    {({ ref, ariaIds }) => (
                      <Button
                        buttonStyle="dropdownItem"
                        id="clickable-translations-showStats"
                        marginBottom0
                        onClick={() => setShowStats(!showStats)}
                        aria-labelledby={ariaIds.text}
                        ref={ref}
                      >
                        <AppIcon app="erm-usage" />
                      </Button>
                    )}
                  </Tooltip>
                </div>
              ) : (
                <div />
              )
            }
          >
            {currentLocale === '' ? (
              <div className={css.noLanguageSelected}>
                <Icon icon="arrow-left">
                  {intl.formatMessage({
                    id: 'ui-translations.resultsPane.validate.noLangaugeFound',
                  })}
                </Icon>
              </div>
            ) : (
              <ResultsPane
                contentData={
                  searchActive === 'true' ? searchResults : filterDataByStatus()
                }
                searchActive={searchActive}
                searchTerm={searchTerm}
                selectedIndex={selectedIndex}
                currentLocale={currentLocale}
                selection={selection}
                setSelection={setSelection}
              />
            )}
          </Pane>
        }
        {showStats ? (
          // stats pane
          <Pane
            appIcon={<AppIcon app="erm-usage" />}
            defaultWidth="20%"
            fluidContentWidth
            paneTitle={
              <FormattedMessage id="ui-translations.Stats.paneTitle" />
            }
            firstMenu={
              showStats ? (
                <Tooltip
                  id="Translation-hideStats-tooltip"
                  text={
                    <FormattedMessage id="ui-translations.buttons.tooltip.hideStats" />
                  }
                >
                  {({ ref, ariaIds }) => (
                    <Button
                      buttonStyle="dropdownItem"
                      id="clickable-translations-hideStats"
                      marginBottom0
                      onClick={() => setShowStats(!setShowStats)}
                      aria-labelledby={ariaIds.text}
                      ref={ref}
                    >
                      <Icon icon="chevron-double-right" />
                    </Button>
                  )}
                </Tooltip>
              ) : (
                <div />
              )
            }
          >
            <FormattedMessage id="ui-translations.Stats.validate.noStats" />
          </Pane>
        ) : (
          <div />
        )}
      </Paneset>
    </>
  );
}

TranslationWrapper.propTypes = {
  activeFilters: PropTypes.arrayOf(PropTypes.string),
  currentLocale: PropTypes.string,
  setCurrentLocale: PropTypes.func,
  masterTranslation: PropTypes.object,
  localeTranslations: PropTypes.object,
  paneTitle: PropTypes.string,
};

export default TranslationWrapper;
