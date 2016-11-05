
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { Container, Header, Tabs, Title, Content, Footer, FooterTab, Button, Icon } from 'native-base';
import { Actions } from 'react-native-router-flux'


export default class Actualites extends Component {
    render() {
        return (

            <Container>
                <Header>
                    <Button transparent onPress={() => Actions.pop()}>
                        <Icon name='ios-arrow-back' />
                    </Button>
                    <Title>{this.props.article.title}</Title>

                </Header>

                <Content>
                <Text>{this.props.article.title}</Text>
                <Text>{this.props.article.intro}</Text>
                    <Text>{this.props.article.content}</Text>
                </Content>

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