import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    SafeAreaView,
    ScrollView,
    StatusBar,
    ActivityIndicator
} from 'react-native';

import { connect } from 'react-redux';

import ScreenTitles from '../lib/ScreenTitles.js';
import ButtonElement from "../lib/ButtonElement";
import Participants from "../lib/Participants";
import BadgesList from '../lib/BadgesList.js';
import { windowDimensions } from '../lib/windowDimensions.js';
import { typography } from '../lib/typography.js';
import { colors } from "../lib/colors.js";
import changeDateFormat from "../lib/changeDateFormat"

import { showLocation } from 'react-native-map-link';

import PROXY from "../proxy.js";

/* Composant permettant d'afficher la page contenant le détail des cleanwalks sur la stack de navigation
du profil */

function ConnectedEventDetailProfilStack(props) {

    let idCW = props.cwIdProfilStack;

    const [cleanwalk, setCleanwalk] = useState(null);
    const [error, setError] = useState(null);

    /* Ajout de l'organisateur au début de la liste des participants (enregistré séparement en base de données)
    pour envoyer le tableau en props du composant Participants */
    const dataParticipants = (admin, participants) => {
        participants.unshift(admin);
        return participants;
    };

    useEffect(() => {
        async function loadData() {
            const responseCleanwalk = await fetch(PROXY + `/load-cleanwalk/${idCW}/${props.tokenObj.token}`);
            const jsonResponseCleanwalk = await responseCleanwalk.json();

            setCleanwalk(jsonResponseCleanwalk.cleanwalk);
        }
        loadData();
    }, []);

    const unsubscribeCw = async () => {
        /* Mise à jour de la désinscription de l'utilisateur en BDD */
        let rawResponse = await fetch(`${PROXY}/unsubscribe-cw`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `token=${props.tokenObj.token}&idCW=${idCW}`
        });

        let body = await rawResponse.json();
        if (body.result == true) {
            /* Suppression de l'ID de la cleanwalk dans le store pour l'affichage dynamique des boutons sur la page
            pour la désinscription ou la suppression de la cleanwalk */
            props.desinsCws(idCW);
            props.navigation.navigate("Profil");
        } if (body.result == false) {
            setError(body.error)
        }

    }

    const deleteCw = async () => {
        /* Mise à jour de la suppression de la cleanwalk en BDD */
        let rawResponse = await fetch(`${PROXY}/delete-cw/${props.tokenObj.token}/${idCW}`, {
            method: 'DELETE'
        });

        let body = await rawResponse.json();
        if (body.result == true) {
            /* Suppression de l'ID de la cleanwalk dans le store pour l'affichage dynamique des boutons sur la page
            pour la désinscription ou la suppression de la cleanwalk */
            props.supCws(idCW);
            props.navigation.navigate("Profil");
        } if (body.result == false) {
            setError(body.error)
        }

    }

    /* Affichage dynamique du bouton en fin de page (Suppression ou désinscription à la cleanwalk)
    à partir des éléments enregistrés dans le store */
    const checkCwsOrganize = props.cwsStore.infosCWorganize.findIndex(
        index => index.toString() === idCW.toString()
    );

    let confirmButton;
    if (checkCwsOrganize !== -1) {
        confirmButton = <View style={styles.confirmButton}>
            <ButtonElement
                typeButton="middleSecondary"
                text="Supprimer la cleanwalk"
                onPress={() => deleteCw()}
            />
        </View>;
    } else {
        confirmButton = <View style={styles.confirmButton}>
            <ButtonElement
                typeButton="middleSecondary"
                text="Se désinscrire"
                onPress={() => unsubscribeCw()}
            />
        </View>;
    }

    let errors = (
        <View>
            <Text>{error}</Text>
        </View>
    );

    /* Affichage d'un loader tant que la cleanwalk n'a pas été récupérée depuis le backend */
    if (cleanwalk === null) {
        return (
            <View style={styles.wait}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        )
    } else {

        return (

            <SafeAreaView style={styles.container}>
                <ScrollView>

                    <ImageBackground
                        style={styles.banner}
                        source={require('../assets/imagesKlean/BannerCleanwalk.jpg')}
                    >
                        <ButtonElement
                            style={styles.backButton}
                            typeButton="back"
                            onPress={() => props.navigation.navigate('Profil')}
                        />
                        <ButtonElement
                            style={styles.goButton}
                            typeButton="go"
                            /* Fonction importée depuis le module map-link qui permet d'afficher le point d'intérêt
                            sur l'application carte native de l'appareil */
                            onPress={() => showLocation({
                                latitude: cleanwalk.cleanwalkCoordinates.latitude,
                                longitude: cleanwalk.cleanwalkCoordinates.longitude,
                                title: cleanwalk.cleanwalkTitle,
                            })}
                        />
                    </ImageBackground>

                    <View style={styles.generalInfoCleanwalk}>
                        <Text style={typography.h2}>
                            {cleanwalk.cleanwalkTitle}
                        </Text>
                        <Text style={typography.bodyLight}>
                            {cleanwalk.cleanwalkCity.cityName}
                        </Text>
                        <Text style={typography.bodyLight}>
                            Début : {changeDateFormat(cleanwalk.startingDate)}
                        </Text>
                        <Text style={typography.bodyLight}>
                            Fin : {changeDateFormat(cleanwalk.endingDate)}
                        </Text>
                    </View>

                    <View style={styles.descriptionCleanwalk}>
                        <Text style={typography.h3}>Description</Text>
                        <View style={styles.cleanwakDescriptionContainer}>
                            <Text style={typography.bodyLight}>
                                {cleanwalk.cleanwalkDescription}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.badges}>
                        <BadgesList data={cleanwalk.toolBadge} />
                    </View>

                    <View>
                        <ScreenTitles titleType="secondary" title="Participants" />
                    </View>

                    <View style={styles.participantsContainer}>

                        <View style={styles.participantsList}>
                            {/* L'organisateur doit toujours être situé au début du tableau */}
                            <Participants data={dataParticipants(cleanwalk.admin, cleanwalk.participantsList)} />
                        </View>


                        <View style={styles.chat}>
                            <ScreenTitles titleType="secondary" title="Chat" />
                            <ButtonElement
                                typeButton="chat"
                                btnActive={true}
                                onPress={() => props.navigation.navigate('ChatProfilStack')}
                            />
                        </View>

                    </View>

                    {errors}
                    {confirmButton}

                </ScrollView>
            </SafeAreaView>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        desinsCws: function (idCW) {
            dispatch({ type: "desinsCws", idCW });
        },
        supCws: function (idCW) {
            dispatch({ type: "supCws", idCW });
        }
    };
}

