/**
 * All the variables that must be accessed globaly.
 */

"use strict";

// The base url of the backend service
const firebaseURL = 'https://salonecriture.firebaseio.com/se_v002/';

module.exports = {

    // The scenes of the app
    ROUTES: {
        SplashScreen: 0,
        MainTabView: 1,
        NewsDetailedView: 2,
        ProgrammeDetails: 3,
    },

    /**  The information of each "data component" loaded from the backend
        @param {String} string : the component name
        @param {String} url : the url where to fetch the component
        @param {String} storageKeyContent : the component reference in the internal database
        @param {String} storageKeyLastRegisteredUpdate : the reference in the internal database of 
        the last for the component from the backend service
        @param {String} statePrefix : The state prefix name of the component (used to have general 
        states)
    */
    URL_STORAGE_KEY_ADDRESS: {
        articles_infos: {
            string: 'articles_infos',
            url: firebaseURL + 'articles_infos.json',
            storageKeyContent: '@storage_key_content_articles_infos',
            storageKeyLastRegisteredUpdate: '@storage_key_last_update_articles_infos',
            statePrefix: 'articlesInfos',
        },
        articles_html: {
            string: 'articles_html',
            url: firebaseURL + 'articles_html.json',
            storageKeyContent: '@storage_key_content_articles_html',
            storageKeyLastRegisteredUpdate: '@storage_key_last_update_articles_html',
            statePrefix: 'articlesHtml',
        },
        infos_pratiques: {
            string: 'infos_pratiques',
            url: firebaseURL + 'infos_pratiques.json',
            storageKeyContent: '@storage_key_content_infos_pratiques',
            storageKeyLastRegisteredUpdate: '@storage_key_last_update_infos_pratiques',
            statePrefix: 'infosPratiques',
        },
        programme: {
            string: 'programme',
            url: firebaseURL + 'programme.json',
            storageKeyContent: '@storage_key_content_programme',
            storageKeyLastRegisteredUpdate: '@storage_key_last_update_programme',
            statePrefix: 'programme',
        }
    },

    // url of array containing the last updates
    URL_LAST_SERVER_UPDATES: firebaseURL + 'last_updates.json',

    // Pictures and names of the elements of the tabbar component
    MAIN_TAB_BAR: {
        tabPictures: {
            'NewsMainView': 'ios-cafe',
            'ProgrammeSalon': 'ios-list-box',
            'InfoMainScene': 'ios-information-circle',
        },
        tabNames: {
            "NewsMainView": "Actualités",
            "ProgrammeSalon": "Programme",
            "InfoMainScene": "Informations",
        }
    },

    // Main colors of the app
    GENERAL_BACKGROUND_COLOR: '#F0F3F7',
    THEME_COLOR: '#E8E0C5',
    TEXT_THEME_COLOR: '#002266',
    NORMAL_TEXT_COLOR: 'black',

    // Colors / ID depending on the place
    PLACES_COLOR: (placeStr) => {
        if (placeStr == 'Echichens') {
            return '#90C695';
        } else {
            return '#EB974E';
        }
    },
    PLACES_ID: (placeStr) => {
        if (placeStr == 'Echichens') {
            return 1;
        } else {
            return 0;
        }
    },

    // Email addresses
    SEND_EMAIL_URI_REPORT_BUG: 'mailto:app.salonecriture@gmail.com?subject=Probl%C3%A8me%20avec%20l%27application' +
    '%20%22Salon%20de%20l%27Ecriture%22&body=Description%20du%20probl%C3%A8me%20(en%20quelques%20phrases)' +
    '%20%3A%0A%0AT%C3%A9l%C3%A9phone%20utilis%C3%A9%20(par%20exemple%3A%20IPhone%205S%2C%20Samsung%20Galaxy' +
    '%20S7%2C%20etc..)%20%3A%0A%0AVersion%20d%27IOS%20ou%20d%27Android%20(si%20vous%20en%20avez%20connaissance' +
    '%2C%20par%20exemple%3A%20IOS%2010.2.1%20ou%20Android%206.0.1)%20%3A%20',
    SEND_EMAIL_URI_SALON_ECRITURE: 'mailto:info@salonecriture.org',
};