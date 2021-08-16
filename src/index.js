import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Switch } from 'react-router-dom';
import { Route } from '@folio/stripes/core';
import Settings from './settings';
import TranslationsRoute from './routes/TranslationsRoute';
import LanguagesProvider from './Context/Languages/LanguagesProvider';
import AssignedLanguagesProvider from './Context/AssignedLanguages/AssignedLanguagesProvider';

function index(props) {
  const {
    actAs,
    match: { path }
  } = props;
  if (actAs === 'settings') {
    return <Settings {...props} />;
  }
  return (
    <LanguagesProvider>
      <AssignedLanguagesProvider>
        <Switch>
          <Redirect exact from={path} to={`${path}/con-vocab`} />
          <Route path={`${path}/con-vocab`} exact component={TranslationsRoute} />
        </Switch>
      </AssignedLanguagesProvider>
    </LanguagesProvider>
  );
}

index.propTypes = {
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
  }).isRequired,
  actAs: PropTypes.string.isRequired,
};

export default index;
