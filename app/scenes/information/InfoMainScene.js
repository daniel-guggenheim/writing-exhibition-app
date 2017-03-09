'use strict';

import React, { Component, PropTypes } from 'react';
import { Image, Linking, Platform, StyleSheet, View, } from 'react-native';
import { Button, Container, Content, Header, Spinner, Title, } from 'native-base';

// Components
import ExceptionalInfos from '../../components/ExceptionalInfos';
import InfoSchedule from './InfoSchedule';
import InfoPlaces from './InfoPlaces';
import InfoAccess from './InfoAccess';
import InfoContact from './InfoContact';
import UpdateSpinner from '../../components/UpdateSpinner';

// Themes
import myTheme from '../../themes/myTheme';

// Images
const logo_icon = require("../../images/logo/logo.png");

// Default data
import jsonDefaultContent from '../../json/infos_pratiques_default.json';


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
 * It is seperated into different "card" components.
 * A part of it is dynamic and loaded as the other components, a part of it is static
 * and coded inside each component.
 */
class InfoMainScene extends Component {

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
    // Variables initializations
    let textContent = this.props.textFieldsContent;
    if (textContent == null) {
      console.log('Infos pratiques: No data from internet, loading default content.');
      textContent = jsonDefaultContent;
    }

    let loadingContentUpdate = this.props.currentlyFetchingContent;
    let lieux = textContent.lieux;
    let exceptionalInfo = textContent.exceptional_infos;

    // Render
    return (
      <Container theme={myTheme}>

        {/* --- Header --- */}
        <Header>
          <Button transparent disabled>
            <Image resizeMode={"contain"} style={{ width: 32 }} source={logo_icon} />
          </Button>
          <Title>Informations pratiques</Title>
        </Header>

        {/* --- Main --- */}
        {this.state.mainComponentIsRendering ?
          <View style={styles.spinnerView}>
            <Spinner />
          </View>
          :
          <Content style={styles.content}>
            <UpdateSpinner loading={loadingContentUpdate} />
            <ExceptionalInfos title={exceptionalInfo.title} text={exceptionalInfo.text} />

            {/* --- Main content view --- */}
            <View style={styles.mainContentView}>
              <InfoSchedule />
              <InfoPlaces lieux={lieux} clickUrl={(lieu) => this.clickUrl(lieu)} />
              <InfoAccess clickUrl={(url) => this.clickUrl(url)} />
              <InfoContact clickUrl={(url) => this.clickUrl(url)} />
            </View>
          </Content>
        }

      </Container >

    );
  }


  /**************************  USEFUL METHODS  **************************/

  /**
   * Check if the url is supported and open it in an external app if it is the case.
   * @param {String} url : The url to open in an external app. 
   */
  clickUrl(url) {
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
}


 /**************************  STYLES  **************************/

const styles = StyleSheet.create({
  spinnerView: {
    alignItems: 'center',
  },
  content: {
    paddingTop: (Platform.OS === 'ios') ? 0 : 2,
    marginBottom: (Platform.OS === 'ios') ? -40 : 8,
    paddingRight: 8,
    paddingLeft: 8,
  },
  mainContentView: {
    marginTop: (Platform.OS === 'ios') ? 5 : 10,
  },
});


InfoMainScene.propTypes = propTypes;
InfoMainScene.defaultProps = defaultProps;

export default InfoMainScene;