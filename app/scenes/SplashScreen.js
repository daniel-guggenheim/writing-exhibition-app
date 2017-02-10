
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

export default class SplashScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadingText: "",
        }
    }
    async _executeStartSetup(navigator) {
        let that = this;
        try {
            this.setState({ loadingText: "Chargement des données." })
            await that.props.loadDataFromDisk();
            this.setState({ loadingText: "Test de connexion." })
            await that.props.setupNetworkObservation();
            this.setState({ loadingText: "Obtention des mise-à-jours..." })
            await that.props.fetchUpdateContent();
            this.setState({ loadingText: "Obtention des articles..." })
            await that.props.fetchArticlesFromWeb();
            // Changing view
            navigator.replace({
                index: GLOBAL.ROUTES.MainTabView, //<-- This is the View you go to

            });
        } catch (error) {
            console.log('Error while splash screen.')
            console.error(error);
        }
    }

    componentDidMount() {
        this._executeStartSetup(this.props.navigator);
    }

    render() {
        return (
            <View style={styles.main}>
                <View></View>
                <View style={styles.logoAndTitleView}>
                    <Image style={{ width: 100, height: 100 }} source={require('../images/logo/logo@4x.png')}></Image>
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