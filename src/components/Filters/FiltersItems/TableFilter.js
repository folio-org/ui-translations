import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Accordion,
  FilterAccordionHeader,
  Select,
} from '@folio/stripes-components';
import { FormattedMessage, useIntl } from 'react-intl';

function TableFilter({ currentTable, setCurrentTable, dataOptions, disabled }) {
  const intl = useIntl();
  const [filterToggle, setFilterToggle] = useState(true);

  const onChangeTable = (event) => {
    setCurrentTable(event.target.value);
  };

  const handleFilterToggle = () => {
    setFilterToggle(!filterToggle);
  };

  const renderFilterByTable = () => {
    const options = [
      {
        value: 'all',
        label: intl.formatMessage({
          id: 'ui-translations.filters.options.tableFilter.allTables',
        }),
        disabled: false,
      },
      { value: '-', label: '--------------------------', disabled: true },
      ...dataOptions.map((table) => ({
        label: intl.formatMessage({
          id: `ui-translations.filters.options.tableFilter.${table}`,
        }),
        value: table,
        disabled: false,
      })),
    ];

    return (
      <div>
        <Select
          id="table-filter-select"
          name="table-filter"
          value={currentTable}
          dataOptions={options}
          onChange={onChangeTable}
          disabled={disabled}
        />
      </div>
    );
  };

  return (
    <>
      <Accordion
        id="table-filter-accordion"
        label={
          <FormattedMessage id="ui-translations.filters.accordion.tableFilter" />
        }
        onToggle={handleFilterToggle}
        open={filterToggle}
        header={FilterAccordionHeader}
      >
        {renderFilterByTable()}
      </Accordion>
    </>
  );
}

TableFilter.propTypes = {
  dataOptions: PropTypes.arrayOf(PropTypes.string),
  currentTable: PropTypes.string,
  setCurrentTable: PropTypes.func,
  disabled: PropTypes.bool,
};

export default TableFilter;
