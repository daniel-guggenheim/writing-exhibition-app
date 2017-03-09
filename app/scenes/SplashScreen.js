'use strict';

import React, { Component, PropTypes } from 'react';
import { Image, Navigator, StyleSheet, Text, View, } from 'react-native';
import { Spinner } from 'native-base';


import GLOBAL from '../global/GlobalVariables';

const loadingImage = require('../images/logo/logo@4x.png');

const propTypes = {
    loadDataFromDB: PropTypes.func.isRequired,
    setupNetworkObservation: PropTypes.func.isRequired,
    updateFromBackendIfNecessary: PropTypes.func.isRequired,
    navigator: PropTypes.object.isRequired,
};


/**
 * Splash screen that appears at the start of the app, during network verification and data load.
 * Will call methods to initizalize the app before going to main app screen.
 */
class SplashScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadingText: "",
        }
    }

    componentDidMount() {
        this._executeStartSetup();
    }

    /**
     * Execute the setup of the app. Load data from the local database, setup the network
     * observation and update the data from the backend. Go to main view at the end.
     */
    async _executeStartSetup() {
        let that = this;
        try {
            this.setState({ loadingText: "Chargement des données." });
            await that.props.loadDataFromDB();
            this.setState({ loadingText: "Vérification de la connexion internet." });
            await that.props.setupNetworkObservation();

            /* Important note:
            Here, it was decided not to wait to the end, so the client with a slow connection
            will not wait too long.

            The problem in not awaiting this is that the client can get stuck to error state, if 
            at some point the server sends corrupted (bad) data. This will happen because the "bad"
            data will be saved in the database, and therefore the client will load it each time
            and RN will try to generate the interface with this corrupted data and crash without 
            having the possibility to update it. The only way around for the client would be to 
            uninstall and reinstall the app. To have an app that is working perfectly, some
            safeguards could be implemented in the future. Or the client would need to wait for
            the updates to be done before loading the interface.
            */
            this.setState({ loadingText: "Téléchargement des articles et des mises-à-jour..." });
            that.props.updateFromBackendIfNecessary();

            // Changing view
            that.props.navigator.replace({
                index: GLOBAL.ROUTES.MainTabView,
            });
        } catch (error) {
            console.log('Error while splash screen.')
            console.error(error);
        }
    }

    render() {
        return (
            <View style={styles.main}>
                <View style={styles.logoAndTitleView}>
                    <Image style={styles.logoImage} source={loadingImage}></Image>
                    <Text style={styles.title}>Salon de l'Écriture</Text>
                </View>
                <View style={styles.textAndSpinnerView}>
                    <Spinner color={GLOBAL.GENERAL_BACKGROUND_COLOR} />
                    <Text>{this.state.loadingText}</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: GLOBAL.THEME_COLOR,
    },
    logoAndTitleView: {
        flex: 6,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    logoImage: {
        width: 100,
        height: 100
    },
    textAndSpinnerView: {
        flex: 5,
        alignItems: 'center',
        justifyContent: 'center'

    },
    title: {
        fontSize: 22,
        marginTop: 20
    },
});


SplashScreen.propTypes = propTypes;

export default SplashScreen;