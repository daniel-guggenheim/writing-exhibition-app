/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    NetInfo,
    Navigator,
    TouchableHighlight,
    ScrollView,
    Image,
} from 'react-native';
import { Container, Header, Tabs, Title, Content, Footer, FooterTab, Button, Icon, Spinner } from 'native-base';

import ScrollableTabView, { DefaultTabBar, } from 'react-native-scrollable-tab-view';

import MainTabBar from './app/components/MainTabBar';

import Actualites from './app/scenes/Actualites';
import ProgrammeSalon from './app/scenes/ProgrammeSalon';
import Plans from './app/scenes/Plans';
import InformationsPratiques from './app/scenes/InformationsPratiques';
import ActualitesDetails from './app/scenes/ActualitesDetails';
import SplashScreen from './app/scenes/SplashScreen';


var GLOBAL = require('./app/global/GlobalVariables');

class SalonEcritureApp extends Component {
    state = {
        deviceIsConnected: null,
        testText: 'hey'
    };

    componentDidMount() {
        //Helper to know if the device is connected to internet
        //Listener that will detect any change
        // NetInfo.isConnected.addEventListener(
        //     'change',
        //     this._handleConnectivityChange
        // );
        // NetInfo.isConnected.fetch().done(
        //     (isConnected) => {
        //         console.log('Device connected? ' + isConnected);
        //         this.setState({ deviceIsConnected: isConnected });
        //     }
        // );
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener(
            'change',
            this._handleConnectivityChange
        );
    }

    _handleConnectivityChange = (isConnected) => {
        console.log('_handleConnectivityChange: Device connected? -> ' + isConnected);
        this.setState({
            deviceIsConnected: isConnected,
        });
    };

    // deviceIsConnected() {
    //     console.log('CALL: device is connected: ' + this.state.deviceIsConnected)
    //     return this.state.deviceIsConnected;
    // }



    /************************  STARTING - NEW ************************/

    async setupNetworkObservation() {
        NetInfo.isConnected.addEventListener(
            'change',
            this._handleConnectivityChange
        );
        try {
            let isConnected = await NetInfo.isConnected.fetch();
            this.setState({ deviceIsConnected: isConnected });
            return true;
        } catch (error) {
            // that.setState({ loadingContentUpdate: false })
            console.error(error);
            return false;
        }
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
                return <SplashScreen navigator={navigator} setupNetworkObservation={() => this.setupNetworkObservation()} />;
            case 1:
                return <MainTabView deviceIsConnected={this.state.deviceIsConnected} />;
            case 2:
                return <Actualites deviceIsConnected={this.state.deviceIsConnected} goBackOneScene={() => this.goBackOneScene(navigator)} />
            case 3:
                return <CategoryManagementScreen />;
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
    goToFriendCreationScene(navigator) {
        navigator.push({ index: 2 })
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




/*class SplashScreen extends Component {

    componentWillMount() {
        var navigator = this.props.navigator;
        // await setupNetworkObservation();

        setTimeout(() => {
            navigator.replace({
                index: 1, //<-- This is the View you go to
            });
        }, 2000);// <-- Time until it jumps to "MainView"
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: GLOBAL.THEME_COLOR, alignItems: 'center', justifyContent: 'center' }}>
                <Image style={{ width: 100, height: 100 }} source={require('./app/images/logo/logo@4x.png')}></Image>
                <Text style={{ fontSize: 22, marginTop: 20 }}>Salon de l'Écriture</Text>
                <Spinner color={GLOBAL.GENERAL_BACKGROUND_COLOR} />
            </View>
        );
    }
}*/



class MainTabView extends Component {


    render() {
        return (
            /*<ScrollableTabView
                style={{ marginTop: 20, }}
                renderTabBar={() => <DefaultTabBar />}
                tabBarPosition='bottom'
            >
                <View tabLabel='Tab haha'><Text>My</Text><TouchableHighlight onPress={() => this._onPressButton(navigator)}>
                    <Text>Button</Text>
                </TouchableHighlight><Text>Baby :)</Text></View>
                <Text tabLabel='Tab #2'>favorite</Text>
                <View tabLabel='Tab #3'><TouchableHighlight onPress={() => this._onPressButton(navigator)}>
                    <Text>Button project</Text>
                </TouchableHighlight><Text>{this.props.deviceIsConnected ? <Text>Device connected</Text> : <Text>Device not connected</Text>}</Text>
                </View>
            </ScrollableTabView>*/



            <ScrollableTabView
                style={{}}
                initialPage={1}
                renderTabBar={() => <MainTabBar />}
                tabBarPosition='bottom'
                tabBarBackgroundColor={'#E8E0C5'}
                initialPage={0}
            >
                <Actualites tabLabel="ios-cafe" />
                <ProgrammeSalon tabLabel="ios-list-box-outline" />
                <InformationsPratiques tabLabel="ios-information-circle-outline" />
            </ScrollableTabView>
        );
    }
}





const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});

AppRegistry.registerComponent('SalonEcritureApp', () => SalonEcritureApp);
