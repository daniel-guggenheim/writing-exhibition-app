'use strict';

import React, { Component, PropTypes } from 'react';
import ScrollableTabView, { DefaultTabBar, } from 'react-native-scrollable-tab-view';

// Local components
import Actualites from './Actualites';
import InformationsPratiques from './InformationsPratiques';
import MainTabBar from '../components/MainTabBar';
import ProgrammeSalon from './ProgrammeSalon';

import GLOBAL from '../global/GlobalVariables';


const propTypes = {
    //Backend data
    articlesInfosContent: PropTypes.arrayOf(PropTypes.object),
    articlesHtmlContent: PropTypes.arrayOf(PropTypes.string),
    infosPratiquesContent: PropTypes.object,
    programmeContent: PropTypes.object,

    //Required
    fetchBackendToUpdateAll: PropTypes.func.isRequired,
    currentlyFetchingContent: PropTypes.bool.isRequired,
    goToActualitesDetails: PropTypes.func.isRequired,
    goToProgrammeDetails: PropTypes.func.isRequired,
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
