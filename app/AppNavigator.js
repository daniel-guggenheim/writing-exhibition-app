/**
This part contains the navigator and all the different methods to load the data
from the backend server and from the local database.
The aim of this app was to have the capabilities to be used offline, while getting online
updates.
GLOBAL.URL_STORAGE_KEY_ADDRESS contains all the information about each screen. It contains
the url, the storage information, but also the name of the state (variable "statePrefix")

----- The following "algorithm" was used here: -----
1. First, try to load data from local DB.
     - If there is NO data, set each state to "null". Each component will (at render) load default data
       that are stored in local json files.
     - If there exist data, each state will be set with the data from the local DB
2. Check if internet connexion && update was not done already in the same time period (MIN_NB_MINUTE_BEFORE_CHECKING_FOR_UPDATE):
    - If yes, download all the last udpates dates.
        Foreach date, if the "update date"" is more recent that the one stored in the local DB:
            > Download data, store it in local DB, update the states.
            > Get the new "update date" from online, store it in local DB and update state.
        Otherwise (if "update date" is not more recent): do nothing
    - If not, do nothing.
----- End -----
 */
'use strict';

import React, { Component, PropTypes } from 'react';
import { Navigator, } from 'react-native';

//Scenes
import SplashScreen from './scenes/SplashScreen';
import MainTabView from './scenes/MainTabView';
import NewsDetailedView from './scenes/news/NewsDetailedView'
import ProgramDetailedView from './scenes/program/ProgramDetailedView'

var GLOBAL = require('./global/GlobalVariables');


const propTypes = {
    // Backend communication methods
    setupNetworkObservation: PropTypes.func.isRequired,
    loadDataFromDB: PropTypes.func.isRequired,
    updateFromBackendIfNecessary: PropTypes.func.isRequired,
    fetchBackendToUpdateAll: PropTypes.func.isRequired,

    //Backend data
    articlesInfosContent: PropTypes.arrayOf(PropTypes.object),
    articlesHtmlContent: PropTypes.arrayOf(PropTypes.string),
    infosPratiquesContent: PropTypes.object,
    programmeContent: PropTypes.object,

    //Other
    currentlyFetchingContent: PropTypes.bool.isRequired,
};


class AppNavigator extends Component {


    render() {
        return (
            <Navigator
                initialRoute={{ index: GLOBAL.ROUTES.SplashScreen }}
                renderScene={(route, navigator) => this._navigatorRenderScene(route, navigator)}
                configureScene={(route, routeStack) => { return Navigator.SceneConfigs.FadeAndroid; }}
            />);
    }

    _navigatorRenderScene(route, navigator) {
        switch (route.index) {
            case GLOBAL.ROUTES.SplashScreen:
                return <SplashScreen
                    navigator={navigator}
                    replaceViewByMainPage = {() => this.replaceViewByMainPage(navigator)}
                    setupNetworkObservation={() => this.props.setupNetworkObservation()}
                    loadDataFromDB={() => this.props.loadDataFromDB()}
                    updateFromBackendIfNecessary={() => this.props.updateFromBackendIfNecessary()}
                />;
            case GLOBAL.ROUTES.MainTabView:
                return <MainTabView
                    infosPratiquesContent={this.props.infosPratiquesContent}
                    articlesInfosContent={this.props.articlesInfosContent}
                    articlesHtmlContent={this.props.articlesHtmlContent}
                    programmeContent={this.props.programmeContent}
                    fetchBackendToUpdateAll={() => this.props.fetchBackendToUpdateAll()}
                    currentlyFetchingContent={this.props.currentlyFetchingContent}
                    goToNewsDetailedView={(to_article_info, to_article_html) => this.goToNewsDetailedView(navigator, to_article_info, to_article_html)}
                    goToProgramDetailedView={(programmeElement) => this.goToProgramDetailedView(navigator, programmeElement)}
                />;
            case GLOBAL.ROUTES.NewsDetailedView:
                return <NewsDetailedView
                    article_infos={route.article_infos}
                    article_html={route.article_html}
                    goBackOneScene={() => this.goBackOneScene(navigator)}
                />;
            case GLOBAL.ROUTES.ProgramDetailedView:
                return <ProgramDetailedView
                    programmeElement={route.programmeElement}
                    goBackOneScene={() => this.goBackOneScene(navigator)}
                />;
            default:
                console.error('Error with the navigation! Index = ' + route.index + ' is not a valid navigation index.');
        }
    }

    goBackOneScene(navigator) {
        navigator.pop();
    }

    goToNewsDetailedView(navigator, to_article_info, to_article_html) {
        console.log('Go to actualite detail : ' + to_article_info.id);
        navigator.push({ index: GLOBAL.ROUTES.NewsDetailedView, article_infos: to_article_info, article_html: to_article_html });
    }

    goToProgramDetailedView(navigator, programmeElement) {
        console.log('Goto programme detail : ' + programmeElement.title);
        navigator.push({ index: GLOBAL.ROUTES.ProgramDetailedView, programmeElement: programmeElement });
    }

    replaceViewByMainPage(navigator) {
        navigator.replace({ index: GLOBAL.ROUTES.MainTabView });
    }
}


export default AppNavigator;
