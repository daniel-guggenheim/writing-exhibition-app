'use strict';

import React, { Component, PropTypes } from 'react';
import { ActivityIndicator, Image, Linking, Platform, StyleSheet, View, } from 'react-native';
import {
  Container, Header, Title, Content, Button, Spinner,
  Icon, H2, Text, Card, CardItem, Grid, Row, Col
} from 'native-base';

// Components
import ExceptionalInfos from '../components/ExceptionalInfos';

// Global variables
import GLOBAL from '../global/GlobalVariables';

// Themes
import myTheme from '../themes/myTheme';
import FontAwesomeIconTheme from '../themes/FontAwesomeIconTheme';
import MaterialDesignTheme from '../themes/MaterialDesignTheme';

// Images
const lieux_images_sources_by_id = [
  require("../images/lieux/colombier_centre.jpg"),
  require("../images/lieux/college_colombier.jpg"),
  require("../images/lieux/echichens.jpg")
];
const logo_icon = require("../images/logo/logo.png");

// Default data data
import jsonDefaultContent from '../json/infos_pratiques_default.json';

// Local variables
const SALON_ECRITURE_WEBSITE_ADDR = 'http://www.salonecriture.org';


const propTypes = {
  currentlyFetchingContent: PropTypes.bool,
  textFieldsContent: PropTypes.shape({
    exceptional_infos: PropTypes.shape({
      title: PropTypes.string,
      text: PropTypes.string,
    }),
    lieux: PropTypes.arrayOf(
      PropTypes.shape({
        addr1: PropTypes.string,
        name: PropTypes.string,
        gps_addr: PropTypes.string,
      },
      )),
  }),
};

const defaultProps = {
  currentlyFetchingContent: false,
};

/**
 * This scene contains all the useful information about the event.
 */
class InformationsPratiques extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mainComponentIsRendering: true,
    }
  }

  componentDidMount() {
    /*
      The component takes time to render entirely. The following will allow to quickly render the
      page with a loading spinner, and when the component is ready, to display it immediately.
    */
    setTimeout(() => {
      this.setState({ mainComponentIsRendering: false });
    }, 0);
  }

  /**
   * Check if the url is supported and open it in an external app if it is the case.
   * @param {String} url : The url to open in an external app. 
   */
  _clickUrl(url) {
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          console.log('Don\'t know how to open URI: ' + url);
        }
      })
      .catch(error => {
        console.log('Error while trying to open link: ' + url);
      });
  }


  /** ---------------------------- RENDER FUNCTION ---------------------------- */

  render() {

    let textContent = this.props.textFieldsContent;
    if (textContent == null) {
      console.log('Infos pratiques: No data from internet, loading default content.');
      textContent = jsonDefaultContent;
    }

    let loadingContentUpdate = this.props.currentlyFetchingContent;
    let lieux = textContent.lieux;
    let exceptionalInfo = textContent.exceptional_infos;

    return (
      <Container theme={myTheme}>
        <Header>
          <Button transparent disabled>
            <Image resizeMode={"contain"} style={{ width: 32 }} source={logo_icon} />
          </Button>
          <Title>Informations pratiques</Title>
        </Header>

        {this.state.mainComponentIsRendering ?
          <View style={styles.spinnerView}><Spinner /></View>

          :

          <Content style={styles.content}>
            {loadingContentUpdate ?
              <View style={styles.loadingContent}>
                <Text>Mise-à-jour</Text>
                <ActivityIndicator style={styles.spinner} />
              </View>
              : null
            }

            <ExceptionalInfos title={exceptionalInfo.title} text={exceptionalInfo.text} />

            <View style={styles.mainContentView}>

              {/* -------------- Horaires -------------- */}
              <Card>
                <CardItem header>
                  <Icon name="ios-clock" style={{ fontSize: 30, marginRight: 8, }} />
                  <H2>Horaires</H2>
                </CardItem>

                <CardItem>
                  <Text style={styles.horairesDate}><Text style={styles.horairesHeure}>Jeudi 2 mars :</Text> 20h00</Text>
                  <Text style={styles.horairesDate}>Conférence inaugurale</Text>
                  <Text note style={styles.horairesLieu}>(Salle polyvalente d’Echichens)</Text>
                </CardItem>

                <CardItem>
                  <Text><Text style={styles.horairesHeure}>Vendredi 3 mars : </Text><Text style={styles.horairesDate}>09h00 à 21h00</Text></Text>
                  <Text note style={styles.horairesLieu}>(Sur les trois sites)</Text>
                </CardItem>

                <CardItem>
                  <Text><Text style={styles.horairesHeure}>Samedi 4 mars : </Text><Text style={styles.horairesDate}>09h00 à 17h00</Text></Text>
                  <Text note style={styles.horairesLieu}>(Sur les trois sites)</Text>
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
                  <Text style={styles.accesText} selectable={true}>Sortie d’autoroute à Morges. Depuis là, 5 minutes de trajet jusqu’à Echichens et 5 minutes de plus pour Colombier VD.</Text>
                </CardItem>

                <CardItem>
                  <Text style={styles.accesTitle}>En transports publics :</Text>
                  <Text style={styles.accesText}>Arrêt à la gare de Morges. Par la suite, à choix:</Text>
                  <Text style={styles.accesText}>- Centre d'Echichens: bus de ligne 701.</Text>
                  <Text style={styles.accesText}>- Colombier: bus de ligne 730.</Text>
                  <Text style={styles.accesText}>- Navette du salon jusqu'à Echichens (1er arrêt) et Colombier VD (2ème et 3ème arrêts).
                    Le vendredi toutes les heures, le samedi toutes les 30 minutes.</Text>
                </CardItem>

                <CardItem style={styles.cardItem}>
                  <Icon name="ios-information-circle" style={{ color: 'green', fontSize: 30, marginRight: 8, }} />
                  <Text selectable={true} style={styles.infoSupp}>Les horaires sont disponibles sur le site internet à l'adresse suivante: <Text style={styles.url} onPress={() => this._clickUrl('https://www.salonecriture.org/salon/infos-pratiques/')}>
                    https://www.salonecriture.org/salon/infos-pratiques/
                </Text></Text>
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
                    <Text style={styles.contactTitle}>Site internet : </Text>
                    <Text style={styles.url} onPress={() => this._clickUrl(SALON_ECRITURE_WEBSITE_ADDR)}>
                      www.salonecriture.org
                </Text>
                  </Text>
                  <Text selectable={true}>
                    <Text style={styles.contactTitle}>Email : </Text>
                    <Text style={styles.url} onPress={() => this._clickUrl(GLOBAL.SEND_EMAIL_URI_SALON_ECRITURE)}>
                      info@salonecriture.org
                </Text>
                  </Text>
                </CardItem>

                <CardItem>
                  <View style={{ marginBottom: 8, }}>
                    <Text style={styles.contactTitle}>Présidente du Salon : </Text>
                    <Text selectable={true}>Sylvie Guggenheim</Text>
                  </View>
                  <View style={{ marginBottom: 8, }}>
                    <Text style={styles.contactTitle}>Vice-président du Salon : </Text>
                    <Text selectable={true}>Michel Ackermann</Text>
                  </View>
                  <View>
                    <Text style={styles.contactTitle}>Organisateur du Salon : </Text>
                    <Text selectable={true}>Association SylMa</Text>
                  </View>
                </CardItem>


                <CardItem>
                  <View>
                    <Text style={styles.contactTitle}>Créateur de l'application mobile : </Text>
                    <Text>Daniel Guggenheim</Text>
                  </View>
                </CardItem>

                <CardItem>
                  <Text style={styles.bugText}>Si vous découvrez un bug en utilisant cette application, merci de le signaler en cliquant ici : </Text>
                  <View style={{ marginTop: 8, flexDirection: 'row', justifyContent: 'center' }}>
                    <Button warning bordered
                      onPress={() => this._clickUrl(GLOBAL.SEND_EMAIL_URI_REPORT_BUG)}>
                      <Icon name='ios-mail' />
                      <Text>Signaler un bug</Text>
                    </Button>
                  </View>
                </CardItem>
              </Card>
            </View>
          </Content>
        }

      </Container >

    );
  }
}


