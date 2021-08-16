import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Accordion,
  FilterAccordionHeader,
  Select,
} from '@folio/stripes-components';
import { FormattedMessage, useIntl } from 'react-intl';

function AppFilter({
  currentApp,
  setCurrentApp,
  setCurrentTable,
  dataOptions,
  disabled,
}) {
  const intl = useIntl();
  const [filterToggle, setFilterToggle] = useState(true);

  const onChangeApp = (event) => {
    setCurrentApp(event.target.value);
    if (setCurrentTable) setCurrentTable('all');
  };

  const handleFilterToggle = () => {
    setFilterToggle(!filterToggle);
  };

  const renderFilterByApp = () => {
    const options = [
      {
        value: 'all',
        label: intl.formatMessage({
          id: 'ui-translations.filters.options.appFilter.all',
        }),
        disabled: false,
      },
      { value: '-', label: '--------------------------', disabled: true },
      ...dataOptions.map((app) => ({
        label: app.startsWith('ui-')
          ? intl.formatMessage({
            id: `${app}.meta.title`,
            defaultMessage: `${app.replace('ui-', '')}`,
          })
          : intl.formatMessage({
            id: `ui-translations.appName.${app}`,
            defaultMessage: `${app}`,
          }),
        value: app,
        disabled: false,
      })),
    ];

    return (
      <div>
        <Select
          id="app-filter-select"
          name="locale-filter"
          value={currentApp}
          dataOptions={options}
          onChange={onChangeApp}
          disabled={disabled}
        />
      </div>
    );
  };

  return (
    <Accordion
      id="app-filter-accordion"
      label={
        <FormattedMessage id="ui-translations.filters.accordion.appFilter" />
        }
      onToggle={handleFilterToggle}
      open={filterToggle}
      header={FilterAccordionHeader}
    >
      {renderFilterByApp()}
    </Accordion>
  );
}

AppFilter.propTypes = {
  dataOptions: PropTypes.arrayOf(PropTypes.string),
  currentApp: PropTypes.string,
  setCurrentApp: PropTypes.func,
  setCurrentTable: PropTypes.func,
  disabled: PropTypes.bool,
};

export default AppFilter;
