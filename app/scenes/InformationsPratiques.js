
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  NetInfo
} from 'react-native';
import { Container, Header, Tabs, Title, Content, Footer, FooterTab, Button, Icon } from 'native-base';
import { Actions } from 'react-native-router-flux'
import myTheme from '../themes/myTheme';

var GLOBAL = require('../global/GlobalVariables');



class IsConnected extends Component {
  state = {
    isConnected: null,
  };

  componentDidMount() {
    NetInfo.isConnected.addEventListener(
        'change',
        this._handleConnectivityChange
    );
    NetInfo.isConnected.fetch().done(
        (isConnected) => { this.setState({isConnected}); }
    );
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
        'change',
        this._handleConnectivityChange
    );
  }

  _handleConnectivityChange = (isConnected) => {
    this.setState({
      isConnected,
    });
  };

  render() {
    return (
        <View>
          <Text>{this.state.isConnected ? 'Online' : 'Offline'}</Text>
        </View>
    );
  }
}



export default class InformationsPratiques extends Component {
  render() {
    return (
      <Container theme={myTheme}>
        <Header>

          <Title>Informations Pratiques</Title>

        </Header>

        <Content style={styles.content}>
          <IsConnected />
          <Text style={styles.comingSoon}>Informations pratiques disponible sous peu...</Text>
        </Content>

        <Footer>
          <FooterTab>
            <Button transparent onPress={Actions.actualites}>
              <Icon name='ios-cafe-outline' />
              Actualités
            </Button>

            <Button transparent onPress={Actions.programmeSalon}>
              <Icon name='ios-list-box-outline' />
              <Text>Programme</Text>
            </Button>

            <Button transparent onPress={Actions.plans}>
              <Icon name='ios-map-outline' />
              Plan des sites
            </Button>

            <Button transparent disabled>
              <Icon name='ios-information-circle' />
              <Text>Informations</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>



    );
  }
}

const styles = StyleSheet.create({
   content: {
    margin: 10,
    marginTop: 12,
  },
  comingSoon: {
    fontSize: 16,
    textAlign: 'center',
  },
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