const styles = StyleSheet.create({
  content: {
    paddingTop: (Platform.OS === 'ios') ? 0 : 2,
    marginBottom: (Platform.OS === 'ios') ? -40 : 8,
    paddingRight: 8,
    paddingLeft: 8,
  },
  mainContentView: {
    marginTop: (Platform.OS === 'ios') ? 5 : 10,
  },
  spinnerView: {
    alignItems: 'center',
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
    fontSize: (Platform.OS === 'ios') ? 14 : 16,
    // backgroundColor:'blue',
  },
  horairesHeure: {
    fontSize: (Platform.OS === 'ios') ? 14 : 16,
    fontWeight: 'bold',
    margin: 0, padding: 0,
  },
  horairesCause: {
    fontSize: (Platform.OS === 'ios') ? 14 : 16,
    marginTop: -5,
  },
  horairesLieu: (Platform.OS === 'ios') ? {
    fontSize: 14,
    fontWeight: 'normal',
    marginTop: 3,
    marginBottom: 5,
  }
    :
    {},
  lieuInfo: {
    marginBottom: 5,
  },

  lieuName: {
    fontSize: (Platform.OS === 'ios') ? 14 : 16,
    fontWeight: 'bold',
    marginTop: (Platform.OS === 'ios') ? 5 : 0,
  },
  lieuAddr: {
    marginTop: (Platform.OS === 'ios') ? 1 : 0,
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
    fontSize: (Platform.OS === 'ios') ? 14 : 16,
    fontWeight: 'bold',
  },
  accesText: (Platform.OS === 'ios') ? {
    fontSize: 14,
  } : {},
  infoSupp: {
    fontSize: (Platform.OS === 'ios') ? 14 : 16,
    fontStyle: 'italic',
    // textAlign: 'center',
  },
  contactTitle: {
    fontSize: (Platform.OS === 'ios') ? 14 : 16,
    fontWeight: 'bold',
  },


  url: {
    textDecorationLine: 'underline',
    color: '#0000EE',
  },

  bugText: (Platform.OS === 'ios') ? {
    fontSize: 14,
  } : {},



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