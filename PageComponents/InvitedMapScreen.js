import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  StatusBar,
  View,
  SafeAreaView,
  Button,
  Pressable,
} from "react-native";

import { connect } from "react-redux";

import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";

import * as Location from "expo-location";

import ButtonElement from "../lib/ButtonElement";
import SearchBarElement from "../lib/SearchBarElement";
import { colors } from "../lib/colors";
import pinSmall from "../assets/imagesKlean/pinSmall.png";
import PreviewEvent from "./PreviewEvent";
import AutoComplete from "../lib/AutoComplete";

import PROXY from "../proxy";

/* Composant permettant l'affichage de la page avec la carte contenant les cleanwalks */

function InvitedMapScreen(props) {

  const [isVisiblePreview, setIsVisiblePreview] = useState(false);
  const [dateSearch, setDateSearch] = useState(new Date());
  const [adress, setAdress] = useState("");
  const [autoComplete, setAutoComplete] = useState([]);
  const [showAutoComplete, setShowAutoComplete] = useState(false);
  const [currentRegion, setCurrentRegion] = useState({
    latitude: 48.866667,
    longitude: 2.333333,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [listPositionCW, setListPositionCW] = useState([]);
  const [previewInfo, setPreviewInfo] = useState(null);

  /* Nous avons choisi de ne récupérer qu'une seule fois la position de l'utilisateur. La fonction
    doit être relancée pour mettre à jour sa position */
  const geoLoc = async () => {
    location = await Location.getCurrentPositionAsync({});
      setCurrentRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
  };

  /* Demande la permission de l'utilisateur pour obtenir sa localisation à la première connexion */
  useEffect(() => {
    async function askPermissions() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        geoLoc();
      }
    }
    askPermissions();
  }, []);

  /* Chargement des cleanwalks sur la carte lorsque la date de début dans le champ de recherche est modifiée*/
  useEffect(() => {
    loadCleanwalk(currentRegion, dateSearch);
  }, [dateSearch]);

  /* Lorsque'une recherche est faite via le champ d'adresse (modification du champ), un appel est lancé au backend 
  qui communique avec l'API des adresses du gouvernement. Les résultats sont affichés via le composant Autocomplete. */
  useEffect(() => {
    async function loadData() {
      let rawResponse = await fetch(PROXY + "/autocomplete-search", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `adress=${adress.replace(" ", "+")}&token=${props.tokenObj.token}`,
      });
      let response = await rawResponse.json();
      setAutoComplete(response.response);
    }
    if (adress.length != null) {
      loadData();
    } else {
    }
  }, [adress]);

   /* Fonction qui permet l'affichage dynamique des cleanwalks sur la carte en fonction de la latitude et longitude
  delta de la "region" (partie de la carte visible) */
  const loadCleanwalk = async (currentRegion, dateSearch) => {
    let rawResponse = await fetch(PROXY + "/load-pin-on-change-region", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `coordinate=${JSON.stringify(
        currentRegion
      )}&date=${dateSearch}&token=${props.tokenObj.token}`,
    });
    let response = await rawResponse.json();
    setListPositionCW(response.cleanWalkArray);
  };

  /* Liste des markers présents sur la carte, représentant des cleanwalks */
  const markers = listPositionCW.map((marker, i) => {
    return (
      <Marker
        key={i}
        coordinate={{
          latitude: marker.cleanwalkCoordinates.latitude,
          longitude: marker.cleanwalkCoordinates.longitude,
        }}
        image={pinSmall}
        anchor={{ x: 0.5, y: 1 }}
        centerOffset={{ x: 0.5, y: 1 }}
        onPress={() => {
          setPreviewInfo(listPositionCW[i]);
          setIsVisiblePreview(!isVisiblePreview);
        }}
      />
    );
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.contentSearchBar}>
        <SearchBarElement
          adress={adress}
          setAdress={setAdress}
          onChangeShowAutoComplete={setShowAutoComplete}
          placeholder="Où ? (adresse)"
        />

        <SearchBarElement
          type="date"
          dateSearch={dateSearch}
          setDateSearch={setDateSearch}
        />
      </View>
      <View>
         {/* Le composant AutoComplete ne s'affiche que lorsqu'une recherche est lancée.
        regionSetter correspond au setter pour mettre à jour les coordonnées de la region et modifier 
        la vue sur la carte (au clic sur une des adresses de la liste) */}
        {showAutoComplete ? (
          <AutoComplete
            data={autoComplete}
            onPress={setAdress}
            setShowAutoComplete={setShowAutoComplete}
            regionSetter={setCurrentRegion}
          />
        ) : null}
      </View>
      <MapView
        style={styles.container}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 48.866667,
          longitude: 2.333333,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        region={currentRegion}
        onRegionChangeComplete={(newRegion) => {
          setCurrentRegion(newRegion);
          loadCleanwalk(newRegion, dateSearch);
        }}
      >
        {markers}
      </MapView>
      {previewInfo ? (
        <PreviewEvent
          title={previewInfo.cleanwalkTitle}
          desc={previewInfo.cleanwalkDescription}
          toolBadge={previewInfo.toolBadge}
          nameOrga={previewInfo.admin.lastName}
          firstnameOrga={previewInfo.admin.firstName}
          avatar={previewInfo.admin.avatarUrl}
          onPress={() => {
            /* Au clic, l'ID de la cleanwalk est envoyé au store car nécessaire pour l'affichage 
          du composant "EventDetail" */
            props.setCwIdInvited(previewInfo._id);
            props.navigation.navigate("InvitedEventDetail");
          }}
          visible={isVisiblePreview}
        />
      ) : null}
      <ButtonElement
        typeButton="fullFat"
        backgroundColor={colors.primary}
        text="Se connecter"
        onPress={() => props.navigation.navigate("Login")}
      />
      <ButtonElement typeButton="geoloc" onPress={() => geoLoc()} />
    </SafeAreaView>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    setCwIdInvited: function (id) {
      dispatch({ type: "setCwIdInvited", id });
    },
  };
}

function mapStateToProps(state) {
  return {
    tokenObj: state.tokenObj,
  };
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
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 20,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(InvitedMapScreen);
