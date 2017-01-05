/**
This part is about having practical information about the salon.
The challenge was to make it work online AND offline, and to update offline information
if there is a connexion.

---
- The following "algorithm" was used here: -
First, try to load data from local DB.
  If there is data, set state with data from local DB
  If no data, set state with default data (from json file).
Check if internet connexion && update was not done already the same hour:
  If yes, download last udpate date.
    If the date is more recent that our date
      Download data.
      Put data in local DB
      Update last update date
      Update state with new data.
    If not more recent, do nothing
  If no connexion, do nothing.

 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  NetInfo,
  AsyncStorage,
  ActivityIndicator,
} from 'react-native';
import { Container, Header, Tabs, Title, Content, Footer, FooterTab, Button, Spinner, Icon, H1, H2, H3, Text } from 'native-base';
import { Actions } from 'react-native-router-flux'
import myTheme from '../themes/myTheme';

var GLOBAL = require('../global/GlobalVariables');

var LAST_ONLINE_UPDATE_URL = 'https://salonecriture.firebaseio.com/infos_pratiques/last_update.json'
var INFO_PRATIQUE_TEXT_CONTENT_URL = 'https://salonecriture.firebaseio.com/infos_pratiques.json'
var INFO_PRATIQUE_STORAGE_KEY = '@infoPratiqueContent';
var LAST_CHECK_STORAGE_KEY = '@infoPratiqueLastCheck';

var basicTextJSONLocation = '../json/info_pratique_texts_template.json';

export default class InformationsPratiques extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deviceIsConnected: null,
      last_check: null,
      last_update: null,
      loadingContentUpdate: false,
      textFieldsContent: {
        last_update: null,
        text1_dates: null,
        text2_horaires: null
      },
    };
  }


  componentWillMount() {
    this._loadInfoPratiqueFromDisk();
  }

  /**
   * Load text content from disk, or from default json file if this has failed.
   * Then, check with netinfo if device is connected to internet, add listener to detect changes.
   * If it is the case, check if there is any update on the data text.
   */
  componentDidMount() {
    //Load data from disk
    // this._loadInfoPratiqueFromDisk().done(
    //   () => {
    //Network listener
    NetInfo.isConnected.addEventListener('change', this._handleConnectivityChange);
    //Check network
    NetInfo.isConnected.fetch().done(
      (isConnected) => {
        console.log('Initial is connected: ' + isConnected);
        this.setState({ deviceIsConnected: isConnected });
        if (isConnected) {
          //Load data from internet
          this.fetchUpdateContent();
        }
      }
    );
    // });
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('change', this._handleConnectivityChange);
  }


  /**
   * Load information pratique from disk
   * TODO: Load from json if failed to load from disk
   */
  async _loadInfoPratiqueFromDisk() {
    console.log('Entering initial loading...');
    try {
      let textContentLocalDB = await AsyncStorage.getItem(INFO_PRATIQUE_STORAGE_KEY);
      if (textContentLocalDB !== null) {
        let lastCheckLocalDB = await AsyncStorage.getItem(LAST_CHECK_STORAGE_KEY);
        console.log('Done getting infos from disk...');
        console.log('Last check from local DB: ' + lastCheckLocalDB);
        console.log('Text from local DB: ' + textContentLocalDB);

        let parsedTextContentLocalDB = JSON.parse(textContentLocalDB);
        let parsedlastCheckLocalDB = JSON.parse(lastCheckLocalDB);
        this.setState({
          textFieldsContent: parsedTextContentLocalDB,
          last_check: parsedlastCheckLocalDB,
          last_update: parsedTextContentLocalDB.last_update
        });
        // this.forceUpdate();
      } else {
        console.log('Nothing on disk... Initializing basic template...');
        // TODO: Initialize basic text content json
        // let basicTextContentJSON = require(basicTextJSONLocation);
        // this.setState({textFieldsContent: basicTextContentJSON});
      }
    } catch (error) {
      console.log('AsyncStorage error: ' + error);
    }
  };


  /**
   * Check if there is updated text content on the internet and fetch it to the device.
   */
  async fetchUpdateContent() {
    var that = this;
    try {
      let lastOnlineUpdate = await that.fetchJsonURL(LAST_ONLINE_UPDATE_URL);
      console.log('last online update = ' + lastOnlineUpdate);
      if (lastOnlineUpdate != that.state.last_update) {
        that.setState({ loadingContentUpdate: true })
        let newContent = await that.fetchJsonURL(INFO_PRATIQUE_TEXT_CONTENT_URL);
        let lastCheck = Date.now();

        //Store data in local db
        await AsyncStorage.multiSet([
          [INFO_PRATIQUE_STORAGE_KEY, JSON.stringify(newContent)],
          [LAST_CHECK_STORAGE_KEY, JSON.stringify(lastCheck)]]);

        //Update date and data
        that.setState({
          last_update: lastOnlineUpdate,
          last_check: lastCheck,
          textFieldsContent: newContent,
          loadingContentUpdate: false,
        });
      }
    } catch (error) {
      that.setState({ loadingContentUpdate: false })
      console.error(error);
    }
  }

  /**
   * Helper function. Fetch a url and parse it to json.
   * @param {String} url : The url where to fetch the data
   * @return {JSON} map between text keys and text content {strings}
   */
  async fetchJsonURL(url) {
    try {
      let response = await fetch(url);
      let responseJson = await response.json();
      console.log('URL: ' + url + '\n response: ' + responseJson)
      return responseJson;
    } catch (error) {
      console.error(error);
    }
  }


  /**
   * Network listener to detect change in connectivity
   */
  _handleConnectivityChange = (isConnected) => {
    console.log('Is connected: ' + isConnected);
    this.setState({
      deviceIsConnected: isConnected,
    });
    //TODO: Add if it has been less than a period of time
    if (isConnected) {
      this.fetchUpdateContent();
    }
  };


  /** ---------------------------- RENDER FUNCTION ---------------------------- */

  render() {
    return (
      <Container theme={myTheme}>
        <Header>
          <Title>Informations Pratiques</Title>
        </Header>

        <Content style={styles.content}>
          {/*Offline component*/}
          {!this.state.deviceIsConnected && this.state.deviceIsConnected != null ?
            <View>
              <Text style={styles.offlineText}>Hors ligne</Text>
            </View>
            : null
          }
          {this.state.loadingContentUpdate ?
            <View style={styles.loadingContent}>
              <Text>Mise-à-jour</Text>
              <ActivityIndicator style={styles.spinner} />
            </View>
            : null
          }



          <View style={styles.mainContentView}>
            <View style={styles.infoIndivView}>
              <InlineTitle>Horaires:</InlineTitle>
              <Text style={styles.horairesDate}>{this.state.textFieldsContent.text2_horaires}</Text>
            </View>

            <View style={styles.infoIndivView}>
              <InlineTitle>Lieux:</InlineTitle>
              <Text>Autre</Text>
            </View>

            <View style={styles.infoIndivView}>
            </View>
          </View>
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


const B = (props) => <Text style={{ fontWeight: 'bold' }}>{props.children}</Text>
const InlineTitle = (props) => <Text style={styles.sectionTitre}>{props.children}</Text>


const styles = StyleSheet.create({
  content: {
    margin: 8,
    marginTop: 2,
  },
  mainContentView: {
    marginTop: 10,
  },
  infoIndivView: {
    marginTop: 5,
  },

  sectionTitre: {
    fontWeight: 'bold',
    fontSize: 24,
    textAlign:'center',
    paddingBottom: 8,
    marginLeft:32,
    marginRight:32,
    marginBottom:8,
    borderBottomWidth:1,
  },

  horairesDate: {
    fontSize: 16,
  },




  offlineText: {
    textAlign: 'center',
    color: 'red',
    fontStyle: 'italic',
  },
  loadingContent: {
    alignItems: 'center',
    marginBottom: 8,
  },
  spinner: {
    marginTop: 6,
  },
});