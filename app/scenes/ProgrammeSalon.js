
import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import { Container, Header, Title, Content, Button, Icon, Card, CardItem, H2, } from 'native-base';

import ExceptionalInfos from '../components/ExceptionalInfos';

import myTheme from '../themes/myTheme';
var GLOBAL = require('../global/GlobalVariables');

import jsonDefaultContent from '../json/programme_default.json';
var logo_icon = require("../images/logo/logo.png");

const COLLEGE_COLOMBIER_COLOR = '#1F3A93';
const ECHICHENS_COLOR = '#90C695';
const OTHER_PLACES_COLOR = '#EB974E';
// const ECHICHENS_COLOR = '#67809F';
// const OTHER_PLACES_COLOR = '#1F3A93';

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
                      <View style={styles.locationView}>
                        <Icon name='ios-pin' style={[styles.locationIcon, { color: COLLEGE_COLOMBIER_COLOR, }]} />
                        <Text style={[styles.locationText, { color: COLLEGE_COLOMBIER_COLOR }]}>{progElem.location}</Text>
                      </View>
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
                <View style={styles.locationView}>
                  <Icon name='ios-pin' style={[styles.locationIcon, { color: ECHICHENS_COLOR, }]} />
                  <Text style={[styles.locationText, { color: ECHICHENS_COLOR }]}>{progElem.location}</Text>
                </View>
                :
                <View style={styles.locationView}>
                  <Icon name='ios-pin' style={styles.locationIcon} />
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
  /* --- Main view --- */
  content: {
    marginTop: 8,
    marginBottom: 8,
    paddingRight: 8,
    paddingLeft: 8,
  },


  /* --- ProgrammeElement (cardviews) and part of expo permanente --- */
  cardItem: {
  },
  progElemView: {
    flexDirection: 'row',
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
    flex: 1,
    flexWrap: 'wrap',
    fontSize: 17,
    color: 'black',
  },
  speakerText: {
    flex: 1,
    flexWrap: 'wrap',
    marginTop: 5,
    fontSize: 15,
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
  locationView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  locationIcon: {
    fontSize: 16,
    color: OTHER_PLACES_COLOR,
    marginRight: 5,
  },
  locationText: {
    flex: 1,
    color: OTHER_PLACES_COLOR,
  },
  typeText: {
    flex: 1,
    textAlign: 'right',
    marginLeft: 20,
    // flexWrap: 'wrap',
    fontStyle: 'italic',
  },


  /* --- Expo permanente --- */
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