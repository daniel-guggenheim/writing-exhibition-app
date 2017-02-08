
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

import {Spinner } from 'native-base';

var GLOBAL = require('../global/GlobalVariables');



export default class SplashScreen extends Component {

    componentDidMount() {
        var navigator = this.props.navigator;
        var that = this;
        this.props.setupNetworkObservation();
        // var setupNetwork = await that.props.setupNetworkObservation();
        setTimeout(() => {
            navigator.replace({
                index: 1, //<-- This is the View you go to
            });
        }, 2000);// <-- Time until it jumps to "MainView"
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: GLOBAL.THEME_COLOR, alignItems: 'center', justifyContent: 'center' }}>
                <Image style={{ width: 100, height: 100 }} source={require('../images/logo/logo@4x.png')}></Image>
                <Text style={{ fontSize: 22, marginTop: 20 }}>Salon de l'Écriture</Text>
                <Spinner color={GLOBAL.GENERAL_BACKGROUND_COLOR} />
            </View>
        );
    }
}
