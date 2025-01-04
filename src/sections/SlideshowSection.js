import { Pressable } from 'native-base';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, TouchableOpacityBase } from 'react-native';

class SlideshowSection extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        if (this.props.images.length === 0) {
            return null;
        }

        return (
            <ScrollView
                horizontal={true}
                style={{ width: "100%", height: 150, marginTop: 15, marginBottom: 15 }}>

                {this.props.images.map((image, i) =>
                    <TouchableOpacity
                        key={i}
                        onPress={() => this.props.navigation.navigate('Image', { data: image })}
                        style={{ marginLeft: i && 10 }}
                    >
                        <Image
                            source={{ uri: image.source }}
                            style={{ width: image.width * 150 / image.height, height: 150 }}
                            resizeMode='cover'
                        />
                        { image.title && 
                            <Text style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                paddingLeft: 10,
                                paddingRight: 10,
                                paddingTop: 5,
                                paddingBottom: 5,
                                color: "#000000"
                            }}>
                                { image.title }
                            </Text>
                        || null }
                    </TouchableOpacity>
                )}
            </ScrollView>
        );
    }
}

export default SlideshowSection;
