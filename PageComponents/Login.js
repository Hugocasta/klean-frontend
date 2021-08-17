import React, { useState } from "react";
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
import { typography, Typography } from "../lib/typography";
import ButtonElement from "../lib/ButtonElement";
import InputElement from "../lib/InputElement";
import LogoKlean from "../assets/imagesKlean/LogoKlean.png";

import PROXY from "../proxy";

import AsyncStorage from '@react-native-async-storage/async-storage';


/* Composant qui permet l'affichage de la page pour se connecter à l'application */

function Login(props) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [listErrorLogin, setListErrorLogin] = useState([]);

  /* Fonction qui permet à l'utilisateur de se connecter et, s'il est dans un processus de participation à une cleanwalk,
  permet de l'inscrire à cette cleanwalk */
  async function login() {
    let bodyWithoutID = `emailFromFront=${email}&passwordFromFront=${password}`;
    let bodyWithId = `emailFromFront=${email}&passwordFromFront=${password}&cleanwalkIdFromFront=${props.cwIdInvited}`;
    let finalBody;

    if (props.cwIdInvited == null) {
      finalBody = bodyWithoutID;
    }
    if (props.cwIdInvited != null) {
      finalBody = bodyWithId;
    }
    let data = await fetch(PROXY + "/users/sign-in", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: finalBody,
    });

    let body = await data.json();
    if (body.result == true) {
      props.login(body.token);
      /* Requête qui permet de récupérer les IDs des cleanwalks de l'utilisateur (qu'il organise/auxquelles il participe) 
      pour dynamiser la page détail des cleanwalks (EventDetail) */
      let rawResponse = await fetch(`${PROXY}/load-cw-forstore/${body.token}`);
      let response = await rawResponse.json();
      props.loadCwsStore({ infosCWparticipate: response.infosCWparticipate, infosCWorganize: response.infosCWorganize });
      /* Enregistrement du token en local storage */
      AsyncStorage.setItem('token', JSON.stringify({ token: body.token, IsFirstVisit: false }));
    } else {
      setListErrorLogin(body.error);
    }
  }

  let errorsLogin = listErrorLogin.map((error, i) => {
    return <Text key={`error${i}`}>{error}</Text>;
  });

  /* Une fonction unique pour modifier l'ensemble des hooks d'état liés aux inputs de la page */
  let changeState = (name, value) => {
    if (name == "email") {
      setEmail(value);
    } else if (name == "password") {
      setPassword(value);
    }
  };

  function backArrow() {
    props.navigation.navigate("InvitedMapScreen");
  }

  let button;
  if (props.cwIdInvited == null) {
    button = (
      <ButtonElement
        style={styles.registerButton}
        typeButton="middleSecondary"
        text="Se connecter."
        onPress={() => login()}
      />
    );
  }
  if (props.cwIdInvited) {
    button = (
      <ButtonElement
        style={styles.registerButton}
        typeButton="middleSecondary"
        text="Se connecter et rejoindre."
        onPress={() => login()}
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
              <Text style={typography.h1}>CONNEXION</Text>
            </View>
          </View>

          <ScrollView>
            <View style={styles.inputFields}>
              <InputElement
                name="email"
                setState={changeState}
                placeholder="Email *"
                type="simpleInput"
              ></InputElement>
              <InputElement
                name="password"
                setState={changeState}
                placeholder="Password *"
                type="simpleInput"
                secureTextEntry={true}
              ></InputElement>
            </View>

            <View style={styles.error}>{errorsLogin}</View>

            <View style={styles.register}>
              {button}
              <View style={styles.textContainer}>
                <Text style={typography.body}>Vous n'avez pas de compte?</Text>
                <Text
                  style={(typography.body, styles.link)}
                  onPress={() => props.navigation.navigate("SignUp")}
                >
                  Inscrivez-vous.
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
    loadCwsStore: function (cwsStore) {
      dispatch({ type: "loadCwsStore", cwsStore });
    }
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
    left: "10%",
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
    marginTop: 70,
    alignItems: "center",
  },
  registerButton: {
    paddingBottom: 10,
  },
  textContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  error: {
    alignItems: "center",
  },
  link: {
    paddingTop: 10,
  },
  logoContainer: {
    flex: 1,
    width: windowDimensions.width,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  logo: {
    height: windowDimensions.height * 0.2,
    width: windowDimensions.width * 0.3,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
