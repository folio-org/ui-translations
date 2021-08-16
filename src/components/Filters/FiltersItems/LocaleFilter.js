import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Accordion,
  FilterAccordionHeader,
  Select,
} from '@folio/stripes-components';
import { FormattedMessage, useIntl } from 'react-intl';
import { getLocaleLabel } from '../../../utils/utils';
import AssignedLanguagesContext from '../../../Context/AssignedLanguages/AssignedLanguagesContext';

function LocaleFilter({
  currentLocale,
  setCurrentLocale,
  disabled,
}) {
  const intl = useIntl();
  const [filterToggle, setFilterToggle] = useState(true);
  const languages = useContext(AssignedLanguagesContext);

  const onChangeLocale = (event) => {
    setCurrentLocale(event.target.value);
  };

  const handleFilterToggle = () => {
    setFilterToggle(!filterToggle);
  };

  const getLocaleDataOptions = () => {
    const options = [
      ...languages.map((lang) => ({
        label: getLocaleLabel(lang.localeCode, intl),
        value: lang.localeCode,
      })),
    ];
    return options;
  };

  const renderFilterByLocale = () => {
    return (
      <div>
        <Select
          id="locale-filter-select"
          name="locale-filter"
          value={currentLocale}
          placeholder={intl.formatMessage({
            id: 'ui-translations.filters.placeHolder.localeFilter',
          })}
          dataOptions={getLocaleDataOptions()}
          onChange={onChangeLocale}
          disabled={disabled}
        />
      </div>
    );
  };

  return (
    <>
      <Accordion
        id="locale-filter-accordion"
        label={
          <FormattedMessage id="ui-translations.filters.accordion.localeFilter" />
        }
        onToggle={handleFilterToggle}
        open={filterToggle}
        separator={false}
        header={FilterAccordionHeader}
      >
        {renderFilterByLocale()}
      </Accordion>
    </>
  );
}

LocaleFilter.propTypes = {
  currentLocale: PropTypes.string,
  setCurrentLocale: PropTypes.func,
  disabled: PropTypes.bool,
};

export default LocaleFilter;
