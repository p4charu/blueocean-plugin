import React, { PropTypes } from 'react';
import { observer } from 'mobx-react';
import debounce from 'lodash.debounce';

import { FormElement, TextInput } from '@jenkins-cd/design-language';
import FlowStep from '../../flow2/FlowStep';
import { i18nTranslator } from '@jenkins-cd/blueocean-core-js';
const t = i18nTranslator('blueocean-dashboard');

let STATE;

/**
 * Handling renaming when a name conflict occurs during creation.
 */
@observer
export default class PerforceRenameStep extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pipelineName: '',
            isNameValid: null,
        };
        STATE = this.props.flowManager.getState();
    }

    _onChange(name) {
        this._checkPipelineName(name);
    }

    _checkPipelineName = debounce(name => {
        this.props.flowManager.checkPipelineNameAvailable(name).then(available => this._validateName(name, available));
    }, 500);

    _validateName(pipelineName, available) {
        const isNameValid = !!pipelineName && available;
        this.setState({
            pipelineName,
            isNameValid,
        });
    }

    _onSave() {
        this.props.flowManager.saveRenamedPipeline(this.state.pipelineName);
    }

    render() {
        const { flowManager } = this.props;

        const disabled = flowManager.stateId !== STATE.STEP_RENAME;
        let headingText = '';

        if (this.state.isNameValid === null) {
            headingText = t('creation.p4.step2.name_required', { 0: this.props.pipelineName });
        } else if (this.state.isNameValid === false) {
            headingText = t('creation.p4.step2.name_unavailable', { 0: this.state.pipelineName });
        } else if (this.state.isNameValid === true) {
            headingText = t('creation.p4.step2.name_available', { 0: this.state.pipelineName });
        }

        return (
            <FlowStep {...this.props} className="git-step-rename" title={t('creation.p4.step2.title')} disabled={disabled}>
                <FormElement title={headingText}>
                    <TextInput className="text-pipeline" placeholder={t('creation.p4.step2.text_name_placeholder')} onChange={val => this._onChange(val)} />

                    <button disabled={!this.state.isNameValid} onClick={() => this._onSave()}>
                        {t('creation.p4.step2.button_save')}
                    </button>
                </FormElement>
            </FlowStep>
        );
    }
}
PerforceRenameStep.propTypes = {
    flowManager: PropTypes.string,
    pipelineName: PropTypes.string,
};
