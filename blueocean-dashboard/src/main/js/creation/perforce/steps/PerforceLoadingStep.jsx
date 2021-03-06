import React, {PropTypes} from 'react';
import {observer} from 'mobx-react';

import FlowStep from '../../flow2/FlowStep';
import {i18nTranslator} from "@jenkins-cd/blueocean-core-js";

const t = i18nTranslator('blueocean-dashboard');

@observer
export default class PerforceLoadingStep extends React.Component {
    render() {
        return <FlowStep {...this.props} title={t('common.pager.loading')} loading scrollOnActive={false}/>;
    }
}

PerforceLoadingStep.propTypes = {
    flowManager: PropTypes.object,
};
