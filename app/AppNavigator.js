'use strict';

import React, { Component, PropTypes } from 'react';
import { Navigator, } from 'react-native';

//Scenes
import SplashScreen from './scenes/SplashScreen';
import MainTabView from './scenes/MainTabView';
import NewsDetailedView from './scenes/news/NewsDetailedView';
import ProgramDetailedView from './scenes/program/ProgramDetailedView';

import GLOBAL from './global/GlobalVariables';


const propTypes = {
    // Backend communication methods
    setupNetworkObservation: PropTypes.func.isRequired,
    loadAllDataFromDbToStates: PropTypes.func.isRequired,
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


/**
 * AppNavigator controls the navigation inside the app.
 * The SplashScreen will start first and launch the setup methods of the app. It will be replaced
 * by the MainTabView which contains the all the important scenes.
 * NewsDetailedView and ProgramDetailedView contain detailed view of the news and program and are
 * called directly from their respective main scenes.
 * todo: Put Android back button methods here.
 */
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
                    replaceViewByMainPage={() => this.replaceViewByMainPage(navigator)}
                    setupNetworkObservation={() => this.props.setupNetworkObservation()}
                    loadAllDataFromDbToStates={() => this.props.loadAllDataFromDbToStates()}
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

AppNavigator.propTypes = propTypes;

export default AppNavigator;
