import React from 'react';
import {ScrollView, Text, VStack, View, Alert} from 'native-base';
import {Linking, PermissionsAndroid, TouchableOpacity} from 'react-native';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HeaderSection from '../sections/HeaderSection';
import SlideshowSection from '../sections/SlideshowSection';
import ActivityFooterSection from '../sections/ActivityFooterSection';
import RichText from '../sections/RichText';

class ActivityOverviewScreen extends React.Component {
  constructor(props) {
    super(props);
  }
  async handlePress(document) {
    try {
      // Path to the source file in your app-specific directory
      const sourcePath = document.source;

      // Destination path to the Downloads directory
      const destPath =
        Platform.OS === 'android'
          ? `${RNFS.DownloadDirectoryPath}/${document.fileId}.pdf`
          : `${RNFS.DocumentDirectoryPath}/${document.fileId}`; // iOS fallback

      // Copy the file
      await RNFS.copyFile(sourcePath, destPath);

      console.log('File successfully copied to:', destPath);
    } catch (error) {
      console.error('Error copying file:', error);
    }
  }

  render() {
    const data = this.props.route.params.data;

    return (
      <VStack flexDirection="column" flex={1} justifyContent="space-between">
        <HeaderSection
          title={data.title}
          subtitle={data.subtitle}
          navigation={this.props.navigation}
        />
        <ScrollView padding={2}>
          <Text fontSize="3xl" fontWeight="semibold">
            Documents
          </Text>
          {data.documents != null &&
            data.documents.map((doc, index) => (
              <View key={index} style={{marginVertical: 5}}>
                <TouchableOpacity
                  onPress={() => this.handlePress(doc)}
                  style={{
                    backgroundColor: '#456dff',
                    padding: 10,
                    borderRadius: 10,
                  }}>
                  <Text style={{color: '#FFFFFF'}}> {doc.title}</Text>
                </TouchableOpacity>
              </View>
            ))}
        </ScrollView>
        <ActivityFooterSection
          data={data}
          navigation={this.props.navigation}
          route={this.props.route}
        />
      </VStack>
    );
  }
}

export default ActivityOverviewScreen;
