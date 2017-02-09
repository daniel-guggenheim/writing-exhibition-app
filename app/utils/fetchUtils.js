/**
 * Check if there is updated text content on the internet and fetch it to the device.
 */
// export async function fetchUpdateContent() {
//     var that = this;
//     try {
//         let newLastServerUpdateDate = await that.fetchJsonURL(URL_LAST_SERVER_UPDATE_INFOS_PRATIQUES);
//         console.log('last online update = ' + newLastServerUpdateDate);
//         if (newLastServerUpdateDate != that.state.lastServerUpdateDate) {
//             that.setState({ loadingContentUpdate: true })
//             let newContent = await that.fetchJsonURL(INFO_PRATIQUE_TEXT_CONTENT_URL);
//             let now = Date.now();

//             //Store data in local db
//             await AsyncStorage.multiSet([
//                 [INFO_PRATIQUE_STORAGE_KEY, JSON.stringify(newContent)],
//                 [LAST_CHECK_FOR_ONLINE_UPDATE_STORAGE_KEY, JSON.stringify(now)]]);

//             //Update date and data
//             that.setState({
//                 lastServerUpdateDate: newLastServerUpdateDate,
//                 lastCheckForOnlineUpdate: now,
//                 infosPratiquesStrings: newContent,
//                 loadingContentUpdate: false,
//             });
//         }
//     } catch (error) {
//         that.setState({ loadingContentUpdate: false })
//         console.error(error);
//     }
// }




// export async function fetchArticlesFromWeb() {
//     // Set loading to true when the fetch starts to display a Spinner
//     this.setState({
//         loading: true
//     });
//     var that = this;

//     return fetch('https://salonecriture.firebaseio.com/posts.json')
//         .then((response) => response.json())
//         .then((responseJson) => {
//             // console.log(responseJson);
//             that.setState({
//                 articlesActualites: responseJson,
//                 loading: false,
//             });
//             // console.log('Next------------------');
//             // console.log(this.state.articles[0].author);
//             console.log('Finished fetching articles from the web: ', responseJson);
//         })
//         .catch((error) => {
//             that.setState({
//                 loading: false
//             });
//             console.error(error);
//         })
// }