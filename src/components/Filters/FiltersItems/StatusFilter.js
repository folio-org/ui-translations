import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Accordion,
  FilterAccordionHeader,
  Select,
} from '@folio/stripes-components';
import { FormattedMessage, useIntl } from 'react-intl';

function StatusFilter({
  currentStatus,
  setCurrentStatus,
  disabled,
}) {
  const intl = useIntl();
  const [filterToggle, setFilterToggle] = useState(true);

  const onChangeStatus = (event) => {
    setCurrentStatus(event.target.value);
  };

  const handleFilterToggle = () => {
    setFilterToggle(!filterToggle);
  };

  const renderFilterByStatus = () => {
    const dataOptions = [
      {
        value: 'all',
        label: intl.formatMessage({
          id: 'ui-translations.filters.options.statusFilter.all',
        }),
        disabled: false,
      },
      {
        value: 'translated',
        label: intl.formatMessage({
          id: 'ui-translations.filters.options.statusFilter.translated',
        }),
        disabled: false,
      },
      {
        value: 'notTranslated',
        label: intl.formatMessage({
          id: 'ui-translations.filters.options.statusFilter.notTranslated',
        }),
        disabled: false,
      },
      {
        value: 'englishOnly',
        label: intl.formatMessage({
          id: 'ui-translations.filters.options.statusFilter.englishOnly',
        }),
        disabled: false,
      },
      {
        value: 'noneEnglish',
        label: intl.formatMessage({
          id: 'ui-translations.filters.options.statusFilter.noneEnglish',
        }),
        disabled: false,
      },
    ];

    return (
      <div>
        <Select
          id="app-filter-select"
          name="locale-filter"
          value={currentStatus}
          dataOptions={dataOptions}
          onChange={onChangeStatus}
          disabled={disabled}
        />
      </div>
    );
  };

  return (
    <>
      <Accordion
        id="translation-status-filter-accordion"
        label={
          <FormattedMessage id="ui-translations.filters.accordion.statusFilter" />
        }
        onToggle={handleFilterToggle}
        open={filterToggle}
        header={FilterAccordionHeader}
      >
        {renderFilterByStatus()}
      </Accordion>
    </>
  );
}

StatusFilter.propTypes = {
  currentStatus: PropTypes.string,
  setCurrentStatus: PropTypes.func,
  disabled: PropTypes.bool,
};

export default StatusFilter;
