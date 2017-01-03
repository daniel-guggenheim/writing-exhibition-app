
import React, { Component } from 'react';
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

export default class Actualites extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      articles: [],
      last_update: 'never',
    }
  }

  componentDidMount() {
    var that = this;
    this.fetchArticlesFromWeb();
  }

  fetchArticlesFromWeb() {
    // Set loading to true when the fetch starts to display a Spinner
    this.setState({
      loading: true
    });
    var that = this;

    return fetch('https://salonecriture.firebaseio.com/posts.json')
      .then((response) => response.json())
      .then((responseJson) => {
        // console.log(responseJson);
        that.setState({
          articles: responseJson,
          loading: false,
        });
        // console.log('Next------------------');
        // console.log(this.state.articles[0].author);
      })
      .catch((error) => {
        that.setState({
          loading: false
        });
        console.error(error);
      })
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
    return (

      <Container theme={myTheme}>
        <Header>
          <Button transparent disabled>
            <Image resizeMode={"contain"} style={{ width: 35 }} source={logo_icon} />
          </Button>
          <Title>Actualités</Title>
          <Button transparent onPress={() => this.fetchArticlesFromWeb()}>
            <Icon name='ios-refresh' />
          </Button>
        </Header>

        <Content>
          {this.state.loading ? <Spinner /> : <List dataArray={this.state.articles} renderRow={(article) =>
            <ListItem button onPress={() => Actions.actualitesDetails({ article: article })}>
              <View>
                <View style={styles.categoryAndDate}>
                  <View style={styles.categoryWithSquare}>
                    <Icon name='ios-square' style={[styles.categorySquare, { color: GLOBAL.ACTUALITES_COLOR[article.category] }]} />
                    <Text style={styles.category}>{GLOBAL.ACTUALITES_CATEGORY[article.category]}</Text>
                  </View>
                  <Text style={styles.date}>{this.getFormatedDate(article.date)}</Text>
                </View>
                <View>
                  <Text style={styles.titreArticle}>{article.title}</Text>
                  <Text style={styles.introArticle} numberOfLines={3}>{article.intro}</Text>
                </View>
              </View>
            </ListItem>
          } />}
        </Content>

        <Footer>
          <FooterTab>
            <Button transparent disabled>
              <Icon name='ios-cafe' />
              Actualités
            </Button>

            <Button transparent onPress={Actions.programmeSalon}>
              <Icon name='ios-list-box-outline' />
              <Text>Programme</Text>
            </Button>

            <Button transparent onPress={Actions.plans}>
              <Icon name='ios-map-outline' />
              Plan des sites
            </Button>

            <Button transparent onPress={Actions.informationsPratiques}>
              <Icon name='ios-information-circle-outline' />
              <Text>Informations</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
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
});