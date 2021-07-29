import React from "react";
import { StyleSheet, View, FlatList  } from "react-native";
import Badges from './Badges';

function BadgesList(props) {

    let renderItem = ({ item }) => {

        // console.log("item est là", item)

        return (
            <View style={styles.container}>
                <Badges type="green" text={item} /> 
            </View>
        );
    };

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        marginLeft: 5,
        marginRight: 5,
    },
});

return (
    <FlatList
    data={props.data}
    horizontal
    showsHorizontalScrollIndicator={false}
    renderItem={renderItem}
    />
);

}

export default BadgesList;