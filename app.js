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

// States name
const STATE_CONTENT_SUFFIX = 'Content';
const STATE_LAST_UPDATE_SUFFIX = 'LastUpdate';

// Last check storage key
const MIN_NB_MINUTE_BEFORE_CHECKING_FOR_UPDATE = 0;
const LAST_CHECK_FOR_UPDATE_STORAGE_KEY = '@dateOfLastCheckForOnlineUpdate';

//Other
var SALON_ECRITURE_WEBSITE_ADDR = 'http://www.salonecriture.org';

class SalonEcritureApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            testText: 'hey',
            lastCheckForOnlineUpdate: null,
            lastServerUpdateDate: null,
            actualitesArticlesInfos: null,
            actualitesArticlesContent: null,
            infosPratiquesStrings: null,
            actualiteArticlesIsLoading: false,


            // New states
            deviceIsConnected: null,
            currentlyFetchingContent: false,
            dateOfLastCheckForOnlineUpdate: null,

            [GLOBAL.URL_STORAGE_KEY_ADDRESS.articles_infos.statePrefix + STATE_CONTENT_SUFFIX]: null,
            [GLOBAL.URL_STORAGE_KEY_ADDRESS.articles_infos.statePrefix + STATE_LAST_UPDATE_SUFFIX]: null,

            [GLOBAL.URL_STORAGE_KEY_ADDRESS.articles_html.statePrefix + STATE_CONTENT_SUFFIX]: null,
            [GLOBAL.URL_STORAGE_KEY_ADDRESS.articles_html.statePrefix + STATE_LAST_UPDATE_SUFFIX]: null,

            [GLOBAL.URL_STORAGE_KEY_ADDRESS.infos_pratiques.statePrefix + STATE_CONTENT_SUFFIX]: null,
            [GLOBAL.URL_STORAGE_KEY_ADDRESS.infos_pratiques.statePrefix + STATE_LAST_UPDATE_SUFFIX]: null,

            [GLOBAL.URL_STORAGE_KEY_ADDRESS.programme.statePrefix + STATE_CONTENT_SUFFIX]: null,
            [GLOBAL.URL_STORAGE_KEY_ADDRESS.programme.statePrefix + STATE_LAST_UPDATE_SUFFIX]: null,
        };
    }

    //TODO: the same for component didmount?? (enfin le contraire)
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
                    loadDataFromDB={() => this.loadDataFromDB()}
                    updateFromBackendIfNecessary={() => this.updateFromBackendIfNecessary()}
                />;
            case GLOBAL.ROUTES.MainTabView:
                return <MainTabView
                    deviceIsConnected={this.state.deviceIsConnected}
                    infosPratiquesStrings={this.state[GLOBAL.URL_STORAGE_KEY_ADDRESS.infos_pratiques.statePrefix + STATE_CONTENT_SUFFIX]}
                    actualitesArticlesInfos={this.state[GLOBAL.URL_STORAGE_KEY_ADDRESS.articles_infos.statePrefix + STATE_CONTENT_SUFFIX]}
                    actualitesArticlesContent={this.state[GLOBAL.URL_STORAGE_KEY_ADDRESS.articles_html.statePrefix + STATE_CONTENT_SUFFIX]}
                    programmeContent={this.state[GLOBAL.URL_STORAGE_KEY_ADDRESS.programme.statePrefix + STATE_CONTENT_SUFFIX]}
                    fetchBackendToUpdateAll={() => this.fetchBackendToUpdateAll()}
                    actualiteArticlesIsLoading={this.state.currentlyFetchingContent}
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
        console.log('Goto actualite detail : ' + to_article_info.id);
        navigator.push({ index: GLOBAL.ROUTES.ActualitesDetails, article_infos: to_article_info, article_html: to_article_html });
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
     * Load all the data that was stored on the db in the state.
     */
    async loadDataFromDB() {
        console.log('Starting to load all data from DB.');

        //Iterating over all storage keys to load content and last update date in state.
        for (const category of Object.keys(GLOBAL.URL_STORAGE_KEY_ADDRESS)) {
            let addressesHelper = GLOBAL.URL_STORAGE_KEY_ADDRESS[category];
            console.log('Reading db at addresses: ' + addressesHelper.storageKeyContent +
                ' and ' + addressesHelper.storageKeyLastRegisteredUpdate);

            let content = await this._loadSingleJsonInDB(addressesHelper.storageKeyContent);
            let lastUpdate = await this._loadSingleJsonInDB(addressesHelper.storageKeyLastRegisteredUpdate);

            this.setState({
                [addressesHelper.statePrefix + STATE_LAST_UPDATE_SUFFIX]: lastUpdate,
                [addressesHelper.statePrefix + STATE_CONTENT_SUFFIX]: content,
            });
        }

        //Loading date of last check for online updates
        this.setState({
            dateOfLastCheckForOnlineUpdate: await this._loadSingleJsonInDB(LAST_CHECK_FOR_UPDATE_STORAGE_KEY),
        });
        console.log('Finished loading data to state.');
    }



    /**
     * Read in database to get a single element and returns it.
     * Returns null if there is any problem or no element at all.
     * @param {String} storageKey : The address where to get the data.
     * @return {any} : returns the data it has read in the db. If there is any problem
     * or if there was no data initialized at this key, return {null} .
     */
    async _loadSingleJsonInDB(storageKey) {

        //Trying to get data from db
        let jsonData = null;
        try {
            jsonData = await AsyncStorage.getItem(storageKey);
        } catch (error) {
            console.log('Error while reading db address: ' + storageKey + '. It leads to error: ' + error);
            console.error(error);
            return null;
        }

        // It means probably that the db has not been initialized yet.
        if (jsonData == null) {
            return null;
        }

        //Trying to parse data to json
        let data = null;
        try {
            data = JSON.parse(jsonData);
        } catch (error) {
            console.log('Error while parsing json data during database reading.It leads to error: ' + error);
            console.error(error);
            return null;
        }

        //Return the parsed data
        return data;
    }




    /************************  FETCH FROM WEB  ************************/

    /**
     * Fetch all data to look for update, if the last search for update was less than a specific time ago.
     * @return {boolean} : true if an update was performed, no if no update was performed.
     */
    async updateFromBackendIfNecessary() {
        console.log('Starting to update from backend if necessary.');

        let lastCheck = this.state.dateOfLastCheckForOnlineUpdate;
        let now = Date.now();

        let diffInMin = MIN_NB_MINUTE_BEFORE_CHECKING_FOR_UPDATE + 1;
        if (lastCheck != null) {
            diffInMin = Math.abs(now - lastCheck) / 1000 / 60;
        }
        if (lastCheck == null || diffInMin >= MIN_NB_MINUTE_BEFORE_CHECKING_FOR_UPDATE) {
            console.log('Update needed.');
            try {
                await this.fetchBackendToUpdateAll();
            } catch (error) {
                console.log('Error during a needed update. The update should be tried again, ' +
                    'so the "timer" will be set to null.');
                now = null;
            }
            try {
                await AsyncStorage.setItem(LAST_CHECK_FOR_UPDATE_STORAGE_KEY, JSON.stringify(now));
            } catch (error) {
                console.log('Error while trying to store last check for update.');
            }
            this.setState({ dateOfLastCheckForOnlineUpdate: now });
            return true;
        } else {
            console.log('Update not needed.');
            return false;
        }
    }


    /**
     * Check with the server if there is any need to update the local content.
     * If it is the case, download the component that needs an update and replace it in the 
     * current state and in the database.
     * @return {boolean} : true if an update was done on any local component, false otherwise.
    */
    async fetchBackendToUpdateAll() {
        console.log('Starting to look online for updates...');
        let updateWasDone = false;

        // "lastServerUpdateArr"" will contain an array of pairs:
        // [['categoryName1', lastUpdateDate], ['categoryName2', lastUpdateDate], ...]
        lastServerUpdateArr = await this._fetchJsonURL(GLOBAL.URL_LAST_SERVER_UPDATES);

        if (lastServerUpdateArr != undefined) {
            this.setState({ currentlyFetchingContent: true });
            for (i = 0; i < lastServerUpdateArr.length; i++) {
                //Understandable variables names
                let categoryStr = lastServerUpdateArr[i][0];
                let fetchedLastUpdate = lastServerUpdateArr[i][1];

                console.log('Last update of "' + categoryStr + '" : ' + fetchedLastUpdate);

                // Get the all the urls and key storage, if the server name exists
                let addressesHelper = GLOBAL.URL_STORAGE_KEY_ADDRESS[categoryStr];
                if (addressesHelper == undefined) {
                    console.log('Trying to update with nonexistent variable: ', lastServerUpdateArr[i][0]);
                } else {
                    //Getting last update state
                    lastRegisteredUpdate = this.state[addressesHelper.statePrefix + STATE_LAST_UPDATE_SUFFIX];

                    //Getting update on content if needed
                    let pairDateContent = await this._updateContent(fetchedLastUpdate, lastRegisteredUpdate, addressesHelper.url,
                        addressesHelper.storageKeyContent, addressesHelper.storageKeyLastRegisteredUpdate);

                    //Updating states if there was an update
                    if (pairDateContent != undefined) {
                        updateWasDone = true;
                        this.setState({
                            [addressesHelper.statePrefix + STATE_LAST_UPDATE_SUFFIX]: pairDateContent[0],
                            [addressesHelper.statePrefix + STATE_CONTENT_SUFFIX]: pairDateContent[1],
                        });
                    }
                }
            }
            this.setState({ currentlyFetchingContent: false });
            console.log('Fetching from backend is finished.')
            return updateWasDone;
        } else {
            return false;
        }
    }



    /**
     * Check if the local and online last server update date are different. If it is the case, 
     * fetch the new last server update date and the new content to the device and store them in the database.
     * @param {String} lastServerUpdate : a "date" of the current last update version of the server.
     * @param {String} lastRegisteredServerUpdate : a "date" of the last update version of the server that was
     * locally registered.
     * @param {String} urlContent : The url where to fetch the updated content if needed
     * @param {String} storageKeyContent : The db storage key where to save the content to fetch
     * @param {String} storageKeyLastRegisteredServerUpdate : The db storage key where to save the 
     * new server update if there was a new one.
     * @return {Pair} : returns [lastRegisteredServerUpdate, newContent] if an update was needed and
     * returns {undefined} if no update was needed or if an exception was thrown during it.
     */
    async _updateContent(lastServerUpdate, lastRegisteredServerUpdate,
        urlContent, storageKeyContent, storageKeyLastRegisteredServerUpdate) {
        // If the content must be updated
        if (lastServerUpdate != lastRegisteredServerUpdate) {
            console.log(lastServerUpdate + ' != ' + lastRegisteredServerUpdate +
                '. Update needed. Starting to look at url: ' + urlContent);

            // Fetch new content
            newContent = await this._fetchJsonURL(urlContent);

            if (newContent != undefined) {
                try {
                    //Store new content and new update date in local db
                    console.log('Storing on: ' + storageKeyContent + ' and ' + storageKeyLastRegisteredServerUpdate);

                    await AsyncStorage.multiSet([
                        [storageKeyContent, JSON.stringify(newContent)],
                        [storageKeyLastRegisteredServerUpdate, JSON.stringify(lastServerUpdate)]]);

                    return [lastRegisteredServerUpdate, newContent];

                } catch (error) {
                    console.log('Error while trying to store in database at address: '
                        + storageKeyContent + ' or ' + storageKeyLastRegisteredServerUpdate);
                    console.error(error); // TODO: remove error
                }
            }
        }
        // If no updates or any problem during fetch / db update, withdraw to previous state
        return undefined;
    }


    /**
     * Helper function. Fetch a url and parse it to json.
     * @param {String} url : The url where to fetch the data
     * @return {JSON} map between text keys and text content {strings}
     */
    async _fetchJsonURL(url) {
        this.setState({ actualiteArticlesIsLoading: true });
        try {
            console.log('Fetching JSON from URL: ' + url);
            let response = await fetch(url);
            let responseJson = await response.json();
            // console.log('Fetching JSON from URL: ' + url + '\n So the response is: ' + responseJson)
            this.setState({ actualiteArticlesIsLoading: false });
            return responseJson;
        } catch (error) {
            console.log('Error while fetching json with url: ', url);
            // console.error(error);
            this.setState({ actualiteArticlesIsLoading: false });
            return undefined;
        }
    }




    /************************  OLD METHODS (fetch from web and load from db)  ************************/



    // Last update URL
    // var URL_LAST_SERVER_UPDATES = "https://salonecriture.firebaseio.com/se_v001/last_updates.json";

    //Info pratiques URL
    // var URL_LAST_SERVER_UPDATE_INFOS_PRATIQUES = 'https://salonecriture.firebaseio.com/infos_pratiques/last_update.json';
    // var INFO_PRATIQUE_TEXT_CONTENT_URL = 'https://salonecriture.firebaseio.com/infos_pratiques.json';

    // Articles URL
    // var URL_ARTICLES_INFOS = 'https://salonecriture.firebaseio.com/posts_v1_1/articles_info.json';
    // var URL_ARTICLES_CONTENT = 'https://salonecriture.firebaseio.com/posts_v1_1/articles_html.json';

    //Storage keys
    // var INFO_PRATIQUE_STORAGE_KEY = '@infoPratiqueContent';
    // var LAST_CHECK_FOR_ONLINE_UPDATE_STORAGE_KEY = '@infoPratiqueLastCheck';

    //Basic JSON - TODO: USE IT OR REMOVE IT..!
    // var basicTextJSONLocation = './app/json/info_pratique_texts_template.json';



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




    /**
     * Check if there is updated text content on the internet and fetch it to the device.
     * Gerer les cas hors connexion!!!
     */
    async fetchUpdateContent() {
        var that = this;
        let newLastServerUpdateDate = undefined;
        try {
            newLastServerUpdateDate = await that._fetchJsonURL(URL_LAST_SERVER_UPDATE_INFOS_PRATIQUES);
        } catch (error) {
            console.log('Error while fetching date.')
            console.error(error);
        }
        console.log('last online update = ' + newLastServerUpdateDate);
        try {
            if (newLastServerUpdateDate != undefined && newLastServerUpdateDate != that.state.lastServerUpdateDate) {
                that.setState({ currentlyFetchingContent: true });
                let newContent = await that._fetchJsonURL(INFO_PRATIQUE_TEXT_CONTENT_URL);
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
            that.setState({ currentlyFetchingContent: false })
            console.error(error);
        }
    }



    /**
     * Fetch all articles from the web. Change the state with the fetched Json.
     */
    async fetchArticlesFromWeb() {
        let actualitesArticlesInfos = await this._fetchJsonURL(URL_ARTICLES_INFOS);
        let actualitesArticlesContent = await this._fetchJsonURL(URL_ARTICLES_CONTENT);
        console.log('TESTING FETCH ALL UPDATE! :)');
        // let testAllUpdt = await this.fetchAllToUpdateIfNeeded();
        // console.log('lol')
        // if (testAllUpdt) {
        //     console.log('test?');
        // }
        if (actualitesArticlesInfos != undefined && actualitesArticlesContent != undefined) {
            this.setState({
                actualitesArticlesInfos: actualitesArticlesInfos,
                actualitesArticlesContent: actualitesArticlesContent,
            });
        }
        console.log('Array tests:');
        aa = [['aa', 1], ['bb', 2], ['cc', 3]];
        for (i = 0; i < aa.length; i++) {
            console.log(aa[i][0] + ' and ' + aa[i][1]);
        }
        [aaa, bbb] = ['hey', [1, 2, 3]];
        // [aaa,bbb] = undefined;
        console.log('TESTING UNDEF');
        console.log(aaa);
        console.log(bbb[1]);
        console.log('Finished fetching articles from the web. ');
        // console.log(GLOBAL.URL_STORAGE_KEY_ADDRESS['infos_pratiques'].testURL);
        console.log('testaa: ' + GLOBAL.URL_STORAGE_KEY_ADDRESS['dwadwad']);
        var kkk = 'Text';
        console.log('TESTING dynamic state:');
        console.log(this.state['test' + kkk]);
        this.setState({ ['test' + kkk]: 'a brand new world..!' })
        console.log(this.state.testText);
        console.log('TESTING database:');
        let testNullVal = await AsyncStorage.getItem('aKeyJustToTry00');
        console.log(testNullVal);
        console.log(undefined == null);
        console.log(testNullVal == undefined);
        let qq = Date.now();
        let q2 = Date.now() + 78 * 1000 * 60;
        let ww = new Date('2017/02/13 12:00');
        let dd = Math.abs((qq - q2)) / 1000 / 60 / 60;
        console.log('d1: ' + qq + '  d2: ' + q2 + '   diff:' + dd + '   is:' + (dd > 1));
        // this.loadDataFromDB();

        // console.log(GLOBAL.URL_STORAGE_KEY_ADDRESS['dwadwad'].testURL);
    }
}


/************************  APP REGISTRY  ************************/

AppRegistry.registerComponent('SalonEcritureApp', () => SalonEcritureApp);
