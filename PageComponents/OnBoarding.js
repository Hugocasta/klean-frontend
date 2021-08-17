import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

import { connect } from 'react-redux';

import CarrousselOnboarding from '../lib/CarrousselOnboarding';
import ButtonElement from '../lib/ButtonElement';

/* Composant qui permet l'affichage de l'onboarding */

function OnBoarding(props) {

    return (
        <View style={styles.container}>
            <CarrousselOnboarding />
            <View style={styles.button}>
                <ButtonElement
                    text='Skip'
                    typeButton='middleSecondary'
                    onPress={() => props.navigation.navigate('InvitedMapScreen')}
                />
            </View>
        </View>
    );
}

function mapStateToProps(state) {
    return { tokenObj: state.tokenObj }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: "center"
    },
    button: {
        marginBottom: 50
    }
});

export default connect(
    mapStateToProps,
    null
)(OnBoarding);