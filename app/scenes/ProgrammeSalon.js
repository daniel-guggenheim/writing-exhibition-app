
import React, { Component, PropTypes } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  WebView
} from 'react-native';
import {
  Container, Header, Tabs, Title, Content, Footer, FooterTab, Button, Icon,
  List, ListItem, Separator, Card, CardItem, H2, Row, Col, Grid
} from 'native-base';

import myTheme from '../themes/myTheme';
import ExceptionalInfos from '../components/ExceptionalInfos';
import jsonDefaultContent from '../json/programme_default.json';


var GLOBAL = require('../global/GlobalVariables');
var logo_icon = require("../images/logo/logo.png");

const ECHICHENS_COLOR = '#67809F';
const OTHER_PLACES_COLOR = '#1F3A93';

var exampleData = {
  titles: ['Jeudi 2 mars', 'Vendredi 3 mars', 'Samedi 4 mars', 'Expositions permanentes'],
  expos_permanentes: [
    {
      organizer: "Institut Ebena, France",
      title: "Alphabet a ka u ku du Sultan Njoya, roi des Bamoun, hote d'honneur ",
      location: "Echichens",

    },
    {
      organizer: "Fondation Bodmer, Genève",
      title: "De la correspondance au sms",
      location: "Colombier",
    },

  ],
  day1: [
    {
      schedule: '17h00',
      title: "Accueil des invités",
      speaker: "",
      type: "Accueil",
      location: 'Echichens'
    },
    {
      schedule: '18h00',
      title: "Inauguration du salon",
      speaker: "Sylvie Guggenheim",
      type: "Conférence",
      location: 'Echichens'
    },
    {
      schedule: '11h30',
      title: "Place et rôle de l'écriture dans le développement économique, social et culturel du Cameroun",
      speaker: "Professeur Clément Dili Palaï",
      type: "Conférence",
      location: 'Echichens'
    },
    {
      schedule: '11h30',
      title: "L'écriture dans tous ses états",
      speaker: "Carole Jobin",
      type: "Conférence",
      location: 'Colombier, salle 1'
    },
  ],
  day2: [
    {
      schedule: '10h00',
      title: "Je me souviens, atelier d'écriture autobiographique",
      speaker: "Emmanuelle Ryser",
      type: "Atelier d'Ecriture pour pratiquer",
      location: 'Colombier, salle 2'
    },
    {
      schedule: '11h30',
      title: "L'écriture dans tous ses états",
      speaker: "Carole Jobin",
      type: "Conférence",
      location: 'Colombier, salle 1'
    },
  ],
  day3: [
    {
      schedule: '11h30',
      title: "Place et rôle de l'écriture dans le développement économique, social et culturel du Cameroun",
      speaker: "Professeur Clément Dili Palaï",
      type: "Conférence",
      location: 'Echichens'
    },
    {
      schedule: '11h30',
      title: "L'écriture dans tous ses états",
      speaker: "Carole Jobin",
      type: "Conférence",
      location: 'Colombier, salle 1 (ou peutetre la 2)'
    },
  ],

}


const propTypes = {
  programmeContent: React.PropTypes.shape({
    exceptional_infos: React.PropTypes.shape({
      title: PropTypes.string,
      text: PropTypes.string,
    }),
    day1: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        location: PropTypes.string,
        schedule: PropTypes.string,
        speaker: PropTypes.string,
        title: PropTypes.string,
        type: PropTypes.string,
      },
      )),
    day2: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        location: PropTypes.string,
        schedule: PropTypes.string,
        speaker: PropTypes.string,
        title: PropTypes.string,
        type: PropTypes.string,
      },
      )),
    day3: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        location: PropTypes.string,
        schedule: PropTypes.string,
        speaker: PropTypes.string,
        title: PropTypes.string,
        type: PropTypes.string,
      },
      )),
    expos_permanentes: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        location: PropTypes.string,
        organizer: PropTypes.string,
        title: PropTypes.string,
      },
      )),
    titles: React.PropTypes.arrayOf(PropTypes.string),
  }),
};

const defaultProps = {
};




class ProgrammeSalon extends Component {

