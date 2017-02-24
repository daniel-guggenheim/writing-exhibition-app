import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import { Container, Header, Title, Content, Button, Icon, Card, CardItem, H2, Spinner } from 'native-base';

import ExceptionalInfos from '../components/ExceptionalInfos';

import myTheme from '../themes/myTheme';
var GLOBAL = require('../global/GlobalVariables');

import jsonDefaultContent from '../json/programme_default.json';
var logo_icon = require("../images/logo/logo.png");

const COLLEGE_COLOMBIER_COLOR = '#1F3A93';
const TITLES_COLOR = ['#C0DDFA', '#59ABE3', '#446CB3', '#10375C'];

// const ECHICHENS_COLOR = '#90C695';
// const OTHER_PLACES_COLOR = '#EB974E';
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


  constructor(props) {
    super(props);
    this.state = {
      mainComponentIsRendering: true,
    }
  }

  componentDidMount() {
    //This will allow to render only a spinner at the beginning, and when the component
    // has loaded, to render it immediately. 
    setTimeout(() => {
      this.setState({ mainComponentIsRendering: false });
    }, 0);
  }

  render() {
    if (this.state.mainComponentIsRendering) {
      console.log('Programme salon : mainComponentIsRendering');
    } else {
      console.log('Programme salon : mainComponentIsRendering is FALSE.');
    }


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


        {this.state.mainComponentIsRendering ?
          <View style={styles.spinnerView}><Spinner /></View>

          :


          <Content style={styles.content}>

            <ExceptionalInfos title={exceptionalInfo.title} text={exceptionalInfo.text} />

            <Card>
              <CardItem header style={[styles.cardTitle, { borderLeftColor: TITLES_COLOR[0], }]}>
                <H2 >{day1Title}</H2>
              </CardItem>
              {(programme.day1).map((progElem, i) => {
                let elemKey = progElem.schedule + progElem.title;
                return (
                  <ProgrammeElement
                    key={elemKey}
                    progElem={progElem}
                    goToProgrammeDetails={() => this.props.goToProgrammeDetails(progElem)} />
                );
              })}
            </Card>


            <Card>
              <CardItem header style={[styles.cardTitle, { borderLeftColor: TITLES_COLOR[1], }]}>
                <H2>{day2Title}</H2>
              </CardItem>

              {(programme.day2).map((progElem, i) => {
                let elemKey = progElem.schedule + progElem.title;
                return (
                  <ProgrammeElement
                    key={elemKey}
                    progElem={progElem}
                    goToProgrammeDetails={() => this.props.goToProgrammeDetails(progElem)} />
                );
              })}
            </Card>

            <Card>
              <CardItem header style={[styles.cardTitle, { borderLeftColor: TITLES_COLOR[2], }]}>
                <H2>{day3Title}</H2>
              </CardItem>

              {(programme.day3).map((progElem, i) => {
                let elemKey = progElem.schedule + progElem.title;
                return (
                  <ProgrammeElement
                    key={elemKey}
                    progElem={progElem}
                    goToProgrammeDetails={() => this.props.goToProgrammeDetails(progElem)} />
                );
              })}
            </Card>

            <Card>
              <CardItem header style={[styles.cardTitle, { borderLeftColor: TITLES_COLOR[3], }]}>
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
                          <Icon name='ios-pin-outline' style={[styles.locationIcon, { color: COLLEGE_COLOMBIER_COLOR, }]} />
                          <Text style={[styles.locationText, { color: COLLEGE_COLOMBIER_COLOR }]}>{progElem.location}</Text>
                        </View>
                      </View>
                    </View>
                  </CardItem>
                );
              })}
            </Card>
          </Content>
        }
      </Container >
    );
  }
}


class ProgrammeElement extends Component {

  render() {
    progElem = this.props.progElem;
    placeColor = GLOBAL.PLACES_COLOR(progElem.location);

    return (
      <CardItem style={styles.cardItem} button onPress={() => this.props.goToProgrammeDetails()} >
        <View style={styles.progElemView}>
          <View style={styles.scheduleView}>
            <Text style={styles.scheduleText}>{progElem.schedule}</Text>
          </View>
          <View style={styles.infosView}>
            <Text style={styles.titleText}>{progElem.title}</Text>
            <View style={styles.typeLocationView}>
              <View style={styles.locationView}>
                <Icon name='ios-pin-outline' style={[styles.locationIcon, { color: placeColor }]} />
                <Text style={[styles.locationText]}>{progElem.location}</Text>
              </View>
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
  cardTitle: {
    borderLeftWidth: 16,
    borderStyle: 'solid',
    paddingLeft: 16,
    paddingBottom: 14,
    paddingTop: 14,
    // marginTop: 8,
  },
  spinnerView: {
    alignItems: 'center',
  },


  /* --- ProgrammeElement (cardviews) and part of expo permanente --- */
  cardItem: {
  },
  progElemView: {
    flexDirection: 'row',
  },
  scheduleView: {
    marginRight: 8,
    // justifyContent: 'center',
    alignItems: 'center',
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
    marginRight: 5,
  },
  locationText: {
    flex: 1,
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