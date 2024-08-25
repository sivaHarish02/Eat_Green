import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const OrderSuccessScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            {/* <Image source={require('../../assets/celebration.jpg')} style={styles.backgroundImage} /> */}
            <View style={styles.content}>
                <Image source={{ uri: 'https://img.freepik.com/premium-photo/healthy-food-logo-design-with-spoon-leaf-elements-isolated-white-background_978521-49937.jpg?w=826' }} style={styles.logo} />
                <Text style={styles.thankYouText}>Thank you!</Text>
                <Image source={require('../../assets/check_mark.jpg')} style={styles.checkmark} />

                <Text style={styles.successMessage}>Order Placed Successfully !!!</Text>
                <Image source={{ uri: 'https://img.freepik.com/premium-vector/cartoon-drawing-boy-with-green-backpack-green-shirt-with-green-face_730620-643824.jpg?w=826' }} style={styles.boy} />
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.navigate('Home')}>
                    <Text style={styles.backButtonText}>Back to home</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default OrderSuccessScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        position: 'relative',
    },
    backgroundImage: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
        zIndex: -1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 120,
        height: 80,
        marginVertical: 20,
    },
    thankYouText: {
        fontSize: 24,
        color: "rgb(8, 154, 64)",
        fontWeight: 'bold',
        marginBottom: 20,
    },
    checkmark: {
        width: 100,
        height: 100,
        objectFit: "contain",
        marginBottom: 20,
    },
    boy: {
        width: 200,
        height: 300,
        marginBottom: 20,
    },
    successMessage: {
        fontSize: 20,
        color: "rgb(8, 154, 64)",
        marginBottom: 40,
        textAlign: 'center',
    },
    backButton: {
        backgroundColor: "rgb(8, 154, 64)",
        paddingHorizontal: 90,
        paddingVertical: 15,
        borderRadius: 30,
        marginTop: 20,
    },
    backButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
