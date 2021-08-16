import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Card,
  Col,
  Icon,
  ModalFooter,
  Row,
  TextArea,
  Tooltip,
} from '@folio/stripes-components';
import stripesFinalForm from '@folio/stripes/final-form';
import { Field } from 'react-final-form';
import { FormattedMessage, useIntl } from 'react-intl';

function EditTranslationsForm({
  pristine,
  submitting,
  handleSubmit,
  form,
  invalid,
  item,
  onClose,
}) {
  const intl = useIntl();

  const renderFooter = () => {
    return (
      <ModalFooter>
        <Button
          buttonStyle="primary"
          type="submit"
          disabled={submitting || pristine || invalid}
        >
          <Icon icon="save" size="large">
            <FormattedMessage id="stripes-core.button.save" />
          </Icon>
        </Button>
        <Button buttonStyle="slim" onClick={onClose}>
          <Icon icon="times-circle-solid" size="large">
            <FormattedMessage id="stripes-core.button.cancel" />
          </Icon>
        </Button>
      </ModalFooter>
    );
  };

  return (
    <>
      <form id="form-edit-translations" onSubmit={handleSubmit}>
        <Card
          id="edit-form-card"
          headerStart={
            <span>
              <strong>
                <FormattedMessage
                  id="ui-translations.editTranslation.modal.card.title"
                  values={{ originText: item.originText }}
                />
              </strong>
            </span>
          }
          headerEnd={
            <Tooltip
              id="undo-tooltip"
              text={
                <FormattedMessage
                  id="ui-translations.buttons.tooltip.undo"
                  defaultMessage="Undo"
                />
              }
            >
              {({ ref, ariaIds }) => (
                <Button
                  aria-labelledby={ariaIds.text}
                  ref={ref}
                  buttonStyle="slim"
                  marginBottom0
                  id={`clickable-undo-translate-single-item-${item.translationKey}`}
                  onClick={() => form.mutators.resetFieldTranslations(
                    'translatedText',
                    item.translatedText
                  )
                  }
                  disabled={pristine || submitting}
                >
                  <Icon icon="undo" />
                </Button>
              )}
            </Tooltip>
          }
        >
          <Row>
            <Col xs={12}>
              <Field
                component={TextArea}
                name="translatedText"
                placeholder={intl.formatMessage({
                  id: 'ui-translations.editTranslation.form.translatedText.placeholder',
                })}
                marginBottom0
              />
            </Col>
          </Row>
        </Card>
        {renderFooter()}
      </form>
    </>
  );
}

EditTranslationsForm.propTypes = {
  item: PropTypes.object,
  onClose: PropTypes.func,
};

export default stripesFinalForm({
  navigationCheck: true,
  subscription: {
    values: true,
  },
  mutators: {
    resetFieldTranslations: (args, state) => {
      const field = state.fields[args[0]];
      field.change(args[1]);
      state.formState.submitFailed = true;
    },
  },
  validateOnBlur: true,
})(EditTranslationsForm);
