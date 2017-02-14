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

import jsonDefaultContent from '../json/infos_pratiques_default_test.json';


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

var SALON_ECRITURE_WEBSITE_ADDR = 'http://www.salonecriture.org';

var lieux_images_sources_by_id = [
  require("../images/lieux/colombier_centre.jpg"),
  require("../images/lieux/college_colombier.jpg"),
  require("../images/lieux/echichens.jpg")
];


const propTypes = {
  loadingContentUpdate: React.PropTypes.bool,
  textFieldsContent: React.PropTypes.shape({
    text1_dates: PropTypes.string,
    text2_horaires: PropTypes.string,
    lieux: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        addr1: PropTypes.string,
        name: PropTypes.string,
        gps_addr: PropTypes.string,
      },
      )),
  }),
};

const defaultProps = {
  loadingContentUpdate: false,
};



class InformationsPratiques extends Component {

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

    let textContent = this.props.textFieldsContent;
    if (textContent == null) {
      textContent = jsonDefaultContent;
    }

    let loadingContentUpdate = this.props.loadingContentUpdate;
    let lieux = textContent.lieux;

    return (
      <Container theme={myTheme}>
        <Header>
          <Title>Informations Pratiques</Title>
        </Header>

        <Content style={styles.content}>
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