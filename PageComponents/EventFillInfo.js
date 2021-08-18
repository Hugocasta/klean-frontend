import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  ScrollView,
  SafeAreaView,
  StatusBar
} from "react-native";

import { connect } from "react-redux";

import { colors } from "../lib/colors";
import { windowDimensions } from "../lib/windowDimensions";
import { typography } from "../lib/typography";
import ButtonElement from "../lib/ButtonElement";
import InputElement from "../lib/InputElement";
import EventGuide from "../lib/EventGuide";
import SearchBarElement from "../lib/SearchBarElement";

import PROXY from "../proxy";

/* Composant qui permet l'affichage de la page où l'utilisateur, après avoir défini les coordonnées d'une cleanwalk
qu'il souhaite créer peut remplir les différentes informations nécessaires pour valider la création de cette dernière. */

function EventFillInfo(props) {
  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const [startingDate, setStartingDate] = useState(new Date());
  const [endingDate, setEndingDate] = useState(new Date());
  const [description, setDescription] = useState("");
  const [tool, setTool] = useState("");
  const [error, setError] = useState();

  const [modalVisible, setModalVisible] = useState(false);

  /* Le champ de la ville est pré-rempli grâce aux informations reçues la page précédente */
  useEffect(() => {
    setCity(props.cityInfo.cityName);
  }, []);

  function closeModal() {
    setModalVisible(false);
  }

  /* Une fonction unique pour modifier l'ensemble des hooks d'état liés aux inputs de la page */
  let changeState = (name, value) => {
    if (name == "title") {
      setTitle(value);
    } else if (name == "city") {
      setCity(value);
    } else if (name == "description") {
      setDescription(value);
    } else if (name == "tool") {
      setTool(value);
    }
  };


  /* Fonction permettant d'enregistrer la cleanwalk en base de données. */
  var addCW = async () => {
    const dataCW = await fetch(PROXY + "/create-cw", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `title=${title}&city=${JSON.stringify(
        props.cityInfo
      )}&startingDate=${startingDate}&endingDate=${endingDate}&description=${description}&tool=${tool}&token=${props.tokenObj.token
        }`,
    });

    let body = await dataCW.json();

    setError(body.error);

    if (body.result) {
      const idCW = body.cleanwalkSave._id;
      props.addCwsOrga(idCW);
      props.navigation.navigate("Profil");
    }
  };

  let errors = (
    <View>
      <Text>{error}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>

        <View style={styles.topBanner}>
          <View style={styles.backButton}>
            <ButtonElement
              typeButton="back"
              onPress={() => props.navigation.navigate("CreateEvent")}
            />
          </View>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.inputFields}>
            <InputElement
              placeholder="Titre *"
              type="simpleInput"
              name="title"
              setState={changeState}
              value={title}
            />
            <InputElement
              placeholder="Ville *"
              type="simpleInputDisabled"
              name="city"
              setState={changeState}
              value={city}
              editable={false}
            />
            <SearchBarElement
              type="date"
              dateSearch={startingDate}
              setDateSearch={setStartingDate}
            />
            <SearchBarElement
              type="time"
              dateSearch={startingDate}
              setDateSearch={setStartingDate}
            />

            <SearchBarElement
              type="date"
              dateSearch={endingDate}
              setDateSearch={setEndingDate}
            />
            <SearchBarElement
              type="time"
              dateSearch={endingDate}
              setDateSearch={setEndingDate}
            />

            <InputElement
              placeholder="Description *"
              type="multilineInput"
              name="description"
              setState={changeState}
              value={description}
            />
            <InputElement
              placeholder="Matériel 1, matériel 2, matériel 3; ... (respecter la mise en forme) *"
              type="multilineInput"
              name="tool"
              setState={changeState}
              value={tool}
            />

            {errors}

            {/* Au clic sur le bouton avec un point d'interrogation, une modal apparaît avec un guide des bonnes
            pratiques pour organiser une cleanwalk */}
            <Text style={styles.guide} style={typography.body}>Guide pour l'organisateur
              <ButtonElement
                onPress={() => setModalVisible(true)}
                typeButton="info"
              />
            </Text>
            <EventGuide visible={modalVisible} close={closeModal} />

          </View>

          <View style={styles.register}>
            <ButtonElement
              style={styles.registerButton}
              typeButton="middleSecondary"
              text="Organiser"
              onPress={() => {
                addCW();
              }}
            />
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    addCwsOrga: function (idCW) {
      dispatch({ type: "addCwsOrga", idCW });
    }
  };
}

function mapStateToProps(state) {
  return { tokenObj: state.tokenObj, cityInfo: state.cityInfo };
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
    width: windowDimensions.width,
    height: windowDimensions.height * 0.1,
    marginBottom: 11,
  },
  backButton: {
    position: "absolute",
    left: 10,
    zIndex: 10,
    paddingTop: StatusBar.currentHeight,
  },
  inputFields: {
    justifyContent: "center",
    alignItems: "center",
  },
  register: {
    marginTop: 50,
    marginBottom: 20,
    alignItems: "center",
  },
  guide: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'center',
    marginTop: 10,
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(EventFillInfo);