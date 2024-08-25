// src/components/Home/BannersCarousel.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Image, Dimensions, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native';

const { width } = Dimensions.get('window');

const carouselItems = [
    { image: require('../../assets/banner1.jpg'), route: 'masala' },
    { image: require('../../assets/banner2.jpg'), route: 'vegetable' },
    { image: require('../../assets/banner3.jpg'), route: 'spinach' },
    { image: require('../../assets/banner4.webp'), route: 'banner4' },
];

const BannersCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const carouselRef = useRef(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => {
                const nextIndex = (prevIndex + 1) % carouselItems.length;
                carouselRef.current?.scrollToIndex({ index: nextIndex, animated: true });
                return nextIndex;
            });
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const handleCarouselPress = (route) => {
        // navigation.navigate(route); // uncomment this line if you have navigation set up
    };

    const renderCarouselItem = ({ item }) => (
        <View style={styles.carouselItem}>
            <TouchableOpacity onPress={() => handleCarouselPress(item.route)}>
                <Image source={item.image} style={styles.carouselImage} />
            </TouchableOpacity>
        </View>
    );

    return (
        <FlatList
            ref={carouselRef}
            data={carouselItems}
            renderItem={renderCarouselItem}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            snapToAlignment="center"
            decelerationRate="fast"
            snapToInterval={width}
            style={styles.carouselContainer}
        />
    );
};

const styles = StyleSheet.create({
    carouselContainer: {
        marginTop: 0,
        marginBottom: 25,
    },
    carouselItem: {
        width: width,
        height: 180,
        borderRadius: 8,
    },
    carouselImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 8,
    },
});

export default BannersCarousel;