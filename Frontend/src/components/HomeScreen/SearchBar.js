import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Image } from 'react-native';

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleSearchChange = (text) => {
        setQuery(text);
        onSearch(text); // Pass the query to parent component
    };

    return (
        <View style={{ paddingHorizontal: 15, marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f6fffa', borderRadius: 15, padding: 3, borderColor: 'rgb(8, 154, 64)', borderWidth: 2 }}>
                <TextInput
                    placeholder="Search products"
                    placeholderTextColor={"#000"}
                    style={{ flex: 1, fontWeight: '700', fontSize: 16, color: "#000" }}
                    value={query}
                    onChangeText={handleSearchChange}
                />
                <TouchableOpacity>
                    <Image
                        source={require('../../assets/search.jpg')}
                        style={{ width: 24, height: 24, padding: 25, borderRadius: 10 }}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default SearchBar;
