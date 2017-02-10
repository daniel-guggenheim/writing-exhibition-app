/**
 * @flow
 */
import React, { Component } from 'react';
import {
    AppRegistry,
    NetInfo,
    Navigator,
    AsyncStorage,
} from 'react-native';

//Scenes
import SplashScreen from './app/scenes/SplashScreen';
import MainTabView from './app/scenes/MainTabView';
import ActualitesDetails from './app/scenes/ActualitesDetails'

var GLOBAL = require('./app/global/GlobalVariables');

//Info pratiques URL
var URL_LAST_SERVER_UPDATE_INFOS_PRATIQUES = 'https://salonecriture.firebaseio.com/infos_pratiques/last_update.json';
var INFO_PRATIQUE_TEXT_CONTENT_URL = 'https://salonecriture.firebaseio.com/infos_pratiques.json';

// Articles URL
var URL_ARTICLES_INFOS = 'https://salonecriture.firebaseio.com/posts_v1_1/articles_info.json';
var URL_ARTICLES_CONTENT = 'https://salonecriture.firebaseio.com/posts_v1_1/articles_html.json';

//Storage keys
var INFO_PRATIQUE_STORAGE_KEY = '@infoPratiqueContent';
var LAST_CHECK_FOR_ONLINE_UPDATE_STORAGE_KEY = '@infoPratiqueLastCheck';

//Basic JSON
var basicTextJSONLocation = './app/json/info_pratique_texts_template.json';

//Other
var SALON_ECRITURE_WEBSITE_ADDR = 'http://www.salonecriture.org';

class SalonEcritureApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            deviceIsConnected: null,
            testText: 'hey',
            lastCheckForOnlineUpdate: null,
            lastServerUpdateDate: null,
            actualitesArticlesInfos: null,
            actualitesArticlesContent: null,
            infosPratiquesStrings: null,
            actualiteArticlesIsLoading: false,
        };
    }

    componentWillUnmount() {
        //Remove network change listener
        NetInfo.isConnected.removeEventListener('change', this._handleConnectivityChange);
    }


    /************************  NAVIGATION ************************/

    render() {
        return (
            <Navigator
                initialRoute={{ index: 0 }}
                renderScene={(route, navigator) => this._navigatorRenderScene(route, navigator)}
                configureScene={(route, routeStack) => { return Navigator.SceneConfigs.FadeAndroid; }}
            />);
    }

    _navigatorRenderScene(route, navigator) {
        switch (route.index) {
            case GLOBAL.ROUTES.SplashScreen:
                return <SplashScreen
                    navigator={navigator}
                    setupNetworkObservation={() => this.setupNetworkObservation()}
                    loadDataFromDisk={() => this.loadDataFromDisk()}
                    fetchUpdateContent={() => this.fetchUpdateContent()}
                    fetchArticlesFromWeb={() => this.fetchArticlesFromWeb()}
                />;
            case GLOBAL.ROUTES.MainTabView:
                return <MainTabView
                    deviceIsConnected={this.state.deviceIsConnected}
                    infosPratiquesStrings={this.state.infosPratiquesStrings}
                    actualitesArticlesInfos={this.state.actualitesArticlesInfos}
                    actualitesArticlesContent={this.state.actualitesArticlesContent}
                    fetchArticlesFromWeb={() => this.fetchArticlesFromWeb()}
                    actualiteArticlesIsLoading={this.state.actualiteArticlesIsLoading}
                    goToActualitesDetails={(to_article_info, to_article_html) => this.goToActualitesDetails(navigator, to_article_info, to_article_html)}
                />;
            case GLOBAL.ROUTES.ActualitesDetails:
                return <ActualitesDetails
                    article_infos={route.article_infos}
                    article_html={route.article_html}
                    goBackOneScene={() => this.goBackOneScene(navigator)}
                />;
            default:
                console.error('Error with the navigation! Index = ' + route.index + ' is not a valid navigation index.')
        }
    }

    goBackOneScene(navigator) {
        navigator.pop();
    }

    goToActualitesDetails(navigator, to_article_info, to_article_html) {
        console.log('Goto actualite detail : '+ to_article_info.id);
        navigator.push({ index: 2, article_infos: to_article_info, article_html: to_article_html });
    }



    /**************************  NETWORK  **************************/

    /**
     * Detect if device is connected to internet, and setup a listener that will detect any change.
     */
    async setupNetworkObservation() {
        NetInfo.isConnected.addEventListener('change', this._handleConnectivityChange);
        try {
            let isConnected = await NetInfo.isConnected.fetch();
            this.setState({ deviceIsConnected: isConnected });
            return true;
        } catch (error) {
            console.log('Problem while checking for network.')
            // that.setState({ actualiteArticlesIsLoading: false })
            // console.error(error);
            return false;
        }
    }

    _handleConnectivityChange = (isConnected) => {
        console.log('_handleConnectivityChange: Device connected? -> ' + isConnected);
        this.setState({ deviceIsConnected: isConnected });
    };



    /************************  LOAD FROM DISK  ************************/

    /**
     * Load information pratique from disk
     * TODO: Load from json if failed to load from disk
     */
    async loadDataFromDisk() {
        console.log('Entering initial loading...');
        try {
            let textContentLocalDB = await AsyncStorage.getItem(INFO_PRATIQUE_STORAGE_KEY);
            if (textContentLocalDB !== null) {
                let lastCheckLocalDB = await AsyncStorage.getItem(LAST_CHECK_FOR_ONLINE_UPDATE_STORAGE_KEY);
                console.log('Done getting infos from disk...');
                console.log('Last check from local DB: ' + lastCheckLocalDB);
                // console.log('Text from local DB: ' + textContentLocalDB);

                let parsedTextContentLocalDB = JSON.parse(textContentLocalDB);
                let parsedlastCheckLocalDB = JSON.parse(lastCheckLocalDB);
                this.setState({
                    infosPratiquesStrings: parsedTextContentLocalDB,
                    lastCheckForOnlineUpdate: parsedlastCheckLocalDB,
                    lastServerUpdateDate: parsedTextContentLocalDB.last_update
                });
                // this.forceUpdate();
            } else {
                console.log('Nothing on disk... Initializing basic template...');
                // TODO: Initialize basic text content json
                // let basicTextContentJSON = require(basicTextJSONLocation);
                // this.setState({infosPratiquesStrings: basicTextContentJSON});
            }
        } catch (error) {
            console.log('AsyncStorage error: ' + error);
        }
        // console.log('------------------- AFTER INSIDE STORAGE ---------------');
        // console.log(this.state.infosPratiquesStrings)
    };




    /************************  FETCH FROM WEB  ************************/

    /**
     * Check if there is updated text content on the internet and fetch it to the device.
     * Gerer les cas hors connexion!!!
     */
    async fetchUpdateContent() {
        var that = this;
        let newLastServerUpdateDate = undefined;
        try {
            newLastServerUpdateDate = await that.fetchJsonURL(URL_LAST_SERVER_UPDATE_INFOS_PRATIQUES);
        } catch (error) {
            console.log('Error while fetching date.')
            that.setState({ actualiteArticlesIsLoading: false })
            console.error(error);
        }
        console.log('last online update = ' + newLastServerUpdateDate);
        try {
            if (newLastServerUpdateDate != undefined && newLastServerUpdateDate != that.state.lastServerUpdateDate) {
                that.setState({ actualiteArticlesIsLoading: true })
                let newContent = await that.fetchJsonURL(INFO_PRATIQUE_TEXT_CONTENT_URL);
                let now = Date.now();

                //Store data in local db
                await AsyncStorage.multiSet([
                    [INFO_PRATIQUE_STORAGE_KEY, JSON.stringify(newContent)],
                    [LAST_CHECK_FOR_ONLINE_UPDATE_STORAGE_KEY, JSON.stringify(now)]]);

                //Update date and data
                that.setState({
                    lastServerUpdateDate: newLastServerUpdateDate,
                    lastCheckForOnlineUpdate: now,
                    infosPratiquesStrings: newContent,
                    actualiteArticlesIsLoading: false,
                });
            }
        } catch (error) {
            console.log('Error while fetching updated content.')
            that.setState({ actualiteArticlesIsLoading: false })
            console.error(error);
        }
    }

    /**
     * Helper function. Fetch a url and parse it to json.
     * @param {String} url : The url where to fetch the data
     * @return {JSON} map between text keys and text content {strings}
     */
    async fetchJsonURL(url) {
        this.setState({ actualiteArticlesIsLoading: true });
        try {
            let response = await fetch(url);
            let responseJson = await response.json();
            console.log('Fetching JSON from URL: ' + url + '\n So the response is: ' + responseJson)
            this.setState({ actualiteArticlesIsLoading: false });
            return responseJson;
        } catch (error) {
            console.log('Error while fetching json with url: ', url);
            console.error(error);
            this.setState({ actualiteArticlesIsLoading: false });
            return undefined;
        }
    }


    /**
     * Fetch all articles from the web. Change the state with the fetched Json.
     */
    async fetchArticlesFromWeb() {
        let actualitesArticlesInfos = await this.fetchJsonURL(URL_ARTICLES_INFOS);
        let actualitesArticlesContent = await this.fetchJsonURL(URL_ARTICLES_CONTENT);
        if (actualitesArticlesInfos != undefined) {
            this.setState({
                actualitesArticlesInfos: actualitesArticlesInfos,
                actualitesArticlesContent: actualitesArticlesContent,
            });
        }
        console.log('Finished fetching articles from the web. ');
    }
}


/************************  APP REGISTRY  ************************/

AppRegistry.registerComponent('SalonEcritureApp', () => SalonEcritureApp);
