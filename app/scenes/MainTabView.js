import React, { Component, PropTypes } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    NetInfo,
    Navigator,
    TouchableHighlight,
    ScrollView,
    Image,
} from 'react-native';
import { Container, Header, Tabs, Title, Content, Footer, FooterTab, Button, Icon, Spinner } from 'native-base';

import Actualites from './Actualites';
import ProgrammeSalon from './ProgrammeSalon';
// import Plans from 'Plans';
import InformationsPratiques from './InformationsPratiques';
import MainTabBar from '../components/MainTabBar';
// import ActualitesDetails from 'ActualitesDetails';

import ScrollableTabView, { DefaultTabBar, } from 'react-native-scrollable-tab-view';



const propTypes = {
    articlesActualites: React.PropTypes.arrayOf(
        React.PropTypes.shape({
            article_url: PropTypes.string,
            author: PropTypes.string,
            category: PropTypes.number,
            created_at: PropTypes.string,
            date: PropTypes.string,
            intro: PropTypes.string,
            title: PropTypes.string,
            updated_at: PropTypes.string,
        }
        )).isRequired,
    fetchArticlesFromWeb: React.PropTypes.func.isRequired,
    infosPratiquesStrings: React.PropTypes.shape({
        last_update: PropTypes.string,
        text1_dates: PropTypes.string,
        text2_horaires: PropTypes.string,
        lieux: React.PropTypes.arrayOf(
            React.PropTypes.shape({
                addr1: PropTypes.string,
                name: PropTypes.string,
                gps_addr: PropTypes.string,
            }
            )),
    }).isRequired,
    actualiteArticlesIsLoading: React.PropTypes.bool.isRequired,
    goToActualitesDetails: React.PropTypes.func.isRequired,
};

const defaultProps = {
    text: 'Hello World',
};


class MainTabView extends Component {
    render() {
        return (
            <ScrollableTabView
                style={{}}
                initialPage={1}
                renderTabBar={() => <MainTabBar />}
                tabBarPosition='bottom'
                tabBarBackgroundColor={'#E8E0C5'}
                initialPage={0}
            >

                <Actualites
                    tabLabel="ios-cafe"
                    articles={this.props.articlesActualites}
                    fetchArticlesFromWeb={this.props.fetchArticlesFromWeb}
                    loading={this.props.actualiteArticlesIsLoading}
                    goToActualitesDetails={this.props.goToActualitesDetails}
                />

                <ProgrammeSalon tabLabel="ios-list-box-outline" />

                <InformationsPratiques
                    tabLabel="ios-information-circle-outline"
                    textFieldsContent={this.props.infosPratiquesStrings}
                />

            </ScrollableTabView>
        );
    }
}




MainTabView.propTypes = propTypes;
MainTabView.defaultProps = defaultProps;

export default MainTabView;
