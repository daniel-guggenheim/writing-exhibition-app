'use strict';

import React, { Component, PropTypes } from 'react';
import { Platform, StyleSheet, Text, View, Image, } from 'react-native';
import { Container, Header, Title, Content, Button, Spinner } from 'native-base';

import ExceptionalInfos from '../../components/ExceptionalInfos';
import ProgramSingleDayView from './ProgramSingleDayView';

import myTheme from '../../themes/myTheme';

import jsonDefaultContent from '../../json/programme_default.json';

const logo_icon = require("../../images/logo/logo.png");

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
 * The component for a single day is the ProgramSingleDayView, which takes a list of 
 * events/activities that happened during the day and display them in a "cardview".
 * 
 * The format of the received data from the backend (the props {programmeContent} ) is:
 * Each day of the event is linked to an array of objects, where each one contains the information
 * about a specific event/activity happening during the day. For example, day1 could contain an
 * array of 2 objects, and each object will contain the information about its specific activity
 * (such as its title, the location, the schedule, etc...).
 * The same format will be applied the permanent exhibition (expos_permanentes).
 * Additionnaly, there will be a list of title which are the titles of each day, and the
 * exceptional_infos variable which will contain information that should be shown at the top of
 * the view.
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

    const exceptionalInfo = programme.exceptional_infos;
    const daysList = [programme.day1, programme.day2, programme.day3];

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
        {/* Shows a spinner if the main content has not been rendered yet */}
        {this.state.mainComponentIsRendering ?
          <View style={styles.spinnerView}>
            <Spinner />
          </View>
          :
          <Content style={styles.content} >
            <ExceptionalInfos title={exceptionalInfo.title} text={exceptionalInfo.text} />

            {/* --- Displays the program for each day --- */}
            {(daysList).map((day, i) => {
              return (
                <ProgramSingleDayView
                  key={programme.titles[i]}
                  titleColor={TITLES_COLOR[i]}
                  title={programme.titles[i]}
                  dayEventList={day}
                  goToProgramDetailedView={(progElem) => this.props.goToProgramDetailedView(progElem)}
                />
              );
            })}

            {/* --- Displays the list of exhibitions --- */}
            <ProgramSingleDayView
              titleColor={TITLES_COLOR[3]}
              title={programme.titles[3]}
              dayEventList={programme.expos_permanentes}
              isExhibition={true}
              style={{ marginBottom: 16 }}
            />
          </Content>
        }
      </Container >
    );
  }
}

const styles = StyleSheet.create({
  content: {
    paddingTop: (Platform.OS === 'ios') ? 5 : 8,
    paddingBottom: (Platform.OS === 'ios') ? -40 : 8,
    paddingRight: 8,
    paddingLeft: 8,
  },
  spinnerView: {
    alignItems: 'center',
  },
});


ProgramMainScene.propTypes = propTypes;

export default ProgramMainScene;