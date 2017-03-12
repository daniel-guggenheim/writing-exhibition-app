/**
AppSetup contains all the different methods to load the data from from the local database and
to get updates from the the backend server. The aim of this app was to have the capability to be
used offline, while getting online updates.

GLOBAL.URL_STORAGE_KEY_ADDRESS contains all the information about each screen. It contains
the url, the storage information, but also the name of the state (variable "statePrefix").

----- The following process was used here: -----

1. First, try to load data from local DB.
     - If there is NO data, set each state to "null". Each component will (at render)
       load the default data that are stored in local json files.
     - If there exist data, each state will be set with the data from the local DB
2. Check if there is an internet connexion && an update was not done too recently (the variable
   {MIN_NB_MINUTE_BEFORE_CHECKING_FOR_UPDATE}):
    - If yes, download an array containing the last online udpate timestamps. As the online service 
      will only be updated sporadically, an optimization was to have a small array of 
      dates/timestamps (one for each service) of the latest online update time.
        Foreach "update timestamp" in the array:
          If it is more recent than the one stored in the local DB:
              > Download the whole data corresponding to this timestamp, store it in the local DB,
                update the states.
              > Take the new "update timestamp", store it in the local DB and update the state with it.
          Otherwise (if the "update timestamp" is not more recent): do nothing
    - If not, do nothing.

----- End -----
 */
'use strict';

import React, { Component } from 'react';
import { NetInfo, AsyncStorage, } from 'react-native';

import AppNavigator from './AppNavigator';

import GLOBAL from './global/GlobalVariables';

// State names
const STATE_CONTENT_SUFFIX = 'Content';
const STATE_LAST_UPDATE_SUFFIX = 'LastUpdate';

// Last check storage key
const LAST_CHECK_FOR_UPDATE_STORAGE_KEY = '@dateOfLastCheckForOnlineUpdate';

// Time to wait before checking for an update
const MIN_NB_MINUTE_BEFORE_CHECKING_FOR_UPDATE = 10;



