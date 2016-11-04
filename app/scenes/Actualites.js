
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  } from 'react-native';
import {Footer, FooterTab, Spinner, Text, View, Content, Container, Header, Title, Button, Icon, InputGroup, Input, ListItem, List, Radio, CheckBox, Thumbnail, Card, CardItem, H3 } from 'native-base';
import { Actions } from 'react-native-router-flux'


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
        items: []
      }
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
    return fetch('https://api.github.com/search/repositories?q=' + this.state.search)
      .then((response) => response.json())
      .then((responseJson) => {
        // Store the results in the state variable results and set loading to 
        // false to remove the spinner and display the list of repositories
        that.setState({
          results: responseJson,
          loading: false
        });

        return responseJson.Search;
      })
      .catch((error) => {

        that.setState({
          loading: false
        });

        console.error(error);
      });
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

          {this.state.loading ? <Spinner /> : <List dataArray={this.state.results.items} renderRow={(item) =>
            <ListItem button onPress={() => this.setModalVisible(true, item)} >
              <Thumbnail square size={80} source={{ uri: item.owner.avatar_url }} />
              <Text>Name: <Text style={{ fontWeight: '600', color: '#46ee4b' }}>{item.name}</Text></Text>

              <Text style={{ color: '#007594' }}>{item.full_name}</Text>
              <Text note>Score: <Text note style={{ marginTop: 5 }}>{item.score}</Text></Text>
            </ListItem>
          } />}
        </Content>

        <Footer>
          <FooterTab>
            <Button disabled>
              <Icon name='ios-cafe' />
              Actualités
            </Button>
          </FooterTab>
          <FooterTab>
            <Button transparent onPress={Actions.programmeSalon}>
              <Icon name='ios-list-box-outline' />
              Programme salon
            </Button>
          </FooterTab>
          <FooterTab>
            <Button transparent onPress={Actions.informationsPratiques}>
              <Icon name='ios-information-circle-outline' />
              <Text style={{ textAlign: 'center' }}>Informations</Text>
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