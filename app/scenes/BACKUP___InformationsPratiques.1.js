import React, { Component, PropTypes } from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
  NetInfo,
  AsyncStorage,
  ActivityIndicator,
  Linking,
  Image
} from 'react-native';
import {
  Container, Header, Tabs, Title,
  Content, Footer, FooterTab, Button, Spinner,
  Thumbnail, Icon, H1, H2, H3, Text, Card,
  CardItem, Grid, Row, Col
} from 'native-base';
import myTheme from '../themes/myTheme';
import FontAwesomeIconTheme from '../themes/FontAwesomeIconTheme';
import MaterialDesignTheme from '../themes/MaterialDesignTheme';

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

var GLOBAL = require('../global/GlobalVariables');
var LAST_ONLINE_UPDATE_URL = 'https://salonecriture.firebaseio.com/infos_pratiques/last_update.json'
var INFO_PRATIQUE_TEXT_CONTENT_URL = 'https://salonecriture.firebaseio.com/infos_pratiques.json'
var INFO_PRATIQUE_STORAGE_KEY = '@infoPratiqueContent';
var LAST_CHECK_STORAGE_KEY = '@infoPratiqueLastCheck';
var basicTextJSONLocation = '../json/info_pratique_texts_template.json';
var SALON_ECRITURE_WEBSITE_ADDR = 'http://www.salonecriture.org';

var lieux_images_sources_by_id = [
  require("../images/lieux/colombier_centre.jpg"),
  require("../images/lieux/college_colombier.jpg"),
  require("../images/lieux/echichens.jpg")
];


const propTypes = {
  textFieldsContent: React.PropTypes.shape({
    last_update: PropTypes.string,
    text1_dates: PropTypes.string,
    text2_horaires: PropTypes.string,
    lieux: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  }),
};

const defaultProps = {
};



class InformationsPratiques extends Component {
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
        text2_horaires: null,
        lieux: [],
      },
    };
  }

  /**
   * Load text content from disk, or from default json file if this has failed.
   */
  FALSEFALSEFALSE______componentWillMount() {
    this._loadInfoPratiqueFromDisk();
  }

  /**
   * Check with netinfo if device is connected to internet, add listener to detect changes.
   * If it is the case, check if there is any update on the data text.
   */
  FALSEFALSEFALSE______componentDidMount() {
    //Network listener
    NetInfo.isConnected.addEventListener('change', this._handleConnectivityChange);
    //Check network
    NetInfo.isConnected.fetch().done(
      (isConnected) => {
        console.log('Initial is connected: ' + isConnected);
        this.setState({ deviceIsConnected: isConnected });
        //TODO: Add if it has been less than a period of time
        if (isConnected) {
          //Load data from internet
          this.fetchUpdateContent();
        }
      }
    );
    // });
  }

  FALSEFALSEFALSE______componentWillUnmount() {
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

  _clickUrl(url) {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log('Don\'t know how to open URI: ' + url);
      }
    });
  }


  /** ---------------------------- RENDER FUNCTION ---------------------------- */

  render() {
    let deviceIsConnected = this.props.deviceIsConnected;
    let loadingContentUpdate = false;
    let textFieldsContent = this.props.textFieldsContent;
    let lieux = this.props.lieux;
    console.log('------------------- RENDER -----------------')
    console.log(textFieldsContent)
    // let lieux = this.props.textFieldsContent;

    return (
      <Container theme={myTheme}>
        <Header>
          <Title>Informations Pratiques</Title>
        </Header>

        <Content style={styles.content}>
          {/*Offline component*/}
          {!deviceIsConnected && deviceIsConnected != null ?
            <View>
              <Text style={styles.offlineText}>Hors ligne</Text>
            </View>
            : null
          }
          {loadingContentUpdate ?
            <View style={styles.loadingContent}>
              <Text>Mise-à-jour</Text>
              <ActivityIndicator style={styles.spinner} />
            </View>
            : null
          }



          <View style={styles.mainContentView}>

            {/* -------------- Horaires -------------- */}
            <Card>
              <CardItem header>
                <Icon name="ios-clock" style={{ fontSize: 30, marginRight: 8, }} />
                <H2>Horaires</H2>
              </CardItem>

              <CardItem>
                <Text style={styles.horairesDate}><Text style={styles.horairesHeure}>Jeudi 2 mars :</Text> Inauguration du salon</Text>
                <Text><Text style={styles.horairesDate}>À partir de 17h</Text> (sur invitation)</Text>
                <Text><Text style={styles.horairesDate}>À partir de 20h30</Text> (tout public)</Text>
                <Text note>(Salle polyvalente d’Echichens)</Text>
              </CardItem>

              <CardItem>
                <Text><Text style={styles.horairesHeure}>Vendredi 3 mars : </Text><Text style={styles.horairesDate}>09h00 à 21h00</Text></Text>
                <Text note>(Sur les trois sites)</Text>
              </CardItem>

              <CardItem>
                <Text><Text style={styles.horairesHeure}>Samedi 4 mars : </Text><Text style={styles.horairesDate}>09h00 à 21h00</Text></Text>
                <Text note>(Sur les trois sites)</Text>
              </CardItem>
            </Card>



            {/* -------------- Lieux -------------- */}
            <Card>
              <CardItem header>
                <Icon theme={FontAwesomeIconTheme} name="map-signs" style={{ fontSize: 30, marginRight: 8, }} />
                <H2>Lieux</H2>
              </CardItem>

              {(lieux).map((lieu, i) => {
                return (
                  <CardItem key={i}>
                    <Grid selectable={true}>
                      <Row>
                        <Image style={styles.lieuImage} source={lieux_images_sources_by_id[i]} />
                      </Row>
                      <Row>
                        <Text selectable={true} style={styles.lieuName}>{lieu.name}</Text>
                      </Row>
                      <Row>
                        <Col>
                          <Text selectable={true} style={styles.lieuAddr}>{lieu.addr1}</Text>
                        </Col>
                        <View style={styles.lieuItineraryView}>
                          <Button success iconRight onPress={() => this._clickUrl(lieu.gps_addr)}>
                            Itinéraire
                           <Icon theme={MaterialDesignTheme} name="directions" />
                          </Button>
                        </View>
                      </Row>
                    </Grid>
                  </CardItem>
                );
              })}
            </Card>


            {/* -------------- Accès au Salon -------------- */}
            <Card>
              <CardItem header>
                <Icon name="md-car" style={{ fontSize: 30, marginRight: 8, }} />
                <H2>Accès au Salon</H2>
              </CardItem>

              <CardItem>
                <Text style={styles.accesTitle}>En voiture :</Text>
                <Text selectable={true} selectable={true}>Sortie d’autoroute à Morges. Depuis là, 5 minutes de trajet jusqu’à Echichens et 5 minutes de plus pour Colombier VD.</Text>
              </CardItem>

              <CardItem>
                <Text style={styles.accesTitle}>En transports publics :</Text>
                <Text selectable={true} selectable={true}>Arrêt à la gare de Morges. Puis navette du salon jusqu'à Echichens (1er arrêt) et Colombier VD (2ème et 3ème arrêts).</Text>
              </CardItem>

              <CardItem style={styles.cardItem}>
                <Icon name="ios-information-circle" style={{ color: 'green', fontSize: 30, marginRight: 8, }} />
                <Text selectable={true} style={styles.infoSupp}>Un bus fera la navette depuis la gare de Morges entre les différents sites du Salon.</Text>
              </CardItem>
            </Card>



            {/* -------------- Contacts -------------- */}
            <Card>
              <CardItem header>
                <Icon name="md-people" style={{ fontSize: 30, marginRight: 8, }} />
                <H2>Contacts</H2>
              </CardItem>

              <CardItem>
                <Text selectable={true}>
                  <Text style={styles.accesTitle}>Site Internet : </Text>
                  <Text style={styles.url} onPress={() => this._clickUrl(SALON_ECRITURE_WEBSITE_ADDR)}>
                    www.salonecriture.org
                </Text>
                </Text>
                <Text selectable={true}>
                  <Text style={styles.accesTitle}>Email : </Text>
                  <Text>
                    info@salonecriture.org
                </Text>
                </Text>
              </CardItem>

              <CardItem>
                <View style={{ marginBottom: 8, }}>
                  <Text style={styles.accesTitle}>Présidente du Salon : </Text>
                  <Text selectable={true}>Sylvie Guggenheim</Text>
                </View>
                <Text style={styles.accesTitle}>Vice-président du Salon : </Text>
                <Text selectable={true}>Michel Ackermann</Text>
              </CardItem>

              <CardItem>
                <Text selectable={true}>
                  <Text style={styles.accesTitle}>Organisateur du Salon : </Text>
                  <Text>Association SylMa</Text>
                </Text>
              </CardItem>

            </Card>
          </View>
        </Content>
      </Container >



    );
  }
}


