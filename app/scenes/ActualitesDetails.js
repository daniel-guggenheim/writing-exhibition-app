
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { Container, Header, Tabs, Title, Content, Footer, FooterTab, Button, Icon } from 'native-base';
import { Actions } from 'react-native-router-flux'
import myTheme from '../themes/myTheme';

var GLOBAL = require('../global/GlobalVariables');
const TITLE_MAX_CHAR_LIMIT = 30;

export default class Actualites extends Component {
    constructor(props) {
        super(props);
    }

    get_title_string() {
        var title = this.props.article.title;
        if (title.length > TITLE_MAX_CHAR_LIMIT) {
            return ((title.substring(0, TITLE_MAX_CHAR_LIMIT - 3)) + '...');
        } else {
            return title;
        }
    }

    render() {
        var article = this.props.article;
        return (

            <Container theme={myTheme}>
                <Header>
                    <Button transparent onPress={() => Actions.pop()}>
                        <Icon name='ios-arrow-back' />
                    </Button>
                    <Title><Text>{this.get_title_string()}</Text></Title>
                </Header>

                <Content>
                    <View style={styles.main}>
                        <View style={styles.categoryAndDate}>
                            <View style={styles.categoryWithSquare}>
                                <Icon name='ios-square' style={[styles.categorySquare, { color: GLOBAL.ACTUALITES_COLOR[article.category] }]} />
                                <Text style={styles.category}>{GLOBAL.ACTUALITES_CATEGORY[article.category]}</Text>
                            </View>
                            <Text style={styles.date}>{article.date}</Text>
                        </View>
                        <View>
                            <Text style={styles.titreArticle}>{article.title}</Text>
                            <Text style={styles.introArticle}>{article.intro}</Text>
                            <Text style={styles.introArticle}>{article.content}</Text>
                        </View>
                    </View>
                </Content>

            </Container>
        );
    }
}

const styles = StyleSheet.create({
    titleHeader: {
        color: 'red',
    },
    main: {
        margin:10,
        marginTop:12,
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
        fontSize: 7,
        marginRight: 5,
        marginTop: 0,
    },
    category: {
        // fontStyle: 'italic',
        color: '#5A5D5E',
        fontSize: 14,
        // backgroundColor:'orange',
    },
    date: {
        fontSize: 15,
    },
    titreArticle: {
        marginTop: 10,
        marginBottom:12,
        fontSize: 19,
        fontWeight: 'bold',
        // textAlign:'center',
    },
    introArticle: {
        marginBottom:5,
    },
});