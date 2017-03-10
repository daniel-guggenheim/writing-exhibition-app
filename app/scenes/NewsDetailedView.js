'use strict';

import React, { Component, PropTypes } from 'react';
import { BackAndroid, Platform, StyleSheet, Text, View, WebView, } from 'react-native';
import { Spinner, Container, Header, Title, Content, Button, Icon } from 'native-base';

import myTheme from '../themes/myTheme';
import GLOBAL from '../global/GlobalVariables';

const propTypes = {
    article_infos: PropTypes.shape({
        category: PropTypes.string,
        date: PropTypes.string,
        id: PropTypes.number,
        intro: PropTypes.string,
        title: PropTypes.string,
    }).isRequired,
    article_html: PropTypes.string.isRequired,
};

/**
 * Webview showing an article. It will take the html given in props and show it 
 * in the webview.
 */
class NewsDetailedView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            start: true,
        };
    }

    componentDidMount() {
        //Add android back button listener
        if (Platform.OS === 'android') {
            BackAndroid.addEventListener('hardwareBackPress', this._handleAndroidBackButton);
        }
    }

    componentWillUnmount() {
        //Remove android back button listener
        if (Platform.OS === 'android') {
            BackAndroid.removeEventListener('hardwareBackPress', this._handleAndroidBackButton);
        }
    }

    /**
     * Activate the back button on android
     */
    _handleAndroidBackButton = () => {
        this.props.goBackOneScene();
        return true;
    }

    render() {
        let article_html = this.props.article_html;

        return (
            <Container theme={myTheme}>
                <Header>
                    <Button transparent onPress={() => this.props.goBackOneScene()}>
                        <Icon name='ios-arrow-back' style={{ color: GLOBAL.TEXT_THEME_COLOR }} />
                    </Button>
                    <Title>Actualités</Title>
                </Header>

                <View style={styles.main}>
                    <WebView
                        source={{ html: article_html }}
                        style={{ borderWidth: 1, flex: 1 }}
                        renderError={() => (
                            <View style={styles.pageError}>
                                <Text style={styles.textPageError}>
                                    Il semble qu'une erreur s'est produite au
                                    chargement de l'article...
                                </Text>
                            </View>)
                        }
                    />
                </View>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    main: {
        marginBottom: 3,
        flex: 1,
    },
    pageError: {
        margin: 10,
    },
    textPageError: {
        color: 'red',
        fontSize: 16,
    },
});

NewsDetailedView.propTypes = propTypes;

export default NewsDetailedView;