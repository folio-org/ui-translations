import React from 'react';
import { Button, Icon } from '@folio/stripes-components';
import { FormattedMessage } from 'react-intl';
import AppFilter from './FiltersItems/AppFilter';
import LocaleFilter from './FiltersItems/LocaleFilter';
import TableFilter from './FiltersItems/TableFilter';
import StatusFilter from './FiltersItems/StatusFilter';

function ActiveFilters({
  currentLocale,
  setCurrentLocale,
  currentApp,
  setCurrentApp,
  currentTable,
  setCurrentTable,
  currentStatus,
  setCurrentStatus,
  resetAll,
  apps,
  tables,
  activeFilters,
  languages,
}) {
  return (
    <>
      <div>
        <br />
        <Button
          buttonStyle="none"
          id="clickable-reset-all"
          onClick={resetAll}
          disabled={currentLocale === ''}
        >
          <Icon icon="times-circle-solid">
            <FormattedMessage id="stripes-smart-components.resetAll" />
          </Icon>
        </Button>
      </div>
      {activeFilters.includes('locale') &&
        <LocaleFilter
          currentLocale={currentLocale}
          setCurrentLocale={setCurrentLocale}
          dataOptions={languages}
          disabled={false}
        />
      }
      {activeFilters.includes('app') &&
        <AppFilter
          currentApp={currentApp}
          setCurrentApp={setCurrentApp}
          dataOptions={apps}
          disabled={currentLocale === ''}
        />
      }
      {activeFilters.includes('table') &&
        <TableFilter
          currentTable={currentTable}
          setCurrentTable={setCurrentTable}
          dataOptions={tables}
          disabled={currentLocale === '' || currentApp === 'all'}
        />
      }
      {activeFilters.includes('status') &&
        <StatusFilter
          currentStatus={currentStatus}
          setCurrentStatus={setCurrentStatus}
          disabled={currentLocale === ''}
        />
      }
    </>
  );
}

export default ActiveFilters;
