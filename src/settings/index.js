import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Settings } from '@folio/stripes/smart-components';
import LanguagesManager from './Languages/LanguagesManager';
import LanguagesTranslatorsManager from './LanguagesTranslators/LanguagesTranslatorsManager';

export default class TranslationsSettings extends React.Component {
  pages = [
    {
      route: 'languages',
      label: <FormattedMessage id="ui-translations.settings.languages.lable" />,
      component: LanguagesManager,
      perm: 'ui-translations.settings.languages'
    },
    {
      route: 'languages-translators',
      label: <FormattedMessage id="ui-translations.settings.languagesTranslators.lable" />,
      component: LanguagesTranslatorsManager,
      perm: 'ui-translations.settings.languageTranslators'
    },
  ];

  render() {
    return (
      <Settings {...this.props} pages={this.pages} paneTitle={<FormattedMessage id="ui-translations.meta.title" />} />
    );
  }
}
