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
import { Container, Header, Tabs, Title, Content, Footer, FooterTab, Button, Icon, Spinner } from 'native-base';

import SplashScreen from './app/scenes/SplashScreen';
import MainTabView from './app/scenes/MainTabView';
import ActualitesDetails from './app/scenes/ActualitesDetails'

var GLOBAL = require('./app/global/GlobalVariables');
var URL_LAST_SERVER_UPDATE_INFOS_PRATIQUES = 'https://salonecriture.firebaseio.com/infos_pratiques/last_update.json'
var INFO_PRATIQUE_TEXT_CONTENT_URL = 'https://salonecriture.firebaseio.com/infos_pratiques.json'
var INFO_PRATIQUE_STORAGE_KEY = '@infoPratiqueContent';
var LAST_CHECK_FOR_ONLINE_UPDATE_STORAGE_KEY = '@infoPratiqueLastCheck';
var basicTextJSONLocation = './app/json/info_pratique_texts_template.json';
var SALON_ECRITURE_WEBSITE_ADDR = 'http://www.salonecriture.org';

var lieux_images_sources_by_id = [
    require("./app/images/lieux/colombier_centre.jpg"),
    require("./app/images/lieux/college_colombier.jpg"),
    require("./app/images/lieux/echichens.jpg")
];

class SalonEcritureApp extends Component {
    state = {
        deviceIsConnected: null,
        testText: 'hey',
        lastCheckForOnlineUpdate: null,
        lastServerUpdateDate: null,
        articlesActualites: null,
        infosPratiquesStrings: {
            last_update: null,
            text1_dates: null,
            text2_horaires: null,
            lieux: [],
        },
        actualiteArticlesIsLoading: false,
    };

    componentWillUnmount() {
        //Remove network change listener
        NetInfo.isConnected.removeEventListener('change', this._handleConnectivityChange);
    }

    _handleConnectivityChange = (isConnected) => {
        console.log('_handleConnectivityChange: Device connected? -> ' + isConnected);
        this.setState({ deviceIsConnected: isConnected });
    };

    /************************  START  ************************/

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
            // that.setState({ actualiteArticlesIsLoading: false })
            console.error(error);
            return false;
        }
    }


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
                console.log('Text from local DB: ' + textContentLocalDB);

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
        console.log('------------------- AFTER INSIDE STORAGE ---------------');
        console.log(this.state.infosPratiquesStrings)
    };

    /**
     * Check if there is updated text content on the internet and fetch it to the device.
     */
    async fetchUpdateContent() {
        var that = this;
        try {
            let newLastServerUpdateDate = await that.fetchJsonURL(URL_LAST_SERVER_UPDATE_INFOS_PRATIQUES);
            console.log('last online update = ' + newLastServerUpdateDate);
            if (newLastServerUpdateDate != that.state.lastServerUpdateDate) {
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
        try {
            let response = await fetch(url);
            let responseJson = await response.json();
            console.log('URL: ' + url + '\n response: ' + responseJson)
            return responseJson;
        } catch (error) {
            console.error(error);
        }
    }


    async fetchArticlesFromWeb() {
        // Set loading to true when the fetch starts to display a Spinner
        this.setState({
            loading: true
        });
        var that = this;

        return fetch('https://salonecriture.firebaseio.com/posts.json')
            .then((response) => response.json())
            .then((responseJson) => {
                // console.log(responseJson);
                that.setState({
                    articlesActualites: responseJson,
                    loading: false,
                });
                // console.log('Next------------------');
                // console.log(this.state.articles[0].author);
                console.log('Finished fetching articles from the web: ', responseJson);
            })
            .catch((error) => {
                that.setState({
                    loading: false
                });
                console.error(error);
            })
    }



    /************************  NAVIGATION ************************/

    render() {
        return (
            <Navigator
                initialRoute={{ index: 0 }}
                renderScene={(route, navigator) => this._navigatorRenderScene(route, navigator)}
                configureScene={(route, routeStack) => {
                    if (route.index == 2) {
                        return Navigator.SceneConfigs.FadeAndroid;
                    } else {
                        return Navigator.SceneConfigs.FloatFromRight;
                    }
                }}
            />);
    }


    _navigatorRenderScene(route, navigator) {
        switch (route.index) {
            case 0:
                return <SplashScreen
                    navigator={navigator}
                    setupNetworkObservation={() => this.setupNetworkObservation()}
                    loadDataFromDisk={() => this.loadDataFromDisk()}
                    fetchUpdateContent={() => this.fetchUpdateContent()}
                    fetchArticlesFromWeb={() => this.fetchArticlesFromWeb()}
                />;
            case 1:
                return <MainTabView
                    deviceIsConnected={this.state.deviceIsConnected}
                    infosPratiquesStrings={this.state.infosPratiquesStrings}
                    articlesActualites={this.state.articlesActualites}
                    fetchArticlesFromWeb={() => this.fetchArticlesFromWeb()}
                    actualiteArticlesIsLoading={this.state.actualiteArticlesIsLoading}
                    goToActualitesDetails= {(article) => this.goToActualitesDetails(navigator, article)}
                />;
            case 2:
                return <ActualitesDetails
                    article={route.article}
                    goBackOneScene={() => this.goBackOneScene(navigator)}
                />;
            case 3:
                return <ActualitesDetails
                 />;
            default:
                console.error('Error with the navigation! Index = ' + route.index + ' is not a valid navigation index.')
        }
    }



    _onPressButton(navigator) {
        navigator.push({ index: 1 })
    }

    goBackOneScene(navigator) {
        navigator.pop();
    }
    
    goToActualitesDetails(navigator, articleToGoTo) {
        console.log('-------------------------------------------------------------- : ',articleToGoTo);
        navigator.push({ index: 2 , article: articleToGoTo});
    }

    /*return (
        <Router>
            <Scene key="root" tabs={true}>
                <Scene key="actualites" hideNavBar={true}>
                    <Scene key="actualitesList" component={Actualites} title="Actualites" hideNavBar={true} />
                    <Scene key="actualitesDetails" component={ActualitesDetails} title="Actualites" hideNavBar={true} />
                </Scene>
                <Scene key="plans" component={Plans} title="Plans" hideNavBar={true} />
                <Scene key="programmeSalon" component={ProgrammeSalon} title="ProgrammeSalon" hideNavBar={true} />
                <Scene key="informationsPratiques" component={InformationsPratiques} title="InformationsPratiques" hideNavBar={true} />
            </Scene>
        </Router>
    );*/
}

AppRegistry.registerComponent('SalonEcritureApp', () => SalonEcritureApp);
