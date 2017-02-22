
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Navigator,
    TouchableHighlight,
    ScrollView,
    Image,
} from 'react-native';

import { Spinner } from 'native-base';

var GLOBAL = require('../global/GlobalVariables');

const loadingImage = require('../images/logo/logo@4x.png');

const propTypes = {
    loadDataFromDB: React.PropTypes.func.isRequired,
    setupNetworkObservation: React.PropTypes.func.isRequired,
    updateFromBackendIfNecessary: React.PropTypes.func.isRequired,
    navigator: React.PropTypes.object.isRequired,
};


const defaultProps = {
};


class SplashScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loadingText: "",
        }
    }


    async _executeStartSetup() {
        let that = this;
        try {
            this.setState({ loadingText: "Chargement des données." });
            await that.props.loadDataFromDB();
            this.setState({ loadingText: "Test de connexion." });
            await that.props.setupNetworkObservation();
            this.setState({ loadingText: "Obtention des articles et mises-à-jour..." });
            // The problem in not awaiting this is that the client can get stuck if the server data is bad at some point.
            // (because the "bad" data will be saved to the memory, and therefore the client will load it each time and
            // crash without having the possibility to update it.) The only way around would be to uninstall and reinstall the app.
            that.props.updateFromBackendIfNecessary();
            // Changing view
            that.props.navigator.replace({
                index: GLOBAL.ROUTES.MainTabView, //<-- This is the View you go to
            });
        } catch (error) {
            console.log('Error while splash screen.')
            console.error(error);
        }
    }

    componentDidMount() {
        this._executeStartSetup();
    }

    render() {
        return (
            <View style={styles.main}>
                <View></View>
                <View style={styles.logoAndTitleView}>
                    <Image style={{ width: 100, height: 100 }} source={loadingImage}></Image>
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
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    logoAndTitleView: {
        flex: 6,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    textAndSpinnerView: {
        alignItems: 'center',
        flex: 5,
        justifyContent: 'center'

    },
    title: {
        fontSize: 22,
        marginTop: 20
    },

});


SplashScreen.propTypes = propTypes;
SplashScreen.defaultProps = defaultProps;

export default SplashScreen;