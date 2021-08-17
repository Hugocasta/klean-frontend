import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";

import { connect } from "react-redux";

import { SafeAreaView } from "react-native-safe-area-context";

import { colors } from "../lib/colors";
import { windowDimensions } from "../lib/windowDimensions";
import { typography } from "../lib/typography";
import ButtonElement from "../lib/ButtonElement";
import InputElement from "../lib/InputElement";
import LogoKlean from "../assets/imagesKlean/LogoKlean.png";
import AutoComplete from "../lib/AutoComplete";

import PROXY from "../proxy";

import AsyncStorage from '@react-native-async-storage/async-storage';

function SignUp(props) {

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [listErrorSignup, setListErrorSignup] = useState([]);

  const [autoComplete, setAutoComplete] = useState([]);
  const [showAutoComplete, setShowAutoComplete] = useState(true);

  const [cityInfo, setCityInfo] = useState({});

  /* Lorsque'une recherche est faite via le champ ville, un appel est lancé au backend 
  qui communique avec l'API des adresses du gouvernement. Les résultats sont affichés via le composant Autocomplete. */
  useEffect(() => {
    async function loadData() {
      let rawResponse = await fetch(PROXY + "/autocomplete-search-city-only", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `city=${city.replace(" ", "+")}&token=${props.tokenObj.token}`,
      });
      let response = await rawResponse.json();
      setAutoComplete(response.newResponse);
    }
    if (city.length > 1) {
      loadData();
    } else {
    }
  }, [city]);

  /* Une fonction unique pour modifier l'ensemble des hooks d'état liés aux inputs de la page */
  let changeState = (name, value) => {
    if (name == "firstName") {
      setFirstName(value);
    } else if (name == "lastName") {
      setLastName(value);
    } else if (name == "email") {
      setEmail(value);
    } else if (name == "city") {
      setCity(value);
    } else if (name == "password") {
      setPassword(value);
    } else if (name == "confirmPassword") {
      setConfirmPassword(value);
    }
  };

  /* Fonction qui permet à l'utilisateur de s'inscrire et, s'il est dans un processus de participation à une cleanwalk,
  permet de l'inscrire à cette cleanwalk */
  async function register() {
    let bodyWithoutID = `token=${props.tokenObj.token}&firstNameFromFront=${firstName}&lastNameFromFront=${lastName}&emailFromFront=${email}&cityFromFront=${city}&passwordFromFront=${password}&cityInfo=${JSON.stringify(cityInfo)}`;
    let bodyWithId = `token=${props.tokenObj.token}&firstNameFromFront=${firstName}&lastNameFromFront=${lastName}&emailFromFront=${email}&cityFromFront=${city}&passwordFromFront=${password}&cityInfo=${JSON.stringify(cityInfo)}&cleanwalkIdFromFront=${props.cwIdInvited}`;
    let finalBody;

    if (props.cwIdInvited == null) {
      finalBody = bodyWithoutID;
    }
    if (props.cwIdInvited != null) {
      finalBody = bodyWithId;
    }

    if (password === confirmPassword) {
      let data = await fetch(PROXY + "/users/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: finalBody,
      });

      let body = await data.json();
      if (body.result == true) {
        props.login(body.token);
        /* Enregistrement du token en local storage */
        AsyncStorage.setItem('token', JSON.stringify({ token: body.token, IsFirstVisit: false }));
      } else {
        setListErrorSignup(body.error);
      }
    }
    else if (password !== confirmPassword) {
      setListErrorSignup(["Les deux mots de passe ne sont pas identiques."])
    }
  }


  let errorsRegister = listErrorSignup.map((error, i) => {
    return <Text key={`error${i}`}>{error}</Text>;
  });

  function backArrow() {
    props.navigation.navigate("InvitedMapScreen");
  }

  let button;
  if (props.cwIdInvited == null) {
    button = (
      <ButtonElement
        typeButton="middleSecondary"
        text="M'inscrire"
        onPress={() => register()}
      />
    );
  }
  if (props.cwIdInvited) {
    button = (
      <ButtonElement
        typeButton="middleSecondary"
        text="M'inscrire et rejoindre"
        onPress={() => register()}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.mainView}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>

          <View style={styles.topBanner}>
            <View style={styles.backButton}>
              <ButtonElement typeButton="back" onPress={() => backArrow()} />
            </View>
            <View style={styles.title}>
              <Text style={typography.h1}>INSCRIPTION</Text>
            </View>
          </View>


          <ScrollView>
            <View style={styles.inputFields}>
              <InputElement
                name="firstName"
                setState={changeState}
                value={firstName}
                placeholder="Prénom *"
                type="simpleInput"
              ></InputElement>
              <InputElement
                name="lastName"
                setState={changeState}
                value={lastName}
                placeholder="Nom *"
                type="simpleInput"
              ></InputElement>
              <InputElement
                name="email"
                setState={changeState}
                value={email}
                placeholder="Email *"
                type="simpleInput"
              ></InputElement>
              <InputElement
                name="city"
                setState={changeState}
                setShowAutoComplete={setShowAutoComplete}
                value={city}
                placeholder="Ville *"
                type="simpleInput"
              ></InputElement>
              {/* Le composant AutoComplete ne s'affiche que lorsqu'une recherche est lancée.
              cityInfoSetter correspond au setter pour mettre à jour les informations liées à la commune
              et enregistrer ces informations en BDD si nécessaire */}
              {showAutoComplete &&
                <AutoComplete
                  data={autoComplete}
                  onPress={setCity}
                  setShowAutoComplete={setShowAutoComplete}
                  cityInfoSetter={setCityInfo}
                />
              }
              <InputElement
                name="password"
                setState={changeState}
                placeholder="Password *"
                type="simpleInput"
                secureTextEntry={true}
              ></InputElement>
              <InputElement
                name="confirmPassword"
                setState={changeState}
                placeholder="Confirm password *"
                type="simpleInput"
                secureTextEntry={true}
              ></InputElement>
            </View>
            <View style={styles.error}>{errorsRegister}</View>

            <View style={styles.register}>
              {button}
              <View style={styles.textContainer}>
                <Text style={typography.body}>Vous avez déjà un compte?</Text>
                <Text
                  style={(typography.body, styles.link)}
                  onPress={() => props.navigation.navigate("Login")}
                >
                  Se connecter
                </Text>
              </View>
            </View>
            <View style={styles.logoContainer}>
              <ImageBackground source={LogoKlean} resizeMode="contain" style={styles.logo} />
            </View>
          </ScrollView>

        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    login: function (token) {
      dispatch({ type: "login", token });
    },
  };
}

function mapStateToProps(state) {
  return {
    cwIdInvited: state.cwIdInvited,
    tokenObj: state.tokenObj,
  };
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    height: windowDimensions.height,
    alignItems: "center",
    backgroundColor: colors.white,
  },
  topBanner: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: colors.grey,
    width: windowDimensions.width,
    height: windowDimensions.height * 0.1,
    marginBottom: "8%",
  },
  backButton: {
    position: "absolute",
    left: windowDimensions.width*0.1,
    zIndex: 10,
  },
  title: {
    justifyContent: "center",
    alignItems: "center",
  },
  inputFields: {
    justifyContent: "center",
    alignItems: "center",
  },
  register: {
    marginTop: 50,
    alignItems: "center",
  },
  textContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  error: {
    justifyContent: "center",
    alignItems: "center",
  },
  link: {
    paddingTop: 10,
  },
  logoContainer: {
    width: windowDimensions.width,
    alignItems: "center",
  },
  logo: {
    height: windowDimensions.height * 0.2,
    width: windowDimensions.width * 0.3,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
