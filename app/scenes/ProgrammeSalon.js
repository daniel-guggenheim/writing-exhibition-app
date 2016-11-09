
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';
import { Container, Header, Tabs, Title, Content, Footer, FooterTab, Button, Icon } from 'native-base';
import { Actions } from 'react-native-router-flux'
import myTheme from '../themes/myTheme';

var GLOBAL = require('../global/GlobalVariables');
var logo_icon = require("../images/logo/logo.png");

export default class ProgrammeSalon extends Component {
  render() {
    return (

      <Container theme={myTheme}>
        <Header>
          <Button transparent disabled>
            <Image resizeMode={"contain"} style={{width: 35}} source={logo_icon} />
          </Button>

          <Title>Programme du Salon</Title>

        </Header>

        <Content style={styles.content}>
          <Text style={styles.comingSoon}>Programme du salon disponible sous peu...</Text>
        </Content>

        <Footer>
          <FooterTab>
            <Button transparent onPress={Actions.actualites}>
              <Icon name='ios-cafe-outline' />
              Actualités
            </Button>

            <Button transparent disabled>
              <Icon name='ios-list-box' />
              <Text>Programme</Text>
            </Button>

            <Button transparent onPress={Actions.plans}>
              <Icon name='ios-map-outline' />
              Plan des sites
            </Button>

            <Button transparent onPress={Actions.informationsPratiques}>
              <Icon name='ios-information-circle-outline' />
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