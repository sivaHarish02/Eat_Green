import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
useNavigation

const BottomIconsView = () => {
    const navigation = useNavigation()
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.iconContainer} >
                <Icon name="home" size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate("Myorders")}>
                <Icon name="apps" size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.cartIconContainer} onPress={() => navigation.navigate("cartlist")}>
                <Icon name="shopping-cart" size={24} color="#00B140" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate("Favorite")}>
                <Icon name="favorite" size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconContainer}>
                <Icon name="search" size={24} color="#FFFFFF" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        position: 'relative',
        justifyContent: 'space-around',
        backgroundColor: '#00B140',
        paddingVertical: 10,
        borderRadius: 30,
        paddingHorizontal: 20,
        marginHorizontal: 20,
    },
    iconContainer: {
        padding: 10,
    },
    cartIconContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 50,
        padding: 10,
    },
});

export default BottomIconsView;


