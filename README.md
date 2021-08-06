# Mobile App: Art of Writing Exhibition 
Development of an app in React Native for the "[Salon International de l'Ecriture](https://www.salonecriture.org/)" (an international exhibition on the art of writing). The app shows the weekly news, the program of the event and some information about it. It is made to fully work online and offline.

<p float="left">
  <img src=".github/screenshot_app1.png" width="250" alt="screenshot of the mobile app">
  <img src=".github/screenshot_app2.png" width="250" alt="screenshot of the mobile app">
</p>


This app can be downloaded on <a href="https://play.google.com/store/apps/details?id=com.salonecritureapp">Google Play</a> and the <a href="https://itunes.apple.com/us/app/salonecriture/id1210470736?mt=8">App Store</a>.

## Setup

1. Clone the repo
2. Go to the root of the project
3. Install the dependencies
  ```
  $ npm install
  ```

4. Run the app
  ```
  $ react-native run-android
  $ react-native run-ios
  ```

## Backend
The app communicates with a REST API hosted on Firebase.

The app is working will all functionalities offline, and when online will check at the endpoint if the online version is newer. If any update can be found, the local data will be refreshed with data from the endpoint. Only the outdated data is downloaded, not the whole app data. This was done to preserve mobile data of the user.