function mapStateToProps(state) {
    return {
        tokenObj: state.tokenObj,
        cwIdProfilStack: state.cwIdProfilStack,
        cwsStore: state.cwsStore
    };
}

const styles = StyleSheet.create({
    wait: {
        flex: 1,
        backgroundColor: colors.white,
        justifyContent: "center",
        alignItems: "center"
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    banner: {
        width: windowDimensions.width,
        height: 100,
        marginTop: 29,
        justifyContent: 'space-between',
        paddingLeft: 17,
        paddingRight: 17,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: StatusBar.currentHeight || 0,
    },
    backButton: {
        position: 'absolute',
        zIndex: 10,
    },
    goButton: {
        position: 'absolute',
        zIndex: 10,
    },
    generalInfoCleanwalk: {
        marginTop: 11,
        marginBottom: 11,
        marginLeft: 18,
    },
    descriptionCleanwalk: {
        marginBottom: 11,
        marginLeft: 18,
    },
    cleanwakDescriptionContainer: {
        marginRight: 18,
    },
    badges: {
        marginLeft: 11,
        marginBottom: 30,
    },
    participantsContainer: {
        flexDirection: 'column',
        height: 300,
    },
    participantsList: {
        marginTop: 11,
        marginBottom: 30,
    },
    chat: {
        marginTop: 11,
        marginRight: 18,
    },
    confirmButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 11,
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ConnectedEventDetailProfilStack);