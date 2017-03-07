/**
 * @flow
 * 
*/
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

//Remove logs when in production
if(!__DEV__) {
    console = {};
    console.log = () => {};
    console.error = () => {};
}

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
import ProgrammeDetails from './app/scenes/ProgrammeDetails'

var GLOBAL = require('./app/global/GlobalVariables');

// State names
const STATE_CONTENT_SUFFIX = 'Content';
const STATE_LAST_UPDATE_SUFFIX = 'LastUpdate';

// Last check storage key
const LAST_CHECK_FOR_UPDATE_STORAGE_KEY = '@dateOfLastCheckForOnlineUpdate';

// Time before update
const MIN_NB_MINUTE_BEFORE_CHECKING_FOR_UPDATE = 10;

class SalonEcritureApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            variableTest: null,

            deviceIsConnected: null,
            currentlyFetchingContent: false,
            dateOfLastCheckForOnlineUpdate: null,

            // These are the different states of each subcomponent
            [GLOBAL.URL_STORAGE_KEY_ADDRESS.articles_infos.statePrefix + STATE_CONTENT_SUFFIX]: null,
            [GLOBAL.URL_STORAGE_KEY_ADDRESS.articles_infos.statePrefix + STATE_LAST_UPDATE_SUFFIX]: null,

            [GLOBAL.URL_STORAGE_KEY_ADDRESS.articles_html.statePrefix + STATE_CONTENT_SUFFIX]: null,
            [GLOBAL.URL_STORAGE_KEY_ADDRESS.articles_html.statePrefix + STATE_LAST_UPDATE_SUFFIX]: null,

            [GLOBAL.URL_STORAGE_KEY_ADDRESS.infos_pratiques.statePrefix + STATE_CONTENT_SUFFIX]: null,
            [GLOBAL.URL_STORAGE_KEY_ADDRESS.infos_pratiques.statePrefix + STATE_LAST_UPDATE_SUFFIX]: null,

            [GLOBAL.URL_STORAGE_KEY_ADDRESS.programme.statePrefix + STATE_CONTENT_SUFFIX]: null,
            [GLOBAL.URL_STORAGE_KEY_ADDRESS.programme.statePrefix + STATE_LAST_UPDATE_SUFFIX]: null,
        };
        //Maybe useful, in case of "strict" js especially 
        // this._loadSingleJsonInDB = this._loadSingleJsonInDB.bind(this);
        // this.fetchBackendToUpdateAll = this.fetchBackendToUpdateAll.bind(this);
        // this._updateContent = this._updateContent.bind(this);
        // this._fetchJsonURL = this._fetchJsonURL.bind(this);
    }

    componentWillUnmount() {
        // Remove network change listener if component componentWillUnmount.
        // It is not useful to do the same if the component mount, because when it happens,
        // the splash screen will always load.
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
                    infosPratiquesContent={this.state[GLOBAL.URL_STORAGE_KEY_ADDRESS.infos_pratiques.statePrefix + STATE_CONTENT_SUFFIX]}
                    articlesInfosContent={this.state[GLOBAL.URL_STORAGE_KEY_ADDRESS.articles_infos.statePrefix + STATE_CONTENT_SUFFIX]}
                    articlesHtmlContent={this.state[GLOBAL.URL_STORAGE_KEY_ADDRESS.articles_html.statePrefix + STATE_CONTENT_SUFFIX]}
                    programmeContent={this.state[GLOBAL.URL_STORAGE_KEY_ADDRESS.programme.statePrefix + STATE_CONTENT_SUFFIX]}
                    fetchBackendToUpdateAll={() => this.fetchBackendToUpdateAll()}
                    currentlyFetchingContent={this.state.currentlyFetchingContent}
                    goToActualitesDetails={(to_article_info, to_article_html) => this.goToActualitesDetails(navigator, to_article_info, to_article_html)}
                    goToProgrammeDetails={(programmeElement) => this.goToProgrammeDetails(navigator, programmeElement)}
                />;
            case GLOBAL.ROUTES.ActualitesDetails:
                return <ActualitesDetails
                    article_infos={route.article_infos}
                    article_html={route.article_html}
                    goBackOneScene={() => this.goBackOneScene(navigator)}
                />;
            case GLOBAL.ROUTES.ProgrammeDetails:
                return <ProgrammeDetails
                    programmeElement={route.programmeElement}
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

    goToProgrammeDetails(navigator, programmeElement) {
        console.log('Goto programme detail : ' + programmeElement.title);
        navigator.push({ index: GLOBAL.ROUTES.ProgrammeDetails, programmeElement: programmeElement });
    }


    /**************************  NETWORK  **************************/

    /**
     * Detect if device is connected to internet, and setup a listener that will detect any change.
     */
    async setupNetworkObservation() {
        NetInfo.isConnected.addEventListener('change', this._handleConnectivityChange);
        try {
            let isConnected = await NetInfo.isConnected.fetch();
            console.log('Network initialization: ' + isConnected);
            this.setState({ deviceIsConnected: isConnected });
            return true;
        } catch (error) {
            console.log('Problem while checking for network.')
            return false;
        }
    }

    _handleConnectivityChange = (isConnected) => {
        console.log('_handleConnectivityChange: Device connected? -> ' + isConnected);
        this.setState({ deviceIsConnected: isConnected });
        if (isConnected) {
            console.log('Network here: will try to update if needed.');
            this.updateFromBackendIfNecessary(); //TODO: check if it works without await...
        }
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

        //It will execute if there is network, AND if the time has passed or if it was the first time.
        console.log('The difference is ' + diffInMin + '. Network connected: ' + this.state.deviceIsConnected);
        if ((lastCheck == null || diffInMin >= MIN_NB_MINUTE_BEFORE_CHECKING_FOR_UPDATE) && this.state.deviceIsConnected) {
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
            console.log('Update not needed or no connection to internet.');
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
                    let lastRegisteredUpdate = this.state[addressesHelper.statePrefix + STATE_LAST_UPDATE_SUFFIX];

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

                    return [lastServerUpdate, newContent];

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
        try {
            console.log('Fetching JSON from URL: ' + url);
            let response = await fetch(url);
            let responseJson = await response.json();
            // console.log('Fetching JSON from URL: ' + url + '\n So the response is: ' + responseJson)
            return responseJson;
        } catch (error) {
            console.log('Error while fetching json with url: ', url);
            // console.error(error);
            return undefined;
        }
    }
}


/************************  APP REGISTRY  ************************/

AppRegistry.registerComponent('SalonEcritureApp', () => SalonEcritureApp);
