import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';


const ACTIVE_COLOR = [0, 34, 102];
const PASSIVE_COLOR = [189, 195, 199];
const rgb_color = (colArray) => `rgb(${colArray[0]}, ${colArray[1]}, ${colArray[2]})`;


const MainTabBar = React.createClass({
    tabIcons: [],

    propTypes: {
        goToPage: React.PropTypes.func,
        activeTab: React.PropTypes.number,
        tabs: React.PropTypes.array,
    },

    componentDidMount() {
        this._listener = this.props.scrollValue.addListener(this.setAnimationValue);
    },

    setAnimationValue({ value, }) {
        this.tabIcons.forEach((icon, i) => {
            const progress = Math.min(1, Math.abs(value - i))
            icon.setNativeProps({
                style: {
                    color: this.iconColor(progress),
                },
            });
        });
    },

    iconColor(progress) {
        var exportColor = [0, 0, 0]
        for (i = 0; i < 3; i++) {
            exportColor[i] = ACTIVE_COLOR[i] + (PASSIVE_COLOR[i] - ACTIVE_COLOR[i]) * progress
        }
        return rgb_color(exportColor);
    },

    render() {
        return <View style={[styles.tabs, this.props.style,]}>
            {this.props.tabs.map((tab, i) => {
                return (
                    <TouchableOpacity key={tab} style={styles.tab} onPress={() => this.props.goToPage(i)}>
                        <Icon
                            name={tab}
                            size={30}
                            color={this.props.activeTab === i ? rgb_color(ACTIVE_COLOR) : rgb_color(PASSIVE_COLOR)}
                            ref={(icon) => { this.tabIcons[i] = icon; }}
                        />
                    </TouchableOpacity>
                );
            })}
        </View>;
    },
});

const styles = StyleSheet.create({
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 10,
    },
    tabs: {
        height: 45,
        flexDirection: 'row',
        backgroundColor: '#E8E0C5',
        paddingTop: 5,
        borderWidth: 1,
        borderBottomWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderTopColor: 'rgba(0,0,0,0.05)',

    },
});

export default MainTabBar;