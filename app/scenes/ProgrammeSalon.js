
import React, { Component } from 'react';
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

var GLOBAL = require('../global/GlobalVariables');
var logo_icon = require("../images/logo/logo.png");


var exampleData = {
  titles: ['Jeudi 2 mars', 'Vendredi 3 mars', 'Samedi 4 mars', 'Expositions permanentes'],
  expoPermanente: [
    {
      text: "Antenne de l'hôte d'honneur (Cameroun) : Alphabet a ka u ku du Sultan Njoya, roi des Bamoun, Institut Ebena, France",
      location: "Echichens",

    }

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

export default class ProgrammeSalon extends Component {

  render() {
    programme = exampleData;
    day1Title = programme.titles[0];
    day2Title = programme.titles[1];
    day3Title = programme.titles[2];
    expoPermanenteTitle = programme.titles[3]

    return (

      <Container theme={myTheme}>
        <Header>
          <Button transparent disabled>
            <Image resizeMode={"contain"} style={{ width: 32 }} source={logo_icon} />
          </Button>

          <Title>Programme du Salon</Title>

        </Header>

        <Content style={styles.content}>

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
            {(programme.day1).map((progElem, i) => {
              let elemKey = progElem.schedule + progElem.title;
              return (
                <ProgrammeElement key={elemKey} progElem={progElem} />
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
              <Text style={styles.typeText}>{progElem.type}</Text>
              <Text style={styles.locationText}>{progElem.location}</Text>
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
    fontWeight: 'bold',
    fontSize: 16,
  },
  titleText: {
    flex: 1,
    flexWrap: 'wrap',
    fontSize: 16,
  },
  infosView: {
    flex: 1,
    flexDirection: 'column',
  },
  typeLocationView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  typeText: {
    // flexWrap: 'wrap',
    // color: 'green',
    flex: 1,
    // backgroundColor:'blue',

  },
  locationText: {
    // backgroundColor:'red',
    marginLeft: 20,
    flex: 1,
    textAlign: 'right',
  },


  //Other
  content: {
    marginTop: 8,
    marginBottom: 8,
    paddingRight: 8,
    paddingLeft: 8,
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