
import React, { Component, PropTypes } from 'react';
import {
    StyleSheet,
    Text,
    View,
    WebView,
    BackAndroid
} from 'react-native';
import { Spinner, Container, Header, Title, Content, Button, Icon } from 'native-base';
import myTheme from '../themes/myTheme';

var GLOBAL = require('../global/GlobalVariables');

const propTypes = {
    article_infos: React.PropTypes.shape({
        category: PropTypes.string,
        date: PropTypes.string,
        id: PropTypes.number,
        intro: PropTypes.string,
        title: PropTypes.string,
    }).isRequired,
    article_html: PropTypes.string.isRequired,
};

const defaultProps = {
};

class ActualitesDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            start: true,
        };
    }

    componentDidMount() {
        //Add android back button listener
        BackAndroid.addEventListener('hardwareBackPress', this._handleAndroidBackButton);
        this.setState({ start: false });
    }

    componentWillUnmount() {
        //Remove android back button listener
        BackAndroid.removeEventListener('hardwareBackPress', this._handleAndroidBackButton);
    }

    _handleAndroidBackButton = () => {
        this.props.goBackOneScene();
        return true;
    }

    render() {
        let article = this.props.article_infos;
        let article_html = this.props.article_html;
        console.log('Article: ', article.title);

        return (
            <Container theme={myTheme}>
                <Header>
                    <Button transparent onPress={() => this.props.goBackOneScene()}>
                        <Icon name='ios-arrow-back' style={{color:GLOBAL.TEXT_THEME_COLOR}} />
                    </Button>
                    <Title>Actualités</Title>
                </Header>

                <View style={styles.main}>
                    {this.state.start ? <Spinner /> :
                        <WebView
                            source={{ html: article_html }}
                            style={{ borderWidth: 1, flex: 1 }}
                            //scalesPageToFit={true}
                            renderError={() => (
                                <View style={styles.pageError}>
                                    <Text style={styles.textPageError}>
                                        Il semble qu'une erreur s'est produite au chargement de l'article...
                                    </Text>
                                </View>)
                            }
                        />
                    }
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

ActualitesDetails.propTypes = propTypes;
ActualitesDetails.defaultProps = defaultProps;

export default ActualitesDetails;