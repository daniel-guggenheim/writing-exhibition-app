
import React, { Component, PropTypes } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Image,
} from 'react-native';
import { Footer, FooterTab, Spinner, Text, View, Content, Container, Header, Title, Button, Icon, ListItem, List } from 'native-base';
import { Actions } from 'react-native-router-flux'
import myTheme from '../themes/myTheme';
// import * as firebase from 'firebase';

var moment = require('moment');
var GLOBAL = require('../global/GlobalVariables');

const NB_OF_LAST_DAYS_WITH_HUMANIZED_DATE = 7;
var logo_icon = require("../images/logo/logo.png");


const propTypes = {
  articlesInfo: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      category: PropTypes.string,
      date: PropTypes.string,
      id: PropTypes.number,
      intro: PropTypes.string,
      title: PropTypes.string,
    }
    )),
  articlesContent: React.PropTypes.arrayOf(PropTypes.string),
  fetchBackendToUpdateAll: React.PropTypes.func.isRequired,
  loading: React.PropTypes.bool.isRequired,
  goToActualitesDetails: React.PropTypes.func.isRequired,
};


const defaultProps = {
  articlesInfo: [],
  articlesContent: [],
};


class Actualites extends Component {
  constructor(props) {
    super(props);
    this.state = {
      last_update: 'never',
    }
  }

  getFormatedDate(strDate) {
    var momentDate = moment(strDate, "DD.MM.YYYY");
    var diffInDays = moment().diff(momentDate, 'days');
    // console.log(strDate + " ==> " + moment().diff(momentDate, 'days'));
    if (diffInDays == 0) {
      return "Aujourd'hui";
    } else if (diffInDays == 1) {
      return "Hier";
    } else if (diffInDays > 1 && diffInDays < 7) {
      return "Il y a " + diffInDays + " jours";
    } else if (diffInDays >= 7 && diffInDays < 10) {
      return "Il y a une semaine"
    } else {
      return strDate;
    }
  }



  render() {
    let articles = this.props.articlesInfo;
    let articlesHTML = this.props.articlesContent;

    return (
      <Container theme={myTheme}>
        <Header>
          <Button transparent disabled>
            <Image resizeMode={"contain"} style={{ width: 35 }} source={logo_icon} />
          </Button>
          <Title>Actualités</Title>
          <Button transparent onPress={() => this.props.fetchBackendToUpdateAll()}>
            <Icon name='ios-refresh' />
          </Button>
        </Header>

        <Content>
          {this.props.loading ?
            <View style={styles.spinnerView}><Spinner /></View> :
            this._renderArticlesList()}
        </Content>
      </Container>
    );
  }



  _renderArticlesList() {
    let articles = this.props.articlesInfo;
    let articlesHTML = this.props.articlesContent;

    //Test if the array is defined
    if (typeof articles != "undefined" && articles != null && articles.length > 0) {
      // Return list of articles
      return (
        <List dataArray={articles} renderRow={(article) =>
          <ListItem button onPress={() => this.props.goToActualitesDetails(article, articlesHTML[article.id])}>
            <View>
              <View style={styles.categoryAndDate}>
                <View style={styles.categoryWithSquare}>
                  {/*<Icon name='ios-square' style={[styles.categorySquare, { color: 'blue' }]} />*/}
                  <Text style={styles.category}>{article.category}</Text>
                </View>
                <Text style={styles.date}>{this.getFormatedDate(article.date)}</Text>
              </View>
              <View>
                <Text style={styles.titreArticle}>{article.title}</Text>
                <Text style={styles.introArticle} numberOfLines={3}>{article.intro}</Text>
              </View>
            </View>
          </ListItem>
        } />
      );

    } else {
      //A page with an empty list of articles.
      return (
        <View style={styles.emptyArticlesView}>
          <Text style={styles.emptyArticlesText}>Connectez-vous à Internet pour télécharger les derniers articles.</Text>
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
}

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
    // backgroundColor:'yellow',
  },
  categorySquare: {
    // color:'red',
    fontSize: 10,
    marginRight: 5,
    marginTop: 5,
  },
  category: {
    // fontStyle: 'italic',
    color: '#5A5D5E',
    fontSize: 14,
    // backgroundColor:'orange',
  },
  date: {
    fontSize: 14,
  },
  titreArticle: {
    marginTop: 7,
    fontSize: 17,
    fontWeight: 'bold',
  },
  introArticle: {

  },


  //Empty articles view:
  emptyArticlesView: {
    // justifyContent: 'center',
    // alignItems: 'center',
    // flex: 1,
    // backgroundColor: 'orange',
    // textAlign:'center',
    // flexDirection: 'row',

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