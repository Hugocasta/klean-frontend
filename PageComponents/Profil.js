import React from 'react';
import { StyleSheet, Text, View, StatusBar, Image, ScrollView } from 'react-native';

import ScreenTitles from '../lib/ScreenTitles';
import ButtonElement from '../lib/ButtonElement';

import { connect } from 'react-redux';
import { colors } from '../lib/colors';
import { typography } from '../lib/typography';
import { windowDimensions } from '../lib/windowDimensions';

import { FontAwesome } from '@expo/vector-icons';
import CleanwalkList from '../lib/CleanwalkList';


function Profil(props) {

    return (
        <View style={styles.container}>
            <View style={styles.logout}>
                <ButtonElement typeButton='logout' onPress={() => { props.signOut() }} />
            </View>
            <Text style={styles.mainTitle}> MON PROFIL </Text>

            <ScrollView>
            <ScreenTitles title="Cleanwalks" titleType="secondary" />
            <View style={styles.switch}>
                <ButtonElement text="J'organise" typeButton='middleFine' onPress={() => console.log("press")} />
                <ButtonElement text="Je participe" typeButton='middleFine' outline={true} onPress={() => console.log("press")} />
            </View>
            <View style={styles.list}>
                <CleanwalkList />
            </View>


            <ScreenTitles title="Statistiques" titleType="secondary" />
            <View style={styles.switch}>
                <ButtonElement text="Personnelles" typeButton='middleFine' onPress={() => console.log("press")} />
                <ButtonElement text="Ville" typeButton='middleFine' outline={true} onPress={() => console.log("press")} />
            </View>
            <View style={styles.stat}>
                <Image
                    style={styles.robot}
                    source={require('../assets/imagesKlean/Robot3Carre.png')}
                />
                <View style={styles.statBody}>
                    <Text style={styles.statBodyTitle}>Trash Exterminator</Text>
                    <Text style={styles.statBodyText}>50 Cleanwalks réalisées</Text>
                </View>
            </View>


            <ScreenTitles title="Informations personnelles" titleType="secondary" />
            <View style={styles.infoPerso}>
                <View style={styles.avatar}>
                    <FontAwesome name="user" size={40} color="white" />
                </View>
                <View style={styles.statBody}>
                    <Text style={styles.statBodyText}>Mika</Text>
                    <Text style={styles.statBodyText}>Doe</Text>
                    <Text style={styles.statBodyText}>mika.doe@gmail.com</Text>
                    <ButtonElement text="Modifier mot de passe" typeButton="password" />
                </View>
            </View>
            </ScrollView>
        </View>
    );
}

{/*<Text>Profil</Text>
            <Button title="login" onPress={() => props.login("monsupertokenchercheenbdd")} />
            <Button title="signOut" onPress={() => props.signOut()} />
            <Button title="Profil"
                onPress={() => props.navigation.navigate('Profil')} />
            <Button title="ConnectedEventDetailProfilStack"
                onPress={() => props.navigation.navigate('ConnectedEventDetailProfilStack')} />
            <Button title="ChatProfilStack"
                onPress={() => props.navigation.navigate('ChatProfilStack')} />*/}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
        paddingTop: StatusBar.currentHeight,
        paddingBottom: 40,
    },
    mainTitle: {
        fontSize: typography.h1.fontSize,
        fontFamily: typography.h1.fontFamily,
        paddingVertical: 10,
        textAlign: "center"
    },
    logout: {
        position: "absolute",
        top: StatusBar.currentHeight + 5,
        left: windowDimensions.width - 40,
        zIndex: 10,
    },
    switch: {
        flexDirection: "row",
        alignSelf: "center"
    },
    list: {
        height: windowDimensions.height * 0.30
    },
    stat: {
        flexDirection: "row",
        height: 120,
        alignItems: "center",
        justifyContent: "center"
    },
    robot: {
        width: 80,
        height: 80,
        borderRadius: 50,
        borderColor: colors.grey,
        borderWidth: 1,
    },
    statBody: {
        marginLeft: 15,
    },
    statBodyTitle: {
        fontSize: typography.h2.fontSize,
        fontFamily: typography.h2.fontFamily
    },
    statBodyText: {
        fontSize: typography.bodyLight.fontSize,
        fontFamily: typography.bodyLight.fontFamily
    },
    avatar: {
        width: 80,
        height: 80,
        backgroundColor: colors.grey,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 50
    },
    infoPerso: {
       flexDirection: "row",
        height: 120,
        alignItems: "center",
        justifyContent: "center" 
    }
});


function mapDispatchToProps(dispatch) {
    return {
        login: function (token) {
            dispatch({ type: 'login', token })
        },
        signOut: function () {
            dispatch({ type: 'signOut' })
        }
    }
}

function mapStateToProps(state) {
    return { tokenObj: state.tokenObj }
}



export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Profil);