
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
} from 'react-native';
import { Footer, FooterTab, Spinner, Text, View, Content, Container, Header, Title, Button, Icon, InputGroup, Input, ListItem, List, Radio, CheckBox, Thumbnail, Card, CardItem, H3 } from 'native-base';
import { Actions } from 'react-native-router-flux'
import * as firebase from 'firebase';

var GLOBAL = require('../global/GlobalVariables');

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD9rNtqgOaqVsyIKXRqlTl2xcFV5oTU_-U",
  authDomain: "salonecriture.firebaseapp.com",
  databaseURL: "https://salonecriture.firebaseio.com",
  storageBucket: "salonecriture.appspot.com",
};
const firebaseApp = firebase.initializeApp(firebaseConfig);





export default class Actualites extends Component {
  constructor(props) {
    super(props);
    this.state = {
      radio1: true,
      check1: false,
      modalVisible: false,
      search: 'nativebase',
      selectedItem: undefined,
      results: {
        articles: []
      }
    }
    this.itemsRef = this.getRef();

  }
  
  getRef() {
    return firebaseApp.database().ref();
  }



  listenForItems(itemsRef) {
    console.log('starting listen for items');
    console.log(itemsRef.child('articles').toString());
    try{
    itemsRef.child('articles').on('value', (snap) => {
      console.log('itemsref on value')

      // get children as an array
      var items = [];
      snap.forEach((child) => {
        items.push(child.val());
      });
      this.setState({
        results: items
      });

    });
     } catch (error) {
        console.log(error.toString())
    }
  }



  componentDidMount() {

    var that = this;
    this.search();

  }

  search() {
    // Set loading to true when the search starts to display a Spinner
    this.setState({
      loading: true
    });
    var that = this;
    // this.listenForItems(this.itemsRef);
    // var articles = require('../json/salonEcritureNewsExample2.json');
    // that.setState({
    //   // results: articles,
    //   loading: false
    // });

    return fetch('https://salonecriture.firebaseio.com/articles.json')
    .then((response) => response.json())
    .then((responseJson) => {
      // console.log(responseJson);
      that.setState({
        results: responseJson,
        loading:false,
      });
      console.log('Next------------------');
      console.log(this.state.results[0].author);
    })
    .catch((error) => {
      that.setState({
        loading: false
      });
      console.error(error);
    })
  //   try{
  //   site = this.itemsRef.child('articles')+'.json';
  //   console.log('website: '+site)
  //   aa = fetch(site)
  //   console.log('fetched website')
  //   bb= aa.json()
  //   // console.log(bb)
  // } catch (error) {
  //       console.log(error.toString())
  //   }
    // return fetch('https://api.github.com/search/repositories?q=' + this.state.search)
    //   .then((response) => response.json())
    //   .then((responseJson) => {
    //     // Store the results in the state variable results and set loading to 
    //     // false to remove the spinner and display the list of repositories
    //     that.setState({
    //       results: responseJson,
    //       loading: false
    //     });

    //     return responseJson.Search;
    //   })
    //   .catch((error) => {

    //     that.setState({
    //       loading: false
    //     });

    //     console.error(error);
    //   });
  }


  render() {
    return (

      <Container>
        <Header>
          <Title>Actualités</Title>

        </Header>

        <Content>
          <Text>Hello actualites</Text>
          <Button onPress={() => Actions.actualitesDetails({ article: 'Un article interessant' })}>Un article intéressant</Button>

          {this.state.loading ? <Spinner /> : <List dataArray={this.state.results} renderRow={(article) =>
            <ListItem button onPress={() => Actions.actualitesDetails({ article: article })}>
              <View style={{ flex:1 }}>
                <View style={styles.categoryAndDate}>
                  <Text note style={{ textAlign: 'left' }}>{GLOBAL.CATEGORY_TYPES[article.category]}</Text>
                  <Text note style={{ textAlign: 'right' }}>{article.date}</Text>
                </View>
                <View>
                <Text style={{ fontWeight: '600', color: 'blue' }}>{article.title}</Text>
                <Text style={{ color: '#007594' }}>{article.intro}</Text>
                </View>
              </View>
            </ListItem>
          } />}
        </Content>

        <Footer>
          <FooterTab>
            <Button disabled>
              <Icon name='ios-cafe' />
              Actualités
            </Button>

            <Button transparent onPress={Actions.programmeSalon} style={{ textAlign: 'center' }}>
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  categoryAndDate: {
    flex:1,
    flexDirection:'row',
    justifyContent: 'space-between',
    // backgroundColor:'green',
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