
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    WebView
} from 'react-native';
import { Container, Header, Tabs, Title, Content, Footer, FooterTab, Button, Icon } from 'native-base';
import { Actions } from 'react-native-router-flux'
import myTheme from '../themes/myTheme';
var HTMLView = require('react-native-htmlview')

var GLOBAL = require('../global/GlobalVariables');
const TITLE_MAX_CHAR_LIMIT = 40;


/*
Charger la page et enlever le dessus => marche pas, la page devrait etre chargee en entier dabord
charger lapage deja coupée dans le json et la lire

*/

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

    renderSourceIfExists(article) {
        if (article.source != "") {
            return (
                <View>
                    <View style={styles.separator} />
                    <Text style={styles.text}>Sources:</Text>
                    <HTMLView value={article.source} stylesheet={styles} />
                </View>
            );
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
                    <Title><Text style={styles.headerTitle}>{this.get_title_string()}</Text></Title>
                </Header>

                <View style={styles.main}>
                    <WebView
                        //source={{ uri: article.article_url }}
                        source={{ html: article.author }}
                        // source={ require('../static/html/actualites-test2.html')}
                        style={{ borderWidth: 1, flex: 1 }}
                        // scalesPageToFit={true}                     
                        renderError={() => (
                            <View  style={styles.pageError}>
                                <Text style={styles.textPageError}>
                                    Toutes nos excuses, il semble qu'une erreur a eu lieu au chargement de l'article...
                                </Text>
                            </View>)}
                        />
                </View>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    headerTitle: {
        fontSize: 15,
    },
    main: {
        // margin: 10,
        // marginTop: 12,
        marginBottom: 3,
        flex: 1,
    },
    pageError: {
        margin:10,
    },
    textPageError: {
        color: 'red',
        fontSize: 16,
    },
    text: {
        color: 'black'
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
        color: 'black',
        fontSize: 14,
        // backgroundColor:'orange',
    },
    date: {
        fontSize: 15,
        color: 'black'
    },
    titreArticle: {
        marginTop: 12,
        marginBottom: 12,
        fontSize: 19,
        fontWeight: 'bold',
        color: 'black',
        // textAlign:'center',
    },
    introArticle: {
        marginBottom: 5,
        color: 'black',
    },
    author: {
        textAlign: 'right',
        color: 'black',
        fontStyle: 'italic',
        marginTop: 10,
    },
    separator: {
        marginTop: 15,
        marginBottom: 8,
        height: 1,
        backgroundColor: 'black',
        marginLeft: 30,
        marginRight: 30,
    },
    h2: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'black',
        marginTop: 5,
    },
    ul: {
        marginBottom: 10,
        color: 'black',
    },
    p: {
        color: 'black',
    },
    li: {
        color: 'black',
    },
    b: {
        color: 'black',
        fontWeight: 'bold',
    },
    em: {
        color: 'black',
        fontStyle: 'italic',
    },
});