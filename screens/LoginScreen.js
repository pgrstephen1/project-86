import * as React from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from "react-native";
import firebase from "firebase";
import * as Font from "expo-font";

let customFOnts = {
  "Bubblegum-Sans":require("../assets/font/BubblegumSans-Regular.ttf")
};

export default class LoginScreen extends Component{
  constructor(props){
    super(props);
    this.state ={
      fontsLoaded:false
    };
    }
  

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({fontsLoaded:true});
  }

  componentDidMount(){
    this.checkIfLoggedIn();
    this._loadFontsAsync();
}
    signinWithGoogleAsync = async()=>{
        try{
            const result =await this.signinWithGoogleAsync.logInAsync({
                behaviour:"web",
                androidClientId:
                "552106495877-mghj2p4qkamtqgtb8ck7ka90g75oonsb.apps.googleusercontent.com",
                iosClientId:
                "552106495877-71d7g6og0pvdntmdv34f954a3q4stblv.apps.googleusercontent.com",
                scopes:['profile','email'],
            });
        }
    }
    
    isUserEqual = (googleUser, firebaseUser) => {
        if (firebaseUser) {
          var providerData = firebaseUser.providerData;
          for (var i = 0; i < providerData.length; i++) {
            if (
              providerData[i].providerId ===
                firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
              providerData[i].uid === googleUser.getBasicProfile().getId()
            ) {
              // We don't need to reauth the Firebase connection.
              return true;
            }
          }
        }
        return false;
      };
    
      onSignIn = googleUser => {
        // We need to register an Observer on Firebase Auth to make sure auth is initialized.
        var unsubscribe = firebase.auth().onAuthStateChanged(firebaseUser => {
          unsubscribe();
          // Check if we are already signed-in Firebase with the correct user.
          if (!this.isUserEqual(googleUser, firebaseUser)) {
            // Build Firebase credential with the Google ID token.
            var credential = firebase.auth.GoogleAuthProvider.credential(
              googleUser.idToken,
              googleUser.accessToken
            );
    
            // Sign in with credential from the Google user.
            firebase
              .auth()
              .signInWithCredential(credential)
              .then(function(result) {
                if (result.additionalUserInfo.isNewUser) {
                  firebase
                    .database()
                    .ref("/users/" + result.user.uid)
                    .set({
                      gmail: result.user.email,
                      profile_picture: result.additionalUserInfo.profile.picture,
                      locale: result.additionalUserInfo.profile.locale,
                      first_name: result.additionalUserInfo.profile.given_name,
                      last_name: result.additionalUserInfo.profile.family_name,
                      current_theme: "dark"
                    })
                    .then(function(snapshot) {});
                }
              })
              .catch(error => {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
                // ...
              });
          } else {
            console.log("User already signed-in Firebase.");
          }
        });
      };

    checkIfLoggedIn =()=>{
        firebase.auth().onAuthStateChanged((user)=>{
            if(user){
                this.props.navigation.navigate('DashboardScreen')
            } else {
                this.props.navigation.navigate('LoginScreen')
            }
        })
    }
    render(){
        return(
          if (!this.state.fontsLoaded) {
            return <AppLoading />;
          } else {
            return (
              <View style={styles.container}>
                <SafeAreaView style={styles.droidSafeArea} />
                <View style={styles.appTitle}>
                  <Image
                    source={require("../assets/logo.png")}
                    style={styles.appIcon}
                  ></Image>
                  <Text style={styles.appTitleText}>{`Storytelling\nApp`}</Text>
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => this.signInWithGoogleAsync()}
                  >
                    <Image
                      source={require("../assets/google_icon.png")}
                      style={styles.googleIcon}
                    ></Image>
                    <Text style={styles.googleText}>Sign in with Google</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.cloudContainer}>
                  <Image
                    source={require("../assets/cloud.png")}
                    style={styles.cloudImage}
                  ></Image>
                </View>
              </View>
            );
          }
        );
    }
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#15193c"
  },
  droidSafeArea: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35)
  },
  appTitle: {
    flex: 0.4,
    justifyContent: "center",
    alignItems: "center"
  },
  appIcon: {
    width: RFValue(130),
    height: RFValue(130),
    resizeMode: "contain"
  },
  appTitleText: {
    color: "white",
    textAlign: "center",
    fontSize: RFValue(40),
    fontFamily: "Bubblegum-Sans"
  },
  buttonContainer: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    width: RFValue(250),
    height: RFValue(50),
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    borderRadius: RFValue(30),
    backgroundColor: "white"
  },
  googleIcon: {
    width: RFValue(30),
    height: RFValue(30),
    resizeMode: "contain"
  },
  googleText: {
    color: "black",
    fontSize: RFValue(20),
    fontFamily: "Bubblegum-Sans"
  },
  cloudContainer: {
    flex: 0.3
  },
  cloudImage: {
    position: "absolute",
    width: "100%",
    resizeMode: "contain",
    bottom: RFValue(-5)
  }
});
