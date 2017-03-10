'use strict';

import React, { Component, PropTypes } from 'react';
import { Platform, StyleSheet, Text, View, Image, } from 'react-native';
import {
  Container, Header, Title, Content, Button, Icon, Card, CardItem, H2, Spinner
} from 'native-base';

import ExceptionalInfos from '../../components/ExceptionalInfos';
import ProgramSingleDayView from './ProgramSingleDayView';
import ProgramEventComponent from './ProgramEventComponent';

import myTheme from '../../themes/myTheme';
import GLOBAL from '../../global/GlobalVariables';

import jsonDefaultContent from '../../json/programme_default.json';

const logo_icon = require("../../images/logo/logo.png");

const COLLEGE_COLOMBIER_COLOR = '#1F3A93';
const TITLES_COLOR = ['#C0DDFA', '#59ABE3', '#446CB3', '#10375C'];

const propTypes = {
  goToProgramDetailedView: PropTypes.func.isRequired,
  programmeContent: PropTypes.shape({
    exceptional_infos: PropTypes.shape({
      title: PropTypes.string,
      text: PropTypes.string,
    }),
    day1: PropTypes.arrayOf(
      PropTypes.shape({
        location: PropTypes.string,
        schedule: PropTypes.string,
        speaker: PropTypes.string,
        title: PropTypes.string,
        type: PropTypes.string,
      },
      )),
    day2: PropTypes.arrayOf(
      PropTypes.shape({
        location: PropTypes.string,
        schedule: PropTypes.string,
        speaker: PropTypes.string,
        title: PropTypes.string,
        type: PropTypes.string,
      },
      )),
    day3: PropTypes.arrayOf(
      PropTypes.shape({
        location: PropTypes.string,
        schedule: PropTypes.string,
        speaker: PropTypes.string,
        title: PropTypes.string,
        type: PropTypes.string,
      },
      )),
    expos_permanentes: PropTypes.arrayOf(
      PropTypes.shape({
        location: PropTypes.string,
        organizer: PropTypes.string,
        title: PropTypes.string,
      },
      )),
    titles: PropTypes.arrayOf(PropTypes.string),
  }),
};



/**
 * Scene containing the programme of the event. There are 3 different days one after another
 * and the "permanent exhibition" section at the end.
 */
class ProgramMainScene extends Component {


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

  render() {

    let programme = this.props.programmeContent;
    if (programme == null) {
      console.log('Programme: No data from internet, loading default content.');
      programme = jsonDefaultContent;
    }

    const day1Title = programme.titles[0];
    const day2Title = programme.titles[1];
    const day3Title = programme.titles[2];
    const expoPermanenteTitle = programme.titles[3];
    const exceptionalInfo = programme.exceptional_infos;

    return (
      <Container theme={myTheme}>

        {/* --- Header --- */}
        <Header>
          <Button transparent disabled>
            <Image resizeMode={"contain"} style={{ width: 32 }} source={logo_icon} />
          </Button>
          <Title>Programme du Salon</Title>
        </Header>

        {/* --- Main --- */}
        {this.state.mainComponentIsRendering ?
          <View style={styles.spinnerView}>
            <Spinner />
          </View>
          :
          <Content style={styles.content}>
            <ExceptionalInfos title={exceptionalInfo.title} text={exceptionalInfo.text} />

            {/* --- Main content --- */}

            <ProgramSingleDayView
              titleColor={TITLES_COLOR[0]}
              title={day1Title}
              dayEventList={programme.day1}
              goToProgramDetailedView={(progElem) => this.props.goToProgramDetailedView(progElem)}
            />

            <ProgramSingleDayView
              titleColor={TITLES_COLOR[1]}
              title={day2Title}
              dayEventList={programme.day2}
              goToProgramDetailedView={(progElem) => this.props.goToProgramDetailedView(progElem)}
            />

            <ProgramSingleDayView
              titleColor={TITLES_COLOR[2]}
              title={day3Title}
              dayEventList={programme.day3}
              goToProgramDetailedView={(progElem) => this.props.goToProgramDetailedView(progElem)}
            />


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
                    goToProgramDetailedView={() => this.props.goToProgramDetailedView(progElem)} />
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
                    goToProgramDetailedView={() => this.props.goToProgramDetailedView(progElem)} />
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
                    goToProgramDetailedView={() => this.props.goToProgramDetailedView(progElem)} />
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
    const progElem = this.props.progElem;
    const placeColor = GLOBAL.PLACES_COLOR(progElem.location);

    return (
      <CardItem style={styles.cardItem} button onPress={() => this.props.goToProgramDetailedView()} >
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
    paddingTop: (Platform.OS === 'ios') ? 5 : 8,
    paddingBottom: (Platform.OS === 'ios') ? -40 : 8,
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
    marginBottom: (Platform.OS === 'ios') ? 7 : 0,
  },
  scheduleView: {
    marginRight: (Platform.OS === 'ios') ? 12 : 8,
    // justifyContent: 'center',
    alignItems: 'center',
  },
  scheduleText: {
    fontSize: (Platform.OS === 'ios') ? 14 : 16,
    fontWeight: 'bold',
    color: 'black',
  },
  titleText: {
    flex: 1,
    flexWrap: 'wrap',
    fontSize: (Platform.OS === 'ios') ? 15 : 17,
    color: 'black',
  },
  speakerText: {
    flex: 1,
    flexWrap: 'wrap',
    marginTop: 5,
    fontSize: (Platform.OS === 'ios') ? 15 : 15,
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
    marginTop: (Platform.OS === 'ios') ? 12 : 12,
  },
  locationView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  locationIcon: {
    fontSize: (Platform.OS === 'ios') ? 16 : 16,
    marginRight: 5,
  },
  locationText: (Platform.OS === 'ios') ? {
    flex: 1,
    color: "rgba(86,86,86,1)",
    fontSize: 12,
  }
    :
    {
      flex: 1,
    },
  typeText: (Platform.OS === 'ios') ? {
    flex: 1,
    textAlign: 'right',
    marginLeft: 20,
    // flexWrap: 'wrap',
    fontStyle: 'italic',
    color: "rgba(86,86,86,1)",
    fontSize: 12,
  }
    :
    {
      flex: 1,
      textAlign: 'right',
      marginLeft: 20,
      // flexWrap: 'wrap',
      fontStyle: 'italic',
    },


  /* --- Expo permanente --- */
  expoPermaLocationView: {
    marginTop: (Platform.OS === 'ios') ? 10 : 8,
  },
  expoPermaOrganizerText: (Platform.OS === 'ios') ? {
    color: "rgba(86,86,86,1)",
    fontSize: (Platform.OS === 'ios') ? 13 : 15,
    marginTop: 4,
  }
    :
    {
      fontSize: 15,
      marginTop: 4,
    }
  ,

});


ProgramMainScene.propTypes = propTypes;

export default ProgramMainScene;