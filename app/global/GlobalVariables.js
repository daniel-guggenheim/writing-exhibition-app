const firebaseURL = 'https://salonecriture.firebaseio.com/se_v002/';

module.exports = {
    ACTUALITES_CATEGORY: {
        0: 'Actualités du salon',
        1: 'Le saviez-vous?',
        2: 'Des professionnels racontent...',
        3: 'Lu dans la presse',
    },
    ACTUALITES_COLOR: {
        0: '#18ED05',
        1: '#FFA200',
        2: 'blue',
        3: '#E62727',
    },
    ROUTES: {
        'SplashScreen': 0,
        'MainTabView': 1,
        'ActualitesDetails': 2,
        'ProgrammeDetails': 3,
    },
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
    URL_LAST_SERVER_UPDATES: firebaseURL + 'last_updates.json',
    GENERAL_BACKGROUND_COLOR: '#F0F3F7',
    THEME_COLOR: '#E8E0C5',
    TEXT_THEME_COLOR: '#002266',
    NORMAL_TEXT_COLOR: 'black',

    MAIN_TAB_BAR: {
        tabPictures: {
            'Actualites': 'ios-cafe',
            'ProgrammeSalon': 'ios-list-box',
            'InformationsPratiques': 'ios-information-circle',
        },
        tabNames: {
            "Actualites": "Actualités",
            "ProgrammeSalon": "Programme",
            "InformationsPratiques": "Informations",
        }
    },
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
};