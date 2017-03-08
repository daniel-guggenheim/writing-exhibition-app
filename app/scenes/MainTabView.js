'use strict';

import React, { Component, PropTypes } from 'react';
import ScrollableTabView, { DefaultTabBar, } from 'react-native-scrollable-tab-view';

// Local components
import Actualites from './Actualites';
import InformationsPratiques from './InformationsPratiques';
import MainTabBar from '../components/MainTabBar';
import ProgrammeSalon from './ProgrammeSalon';

var GLOBAL = require('../global/GlobalVariables');


const propTypes = {
    //Backend data
    articlesInfosContent: PropTypes.arrayOf(PropTypes.object),
    articlesHtmlContent: React.PropTypes.arrayOf(PropTypes.string),
    infosPratiquesContent: React.PropTypes.object,
    programmeContent: React.PropTypes.object,

    //Required
    fetchBackendToUpdateAll: React.PropTypes.func.isRequired,
    currentlyFetchingContent: React.PropTypes.bool.isRequired,
    goToActualitesDetails: React.PropTypes.func.isRequired,
    goToProgrammeDetails: React.PropTypes.func.isRequired,
};


/**
 * This component consists of the tab view. It renders the tab bar, and each
 * element of it: Actualites, ProgrammeSalon and InformationsPratiques.
 */
class MainTabView extends Component {
    render() {
        return (
            <ScrollableTabView
                initialPage={0}
                renderTabBar={() => <MainTabBar />}
                tabBarBackgroundColor={GLOBAL.THEME_COLOR}
                tabBarPosition='bottom'
            >

                <Actualites
                    tabLabel="Actualites"
                    articlesContent={this.props.articlesHtmlContent}
                    articlesInfo={this.props.articlesInfosContent}
                    fetchBackendToUpdateAll={this.props.fetchBackendToUpdateAll}
                    goToActualitesDetails={
                        (article_info, article_html) =>
                            this.props.goToActualitesDetails(article_info, article_html)
                    }
                    loading={this.props.currentlyFetchingContent}
                />

                <ProgrammeSalon
                    tabLabel="ProgrammeSalon"
                    goToProgrammeDetails={
                        (programmeElement) => this.props.goToProgrammeDetails(programmeElement)
                    }
                    programmeContent={this.props.programmeContent}
                />

                <InformationsPratiques
                    tabLabel="InformationsPratiques"
                    currentlyFetchingContent={this.props.currentlyFetchingContent}
                    textFieldsContent={this.props.infosPratiquesContent}
                />

            </ScrollableTabView>
        );
    }
}


MainTabView.propTypes = propTypes;

export default MainTabView;