class AppSetup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // Set to true when new content is fetched from the backend service
            currentlyFetchingContent: false,

            // Set to true when the device has an internet connection, to false otherwise.
            deviceIsConnected: null,

            // Last time it was checked online for an update
            dateOfLastCheckForOnlineUpdate: null,

            /* These are the different states of each subcomponent
            The states were designed with dynamic names, because the process to update them with
            the new online data is the same for each of them. Therefore, it allows to generalize 
            the code a lot more, and will make adding new modules easier in the future.
            */
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

    componentWillUnmount() {
        /* 
         Remove the network change listener when the app is closed.
        */
        NetInfo.isConnected.removeEventListener('change', this._handleConnectivityChange);
    }

    render() {
        return (
            <AppNavigator
                // Backend communication methods
                setupNetworkObservation={() => this.setupNetworkObservation()}
                loadAllDataFromDbToStates={() => this.loadAllDataFromDbToStates()}
                updateFromBackendIfNecessary={() => this.updateFromBackendIfNecessary()}
                fetchBackendToUpdateAll={() => this.fetchBackendToUpdateAll()}

                // Content
                articlesInfosContent={this.state[GLOBAL.URL_STORAGE_KEY_ADDRESS.articles_infos.statePrefix + STATE_CONTENT_SUFFIX]}
                articlesHtmlContent={this.state[GLOBAL.URL_STORAGE_KEY_ADDRESS.articles_html.statePrefix + STATE_CONTENT_SUFFIX]}
                infosPratiquesContent={this.state[GLOBAL.URL_STORAGE_KEY_ADDRESS.infos_pratiques.statePrefix + STATE_CONTENT_SUFFIX]}
                programmeContent={this.state[GLOBAL.URL_STORAGE_KEY_ADDRESS.programme.statePrefix + STATE_CONTENT_SUFFIX]}

                // Other
                currentlyFetchingContent={this.state.currentlyFetchingContent}
            />);
    }



    /**************************  NETWORK  **************************/

    /**
     * Detect if the device is connected to internet, and setup a listener that will detect
     * any change.
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

    /**
     * Detects connectivity changes on the device.
     * If the device is connected again, it will check if it needs update from the backend.
     */
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
     * Load in the state all the data that is stored on the database.
     */
    async loadAllDataFromDbToStates() {
        console.log('Starting to load all data from DB.');

        //Iterating over all storage keys to load content and last update date in state.
        for (const category of Object.keys(GLOBAL.URL_STORAGE_KEY_ADDRESS)) {
            let addressesHelper = GLOBAL.URL_STORAGE_KEY_ADDRESS[category];
            console.log('Reading db at addresses: ' + addressesHelper.storageKeyContent +
                ' and ' + addressesHelper.storageKeyLastRegisteredUpdate);

            let content = await this._getDataFromDB(addressesHelper.storageKeyContent);
            let lastUpdate = await this._getDataFromDB(addressesHelper.storageKeyLastRegisteredUpdate);

            this.setState({
                [addressesHelper.statePrefix + STATE_LAST_UPDATE_SUFFIX]: lastUpdate,
                [addressesHelper.statePrefix + STATE_CONTENT_SUFFIX]: content,
            });
        }

        //Loading date of last check for online updates
        this.setState({
            dateOfLastCheckForOnlineUpdate: await this._getDataFromDB(LAST_CHECK_FOR_UPDATE_STORAGE_KEY),
        });
        console.log('Finished loading data to state.');
    }


    /**
     * Read in the database to get a single element and returns it.
     * Returns null if there is any problem or no element at all.
     * @param {String} storageKey : The address where to get the data.
     * @return {any} : returns the data it has read in the db. If there is any problem
     * or if there was no data initialized at this key, return {null} .
     */
    async _getDataFromDB(storageKey) {

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
            console.log('Error while parsing json data during database reading. It leads to error: ' + error);
            console.error(error);
            return null;
        }

        //Return the parsed data
        return data;
    }




    /************************  FETCH FROM WEB  ************************/

    /**
     * Decide whether to start the update process from the backend.
     * More specifically, it will depend on the time that has passed since the last update and 
     * on the network conditions.
     */
    async updateFromBackendIfNecessary() {
        console.log('Starting to update from backend if necessary.');

        const lastCheck = this.state.dateOfLastCheckForOnlineUpdate;
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

            // A new update was tried, the timestamp of the update is stored in state and DB
            try {
                await AsyncStorage.setItem(LAST_CHECK_FOR_UPDATE_STORAGE_KEY, JSON.stringify(now));
            } catch (error) {
                console.log('Error while trying to store last check for update.');
            }
            this.setState({ dateOfLastCheckForOnlineUpdate: now });
        } else {
            console.log('Update not needed or no connection to internet.');
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
        const lastServerUpdateArr = await this._fetchJsonURL(GLOBAL.URL_LAST_SERVER_UPDATES);

        if (lastServerUpdateArr != null) {
            this.setState({ currentlyFetchingContent: true });
            for (let i = 0; i < lastServerUpdateArr.length; i++) {
                //Understandable variables names
                const categoryName = lastServerUpdateArr[i][0];
                const lastServerUpdate = lastServerUpdateArr[i][1];

                console.log('Last update of "' + categoryName + '" : ' + lastServerUpdate);

                // Get the all the urls and key storage, if the server name exists
                let addressesHelper = GLOBAL.URL_STORAGE_KEY_ADDRESS[categoryName];
                if (addressesHelper == undefined) {
                    console.log('Trying to update with nonexistent variable: ', categoryName);
                } else {
                    //Getting last update state
                    let lastRegisteredUpdate = this.state[addressesHelper.statePrefix + STATE_LAST_UPDATE_SUFFIX];

                    //Getting update on content if needed
                    let pairDateContent = await this._updateContent(lastServerUpdate, lastRegisteredUpdate, addressesHelper.url,
                        addressesHelper.storageKeyContent, addressesHelper.storageKeyLastRegisteredUpdate);

                    //Updating states if there was an update
                    if (pairDateContent != null) {
                        updateWasDone = true;
                        this.setState({
                            [addressesHelper.statePrefix + STATE_LAST_UPDATE_SUFFIX]: pairDateContent[0],
                            [addressesHelper.statePrefix + STATE_CONTENT_SUFFIX]: pairDateContent[1],
                        });
                    }
                }
            }
            this.setState({ currentlyFetchingContent: false });
            console.log('Fetching from backend is finished.');
        }
        return updateWasDone;
    }



    /**
     * Check if the local and online last server update date are different. If it is the case, 
     * fetch the new last server update date and the new content to the device and store them in the database.
     * @param {String} lastServerUpdate : a "date" of the current last update version of the server.
     * @param {String} lastRegisteredServerUpdate : a "date" of the last update version of the 
     * server that was locally registered.
     * @param {String} urlContent : The url where to fetch the updated content if needed
     * @param {String} storageKeyContent : The db storage key where to save the content to fetch
     * @param {String} storageKeyLastRegisteredServerUpdate : The db storage key where to save the 
     * new server update if there was a new one.
     * @return {Pair} : returns {[lastRegisteredServerUpdate, newContent]} if an update was needed and
     * returns {null} if no update was needed or if an exception was thrown during it.
     */
    async _updateContent(lastServerUpdate, lastRegisteredServerUpdate,
        urlContent, storageKeyContent, storageKeyLastRegisteredServerUpdate) {
        // If the content must be updated
        if (lastServerUpdate != lastRegisteredServerUpdate) {
            console.log(lastServerUpdate + ' != ' + lastRegisteredServerUpdate +
                '. Update needed. Starting to look at url: ' + urlContent);

            // Fetch new content
            const newContent = await this._fetchJsonURL(urlContent);

            if (newContent != null) {
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
                    console.error(error);
                }
            }
        }
        // If no updates or any problem during fetch / db update, withdraw to previous state
        return null;
    }


    /**
     * Fetch the data at a url and parse it to json.
     * @param {String} url : The url where to fetch the data
     * @return {JSON} : json of the data downloaded at the url given in parameter
     */
    async _fetchJsonURL(url) {
        try {
            console.log('Fetching JSON from URL: ' + url);
            let response = await fetch(url);
            let responseJson = await response.json();
            return responseJson;
        } catch (error) {
            console.log('Error while fetching json with url: ', url);
            return null;
        }
    }
}

export default AppSetup;
