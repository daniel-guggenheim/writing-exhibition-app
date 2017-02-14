

//require native base etc //default prop etc etc

class UpdateSpinner extends Component {

    render() {
        return (
            <View>
                {this.props.loading ?
                    <View style={styles.loadingContent}>
                        <Text>Mise-à-jour</Text>
                        <ActivityIndicator style={styles.spinner} />
                    </View>
                    : null
                }
            </View>
        );
    }



}



const styles = StyleSheet.create({
    loadingContent: {
        alignItems: 'center',
        marginBottom: 8,
    },
});