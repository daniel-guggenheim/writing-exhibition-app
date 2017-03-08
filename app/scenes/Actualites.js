'use strict';

import React, { Component, PropTypes } from 'react';
import { Image, Platform, RefreshControl, StyleSheet, } from 'react-native';
import {
  Spinner, Text, View, Container, Header, Title, Button, List, ListItem,
} from 'native-base';

import moment from 'moment';
import 'moment/locale/fr';

import myTheme from '../themes/myTheme';
import GLOBAL from '../global/GlobalVariables';

const NB_OF_LAST_DAYS_WITH_HUMANIZED_DATE = 7;
const INTRO_MAX_NB_OF_LINE = 3;
const logo_icon = require("../images/logo/logo.png");

const propTypes = {
  // Articles data loaded from the backend
  articlesContent: PropTypes.arrayOf(PropTypes.string),
  articlesInfo: PropTypes.arrayOf(
    React.PropTypes.shape({
      category: PropTypes.string,
      date: PropTypes.string,
      id: PropTypes.number,
      intro: PropTypes.string,
      title: PropTypes.string,
    }
    )),

  // Other props
  fetchBackendToUpdateAll: PropTypes.func.isRequired,
  goToActualitesDetails: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

const defaultProps = {
  articlesInfo: [],
  articlesContent: [],
};



/**
 * Scene containing the list of articles summary. Each article summary can be clicked on
 * which will lead to a page with the complete article.
 * 
 * It will use 2 main props: articlesContent and articlesInfo.
 * - articlesInfo will contain all the useful information about an article that will be shown
 * in this view. (such as title, category, creation date, etc..)
 * - articlesContent will contain the html code of the article. It will not be shown here but will
 * be transfered to the detailed view of the article is the user click on it.
 */
class Actualites extends Component {

  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
    }
    moment.locale('fr');
  }

  render() {
    let articles = this.props.articlesInfo;
    let articlesHTML = this.props.articlesContent;

    return (
      <Container theme={myTheme}>

        <Header>
          <Button transparent disabled>
            <Image resizeMode={"contain"} style={{ width: 32 }} source={logo_icon} />
          </Button>
          <Title>Actualités</Title>
        </Header>

        {/* --- Main view: renders the loading spin or the article. --- */}
        <View>
          {this.props.loading ?
            <View style={styles.spinnerView}><Spinner /></View>
            :
            this._renderArticlesList()
          }
        </View>

      </Container>
    );
  }


  /**
   * Renders the article list, or if the articles have not loaded yet, renders a temporary view. 
   */
  _renderArticlesList() {
    let articles = this.props.articlesInfo;
    let articlesHTML = this.props.articlesContent;

    //Test if the articles have been loaded yet
    if (typeof articles != "undefined" && articles != null && articles.length > 0 &&
      typeof articlesHTML != "undefined" && articlesHTML != null && articlesHTML.length > 0 &&
      articles.length == articlesHTML.length) {

      // If it is the case, return the article list
      return (
        <List dataArray={articles}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
          renderRow={(article) =>
            <ListItem
              button
              onPress={() => this.props.goToActualitesDetails(article, articlesHTML[article.id])}
            >
              <View>
                <View style={styles.categoryAndDate}>
                  <View style={styles.categoryWithSquare}>
                    <Text style={styles.category}>
                      {article.category}
                    </Text>
                  </View>
                  <Text style={styles.date}>
                    {this._getFormatedDate(article.date)}
                  </Text>
                </View>
                <View>
                  <Text style={styles.titreArticle}>
                    {article.title}
                  </Text>
                  <Text style={styles.introArticle} numberOfLines={INTRO_MAX_NB_OF_LINE}>
                    {article.intro}
                  </Text>
                </View>
              </View>
            </ListItem>
          } />
      );

    }
    /*
    If the articles have not been loaded yet, renders a message and a reload button.
    (even if reloading is automatically done in background)
    */
    else {
      return (
        <View>
          <Text style={styles.emptyArticlesText}>
            Connectez-vous à Internet pour télécharger les derniers articles.
          </Text>
          <Button
            success
            onPress={() => this.props.fetchBackendToUpdateAll()}
            style={styles.emptyArticlesButton}>
            Rafraîchir la page
          </Button>
        </View>
      );
    }
  }


  /**************************  USEFUL METHODS  **************************/

  /**
  * Activates the refresh of the page. It will load the procedure to update all the article list.
  */
  _onRefresh() {
    this.setState({ refreshing: true });
    this.props.fetchBackendToUpdateAll()
      .then(() => {
        this.setState({ refreshing: false });
      })
      .catch((error) => {
        console.log('Error while refreshing data in articles actualites.');
        this.setState({ refreshing: false });
      });
  }


  /**
   * Parse and transform a date in a nice format to read.
   * @param {String} strDate : A string in a date format (YYYY-MM-DD).
   * @return {String} : The date formated to be visually nice
   */
  _getFormatedDate(strDate) {
    let momentDate = moment(strDate, "YYYY-MM-DD", true);
    if (!momentDate.isValid()) {
      return "Date indisponible";
    }

    // For the last week, get a nicer format. 
    let diffInDays = moment().diff(momentDate, 'days');
    if (diffInDays == 0) {
      return "Aujourd'hui";
    } else if (diffInDays == 1) {
      return "Hier";
    } else if (diffInDays > 1 && diffInDays < 7) {
      return "Il y a " + diffInDays + " jours";
    } else if (diffInDays >= 7 && diffInDays < 10) {
      return "Il y a une semaine"
    } else {
      return momentDate.format("D MMM YYYY");
    }
  }
}


/**************************  STYLESHEET  **************************/

const styles = StyleSheet.create({
  spinnerView: {
    alignItems: 'center',
  },
  categoryAndDate: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryWithSquare: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categorySquare: {
    marginRight: 5,
    marginTop: 5,
    fontSize: 10,
  },
  category: {
    color: '#5A5D5E',
    fontSize: (Platform.OS === 'ios') ? 13 : 14,
  },
  date: {
    fontSize: (Platform.OS === 'ios') ? 13 : 14,
  },
  titreArticle: {
    marginTop: (Platform.OS === 'ios') ? 4 : 7,
    fontSize: (Platform.OS === 'ios') ? 15 : 17,
    fontWeight: 'bold',
  },
  introArticle: {
    marginTop: (Platform.OS === 'ios') ? 2 : 0,
    marginBottom: (Platform.OS === 'ios') ? 5 : 0,
  },
  emptyArticlesText: {
    marginTop: 8,
    textAlign: 'center',
  },
  emptyArticlesButton: {
    marginTop: 16,
    alignSelf: 'center',
  },
});

Actualites.propTypes = propTypes;
Actualites.defaultProps = defaultProps;

export default Actualites;