const styles = StyleSheet.create({
  content: {
    marginTop: 2,
    marginBottom: 8,
    paddingRight: 8,
    paddingLeft: 8,
  },
  mainContentView: {
    marginTop: 10,
  },
  titleThumbnail: {
    marginRight: -15,
  },
  titleInfo: {
    // backgroundColor:'red',
    textAlign: 'center',
    marginBottom: 5,
  },

  infoIndivView: {
    marginTop: 12,
    marginBottom: 8,
  },

  sectionTitre: {
    fontWeight: 'bold',
    fontSize: 22,
    textAlign: 'center',
    paddingBottom: 8,
    marginLeft: 32,
    marginRight: 32,
    marginBottom: 8,
    borderBottomWidth: 1,
  },

  horaires: {
    // alignItems: 'center',
  },

  horairesDate: {
    fontSize: 16,
    // backgroundColor:'blue',
  },
  horairesHeure: {
    fontSize: 16,
    fontWeight: 'bold',
    margin: 0, padding: 0,
  },
  horairesCause: {
    fontSize: 16,
    marginTop: -5,
  },
  horairesLieu: {
    fontSize: 14,
    marginTop: -5,
    marginBottom: 10,
  },

  lieuInfo: {
    marginBottom: 5,
  },

  lieuName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  lieuAddr: {
    // marginLeft: 8,
    // marginTop: -4,
    // fontSize: 14,
    lineHeight: 20,
  },
  lieuImage: {
    flex: 1,
    width: 50,
    height: 130,
    resizeMode: 'contain'
  },
  lieuItineraryView: {
    justifyContent: 'center',
    marginLeft: 16,
    marginRight: 0,
  },


  accesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoSupp: {
    fontSize: 16,
    fontStyle: 'italic',
    // textAlign: 'center',
  },



  url: {
    textDecorationLine: 'underline',
    color: '#0000EE',
  },



  cardItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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





InformationsPratiques.propTypes = propTypes;
InformationsPratiques.defaultProps = defaultProps;

export default InformationsPratiques;