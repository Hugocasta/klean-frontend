import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  StatusBar,
  View,
  Text,
  SafeAreaView
} from "react-native";

import { connect } from "react-redux";

import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";

import * as Location from "expo-location";

import ButtonElement from "../lib/ButtonElement";
import SearchBarElement from "../lib/SearchBarElement";
import { colors } from "../lib/colors";
import pinSmall from "../assets/imagesKlean/pinSmall.png";
import { windowDimensions } from "../lib/windowDimensions";
import { typography } from "../lib/typography";
import AutoComplete from "../lib/AutoComplete";

import PROXY from "../proxy";

/* Composant qui permet l'affichage de la page permettant à l'utilisateur de définir les coordonnées d'une
cleanwalk qu'il souhaite créer */

function CreateEvent(props) {

  const [region, setRegion] = useState();
  const [newCleanwalk, setNewCleanwalk] = useState(null);

  const [autoComplete, setAutoComplete] = useState([]);
  const [showAutoComplete, setShowAutoComplete] = useState(false);
  const [adress, setAdress] = useState("");

  /* Hook d'effet permettant de modifier la region de la carte (partie visible) en fonction de la localisation
  de l'utilisateur */
  useEffect(() => {
    async function getLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        let location = await Location.getCurrentPositionAsync({});
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    }
    getLocation();
  }, []);

   /* Lorsque'une recherche est faite via le champ d'adresse (modification du champ), un appel est lancé au backend 
  qui communique avec l'API des adresses du gouvernement. Les résultats sont affichés via le composant Autocomplete. */
  useEffect(() => {
    async function loadData() {
      let rawResponse = await fetch(PROXY + '/autocomplete-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `adress=${adress.replace(" ", "+")}&token=${props.tokenObj.token}`
      });
      let response = await rawResponse.json();
      setAutoComplete(response.response)
    };
    if (adress.length != null) {
      loadData();
    } else {
    }
  }, [adress]);

  /* Au clic sur une adresse proposée par l'autocomplete, on veut non seulement modifier la "region" mais également 
  enregistrer les coordonnées comme étant celles de la cleanwalk */
  function setRegionAndCw(item) {
    setRegion(item);
    setNewCleanwalk({ latitude: item.latitude, longitude: item.longitude });
  }

  /* Fonction utilisée lors de l'ajout manuel d'une cleanwalk (l'utilisateur appuye sur la carte) */
  function addCleanwalk(e) {
    setNewCleanwalk({
      latitude: e.nativeEvent.coordinate.latitude,
      longitude: e.nativeEvent.coordinate.longitude,
    });
  }

  /* Fonction permettant de géolocaliser l'utilisateur */
  async function centerOnUser() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      let location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  }

  /* Fonction qui envoie les coordonnées de la cleanwalk au backend pour récupérer dans un premier temps la commune.
  Puis une deuxième route permet d'appliquer un filtre pour ne pas avoir de commune correspondant 
  à un arrondissement */
  async function continueToForm() {
    let data = await fetch(PROXY + "/get-city-from-coordinates", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `token=${props.tokenObj.token}&latFromFront=${newCleanwalk.latitude}&lonFromFront=${newCleanwalk.longitude}`,
    });
    let response = await data.json();

    let city = response.response.features[0].properties.city;

    let newData = await fetch(PROXY + "/search-city-only", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `token=${props.tokenObj.token}&city=${city}`,
    });
    let newResponse = await newData.json();

    /* Les informations de la commune ainsi que les coordonnées de la cleanwalk sont ensuite envoyées dans le store
    pour dynamiser l'affichage de la page suivante (composant "EventFillInfo") */
    props.sendCityInfo({
      cityName: newResponse.newResponse[0].properties.city,
      cityCode: newResponse.newResponse[0].properties.citycode,
      cityCoordinates: newResponse.newResponse[0].geometry.coordinates,
      cityPopulation: newResponse.newResponse[0].properties.population,

      infoFromApi: response.response.features[0].properties,
      cleanwalkCoordinates: { lat: newCleanwalk.latitude, lon: newCleanwalk.longitude },
    });

    setNewCleanwalk(null);
    props.navigation.navigate("EventFillInfo");
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.contentSearchBar}>
        <SearchBarElement
          adress={adress}
          setAdress={setAdress}
          onChangeShowAutoComplete={setShowAutoComplete}
          placeholder="Où ? (adresse)"
        />
      </View>
      <View>
        {showAutoComplete ? (
          <AutoComplete
            data={autoComplete}
            onPress={setAdress}
            setShowAutoComplete={setShowAutoComplete}
            /* Ajout d'une cleanwalk via le champ de recherche d'adresses et le système d'autocomplete */
            regionSetter={setRegionAndCw}
          />
        ) : null}
      </View>
      <MapView
        region={region}
        onRegionChangeComplete={(newRegion) => {
          setRegion(newRegion)
        }}
        style={styles.container}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 48.866667,
          longitude: 2.333333,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        /* Ajout d'une cleanwalk manuellement */
        onLongPress={(e) => addCleanwalk(e)}
      >
        {newCleanwalk ? (
          <Marker
            coordinate={{
              latitude: newCleanwalk.latitude,
              longitude: newCleanwalk.longitude,
            }}
            image={pinSmall}
            draggable
            /* Modification d'une cleanwalk manuellement */
            onDragEnd={(e) => setNewCleanwalk(e.nativeEvent.coordinate)}
          />
        ) : null}
      </MapView>
      <ButtonElement typeButton="geoloc" onPress={() => centerOnUser()} />
      <View style={styles.information}>
        <Text style={styles.textInfo}>
          -Saisir une adresse OU {"\n"}- appuyer longuement pour ajouter un
          repère.
        </Text>
      </View>

      <ButtonElement
        typeButton="fullFine"
        backgroundColor={colors.secondary}
        text="Continuer"
        onPress={() => continueToForm()}
      />
    </SafeAreaView>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    sendCityInfo: function (cityInfo) {
      dispatch({ type: "sendCityInfo", payLoad: cityInfo });
    },
  };
}

function mapStateToProps(state) {
  return { tokenObj: state.tokenObj };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  contentSearchBar: {
    marginTop: StatusBar.currentHeight || 0,
    backgroundColor: colors.primary,
    display: "flex",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 20,
  },
  information: {
    paddingVertical: 20,
    backgroundColor: colors.primary,
    justifyContent: "center",
    paddingLeft: windowDimensions.width * 0.1,
  },
  textInfo: {
    fontSize: typography.postClInformationText.fontSize,
    fontFamily: typography.postClInformationText.fontFamily,
    color: colors.white,
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(CreateEvent);
