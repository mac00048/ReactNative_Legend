import React from 'react';
import {ScrollView, Text, VStack, View} from 'native-base';
import {Linking, PermissionsAndroid, TouchableOpacity, Alert} from 'react-native';
import RNFS from 'react-native-fs';
import FileViewer from 'react-native-file-viewer';
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
      const sourcePath = document.source;
      // const destPath = `${RNFS.DownloadDirectoryPath}/${document.title}`; // Public folder
    
      if (await RNFS.exists(sourcePath)) {
        // await RNFS.copyFile(sourcePath, destPath); // Copy to Downloads folder
        // console.log('Sourcepath', sourcePath);
        // console.log('File copied to:', destPath);
    
        await FileViewer.open(sourcePath); // Open the copied file
      } else {
        console.error('File does not exist:', sourcePath);
      }
    } catch (error) {
      console.error('Error opening file:', error);
      Alert.alert('Error', 'There is no app to open this file');
    }
  }
  // async handlePress(document) {
  //   try {
  //     // Check and request permission (Android only)
  //     const hasPermission = await this.requestStoragePermission();
  //     if (!hasPermission) {
  //       Alert.alert('Permission Denied', 'Storage permission is required to download the file.');
  //       return;
  //     }

  //     const sourcePath = document.source; // URL or local path
  //     const fileName = document.title || 'document.pdf'; // Use document title as filename

  //     // Define the destination path
  //     const destPath =
  //       Platform.OS === 'android'
  //         ? `${RNFS.DownloadDirectoryPath}/${fileName}`
  //         : `${RNFS.DocumentDirectoryPath}/${fileName}`; // iOS fallback

  //     // Check if the file exists
  //     if (await RNFS.exists(sourcePath)) {
  //       // Open the file if it already exists
  //       await FileViewer.open(sourcePath);
  //       return;
  //     }

  //     // Download the file
  //     const downloadOptions = {
  //       fromUrl: sourcePath,
  //       toFile: destPath,
  //     };

  //     const download = await RNFS.downloadFile(downloadOptions).promise;
  //     if (download.statusCode === 200) {
  //       Alert.alert('File Downloaded', `File saved to: ${destPath}`);
  //       await FileViewer.open(destPath); // Open the file
  //     } else {
  //       throw new Error(`Failed to download file: HTTP status ${download.statusCode}`);
  //     }
  //   } catch (error) {
  //     console.error('Error handling file:', error);
  //     Alert.alert('Error', 'Failed to download or open the file. Please try again.');
  //   }
  // }

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
                    backgroundColor: '#3254b7',
                    padding: 20,
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