  render() {
    let programme = this.props.programmeContent;
    if (programme == null) {
      console.log('Programme: No data from internet, loading default content.');
      programme = jsonDefaultContent;
    }

    day1Title = programme.titles[0];
    day2Title = programme.titles[1];
    day3Title = programme.titles[2];
    expoPermanenteTitle = programme.titles[3];
    exceptionalInfo = programme.exceptional_infos;

    return (

      <Container theme={myTheme}>
        <Header>
          <Button transparent disabled>
            <Image resizeMode={"contain"} style={{ width: 32 }} source={logo_icon} />
          </Button>

          <Title>Programme du Salon</Title>

        </Header>

        <Content style={styles.content}>

          <ExceptionalInfos title={exceptionalInfo.title} text={exceptionalInfo.text} />

          <Card>
            <CardItem header>
              <H2>{day1Title}</H2>
            </CardItem>
            {(programme.day1).map((progElem, i) => {
              let elemKey = progElem.schedule + progElem.title;
              return (
                <ProgrammeElement key={elemKey} progElem={progElem} />
              );
            })}
          </Card>


          <Card>
            <CardItem header>
              <H2>{day2Title}</H2>
            </CardItem>

            {(programme.day2).map((progElem, i) => {
              let elemKey = progElem.schedule + progElem.title;
              return (
                <ProgrammeElement key={elemKey} progElem={progElem} />
              );
            })}
          </Card>

          <Card>
            <CardItem header>
              <H2>{day3Title}</H2>
            </CardItem>

            {(programme.day3).map((progElem, i) => {
              let elemKey = progElem.schedule + progElem.title;
              return (
                <ProgrammeElement key={elemKey} progElem={progElem} />
              );
            })}
          </Card>

          <Card>
            <CardItem header>
              <H2>{expoPermanenteTitle}</H2>
            </CardItem>
            {(programme.expos_permanentes).map((progElem, i) => {
              let elemKey = progElem.title;
              return (
                <CardItem key={elemKey}>
                  <View>
                    <Text style={styles.titleText}>{progElem.title}</Text>
                    <Text style={styles.expoPermaOrganizerText}>{progElem.organizer}</Text>
                    <View style={styles.expoPermaLocationView}>
                      {progElem.location == 'Echichens' ?
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                          <Icon name='ios-pin' style={{ fontSize: 16, color: ECHICHENS_COLOR, marginRight: 5, }} />
                          <Text style={[styles.locationText, { color: ECHICHENS_COLOR }]}>{progElem.location}</Text>
                        </View>
                        :
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                          <Icon name='ios-pin' style={{ fontSize: 16, color: OTHER_PLACES_COLOR, marginRight: 5, }} />
                          <Text style={styles.locationText}>{progElem.location}</Text>
                        </View>
                      }
                    </View>
                  </View>
                </CardItem>
              );
            })}
          </Card>
        </Content>
      </Container>
    );
  }
}


class ProgrammeElement extends Component {


  render() {
    progElem = this.props.progElem;

    return (
      <CardItem style={styles.cardItem}>
        <View style={styles.progElemView}>
          <View style={styles.scheduleView}>
            <Text style={styles.scheduleText}>{progElem.schedule}</Text>
          </View>
          <View style={styles.infosView}>
            <Text style={styles.titleText}>{progElem.title}</Text>
            <View style={styles.typeLocationView}>
              {progElem.location == 'Echichens' ?
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                  <Icon name='ios-pin' style={{ fontSize: 16, color: ECHICHENS_COLOR, marginRight: 5, }} />
                  <Text style={[styles.locationText, { color: ECHICHENS_COLOR }]}>{progElem.location}</Text>
                </View>
                :
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                  <Icon name='ios-pin' style={{ fontSize: 16, color: OTHER_PLACES_COLOR, marginRight: 5, }} />
                  <Text style={styles.locationText}>{progElem.location}</Text>
                </View>
              }
              <Text style={styles.typeText}>{progElem.type}</Text>

            </View>
          </View>
        </View>
      </CardItem>
    );
  }
}

const styles = StyleSheet.create({
  //Card item
  cardItem: {
    // backgroundColor:'green',
  },
  progElemView: {
    flexDirection: 'row',
    // backgroundColor:'green',
  },
  scheduleView: {
    marginRight: 8,
  },
  scheduleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  titleText: {
    // color:'darkblue',
    flex: 1,
    flexWrap: 'wrap',
    fontSize: 17,
    color: 'black',
  },
  speakerText: {
    flex: 1,
    flexWrap: 'wrap',
    fontSize: 15,
    marginTop: 5,
  },
  infosView: {
    flex: 1,
    flexDirection: 'column',
  },
  typeLocationView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  typeText: {
    flex: 1,
    // flexWrap: 'wrap',
    fontStyle: 'italic',
    // color: 'green',
    // backgroundColor:'blue',
    marginLeft: 20,
    textAlign: 'right',

  },
  locationText: {
    flex: 1,
    color: OTHER_PLACES_COLOR,
    // backgroundColor:'red',
  },


  //Other
  content: {
    marginTop: 8,
    marginBottom: 8,
    paddingRight: 8,
    paddingLeft: 8,
  },


  //Expo permanente
  expoPermaLocationView: {
    marginTop: 8,
  },
  expoPermaOrganizerText: {
    fontSize: 15,
    marginTop: 4,
  },

});





ProgrammeSalon.propTypes = propTypes;
ProgrammeSalon.defaultProps = defaultProps;

export default ProgrammeSalon;