import React from 'react';
import {
  ImageBackground,
  StatusBar,
  View,
  ActivityIndicator,
} from 'react-native';
import {Text, Button, Input, VStack} from 'native-base';
import RNFetchBlob from 'rn-fetch-blob';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapboxGL from '@rnmapbox/maps';
import * as Progress from 'react-native-progress';
import {parseISO} from 'date-fns';
import {mapboxKey} from '../variables';
import {unzip} from 'react-native-zip-archive';

MapboxGL.setWellKnownTileServer('Mapbox');
MapboxGL.setAccessToken(mapboxKey);

const blueColor = '#2A3977';
const redColor = '#E31E24';
const grayColor = '#888888';

class LoginScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: null,
      existingVoucher: null,
      voucher: '',
      focused: false,
      error: false,
    };
  }

  componentDidMount() {
    AsyncStorage.getItem('voucher').then((value) => {
      if (value !== null) {
        this.setState({
          existingVoucher: JSON.parse(value),
        });
      }
    });

    // console.log(this.state.existingVoucher.title)
  }

  onClick = async () => {
    const {navigate} = this.props.navigation;

    const url = `https://backoffice.legendatours.com/api/redeem/${this.state.voucher}`;

    const documentDir = RNFetchBlob.fs.dirs.DocumentDir;
    const sourcePath = `${documentDir}/${this.state.voucher}.zip`;
    const targetPath = `${documentDir}/${this.state.voucher}`;
    const indexJson = `${documentDir}/${this.state.voucher}/index.json`;
    const charset = 'UTF-8';

    try {
      this.setState({
        loading: {
          type: 'voucher',
          progress: 0.0,
        },
        error: false,
      });

      console.log('Voucher success');

      // remove existing zip
      await RNFetchBlob.fs.unlink(sourcePath).catch(() => {
        /* do nothing */
      });

      const zipResponse = await RNFetchBlob.config({path: sourcePath})
        .fetch('GET', url)
        .progress({count: 10}, (received, total) => {
          this.setState({
            loading: {
              type: 'voucher',
              progress: (received / total) * 0.25,
            },
          });
        })
        .catch((error) => {
          console.error('Network Request Failed:', error);
        });

      // if download zip error
      if (zipResponse.info().status != 200) {
        this.setState({
          loading: null,
          error: true,
        });

        console.log('error zip response');
        return;
      }

      // remove existing folder
      await RNFetchBlob.fs.unlink(targetPath).catch(() => {
        /* do nothing */
      });

      // unzip, folder will be created
      await unzip(sourcePath, targetPath, charset);

      // remove zip
      await RNFetchBlob.fs.unlink(sourcePath).catch(() => {
        /* do nothing */
      });

      // read index.json
      const data = await RNFetchBlob.fs.readFile(indexJson, 'utf8');
      const json = JSON.parse(data);

      // rewrite image paths
      json.images.forEach((image) => {
        image.source = `file://${targetPath}/images/${image.fileId}${image.type}`;
      });

      // rewrite day image paths
      json.days.forEach((day) => {
        day.images.forEach((image) => {
          image.source = `file://${targetPath}/images/${image.fileId}${image.type}`;
        });
      });

      this.setState({
        existingVoucher: json,
        loading: {
          type: 'voucher',
          progress: 0.25,
        },
        error: false,
      });

      // save voucher
      await AsyncStorage.setItem('voucher', JSON.stringify(json));

      this.setState({
        loading: {
          type: 'map',
          progress: 0.25,
        },
      });

      // download offline map
      await this.loadOfflineMap();

      this.setState({
        loading: null,
      });

      navigate('ActivityOverview', {
        data: json,
      });
    } catch (error) {
      this.setState({
        loading: null,
        error: true,
      });
      console.log(error);

      throw error;
    }
  };

  onVoucherClick = () => {
    const {navigate} = this.props.navigation;

    navigate('ActivityOverview', {
      data: this.state.existingVoucher,
    });
  };

  onRemove = async () => {
    this.setState({
      loading: {
        type: 'delete',
      },
    });

    try {
      const voucher = AsyncStorage.getItem('voucher');

      if (voucher != null) {
        // remove voucher
        await AsyncStorage.removeItem('voucher');

        // remove directory
        await RNFetchBlob.fs
          .unlink(`${RNFetchBlob.fs.dirs.DocumentDir}/${this.state.voucher}`)
          .catch(() => {
            /* do nothing */
          });

        // remove zip
        await RNFetchBlob.fs
          .unlink(`${RNFetchBlob.fs.dirs.DocumentDir}/${this.state.voucher}`)
          .catch(() => {
            /* do nothing */
          });
      }

      // delete all offline maps
      const packs = await MapboxGL.offlineManager.getPacks();
      await Promise.all(
        packs.map((pack) => MapboxGL.offlineManager.deletePack(pack.name)),
      );
    } catch (error) {
      throw error;
    } finally {
      this.setState({
        loading: null,
        existingVoucher: null,
      });
    }
  };

  loadOfflineMap = async () => {
    const coordinates = [];

    this.state.existingVoucher.days.forEach((day) => {
      if (day.markers) {
        coordinates.push(...day.markers);
      }

      if (day.track && day.track.routes) {
        day.track.routes.forEach((route) => {
          coordinates.push(...route);
        });
      }
    });

    if (!coordinates.length) {
      return;
    }

    const ne = [
      coordinates.reduce((min, point) => Math.min(min, point.longitude), 180),
      coordinates.reduce((max, point) => Math.max(max, point.latitude), -180),
    ];

    const sw = [
      coordinates.reduce((max, point) => Math.max(max, point.longitude), -180),
      coordinates.reduce((min, point) => Math.min(min, point.latitude), 180),
    ];

    // delete all packs
    const packs = await MapboxGL.offlineManager.getPacks();
    await Promise.all(
      packs.map((pack) => MapboxGL.offlineManager.deletePack(pack.name)),
    );

    // download pack
    await new Promise((resolve, reject) => {
      MapboxGL.offlineManager.createPack(
        {
          name: this.state.existingVoucher.id,
          styleURL: 'mapbox://styles/mapbox/outdoors-v12',
          minZoom: 0,
          maxZoom: 15,
          bounds: [ne, sw],
        },
        (offlineRegion, status) => {
          this.setState({
            loading: {
              type: 'map',
              progress: (status.percentage / 100.0) * 0.75 + 0.25,
            },
          });

          if (status.state === 2) {
            this.setState({
              loading: {
                type: 'map',
                progress: 1.0,
              },
            });

            console.log('offline map downloaded');

            resolve();
          }
        },
        (offlineRegion, err) => {
          reject(err);
          throw err;
        },
      );
    });
  };

  isVoucherExpired = () => {
    if (!this.state.existingVoucher) {
      return false;
    }

    if (!this.state.existingVoucher.expirationDate) {
      return false;
    }

    const expirationDate = parseISO(
      this.state.existingVoucher.expirationDate,
    ).getTime();
    return new Date().getTime() > expirationDate;
  };

  render() {
    return (
      <ImageBackground
        source={require('../assets/background-v.jpg')}
        resizeMode={'cover'}
        style={{width: '100%', height: '100%'}}>
        <View
          style={{flex: 1, alignItems: 'center', justifyContent: 'flex-end'}}>
          <StatusBar
            translucent
            backgroundColor="rgba(0,0,0,0)"
            barStyle="dark-content"
          />
          <View
            style={{
              width: '100%',
              height: '50%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {this.state.loading && (
              <View
                style={{
                  width: '60%',
                  height: 180,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: 10,
                }}>
                <Progress.Circle
                  size={80}
                  thickness={3}
                  showsText={true}
                  color={blueColor}
                  progress={this.state.loading.progress}
                  indeterminate={this.state.loading.type === 'delete'}
                />

                <Text
                  fontSize="lg"
                  style={{
                    width: '100%',
                    textAlign: 'center',
                    color: blueColor,
                    fontWeight: 'bold',
                    marginTop: 10,
                  }}>
                  {(this.state.loading.type === 'voucher' &&
                    'Loading Activity...') ||
                    (this.state.loading.type === 'map' &&
                      'Loading Offline Map...') ||
                    (this.state.loading.type === 'delete' &&
                      'Deleting Activity...') ||
                    ''}
                </Text>
              </View>
            )}
            {!this.state.loading && !this.state.existingVoucher && (
              <View style={{width: '50%', height: 102}}>
                <Input
                  style={{
                    width: '100%',
                    borderRadius: 2,
                    marginBottom: 10,
                    color: this.state.error ? '#FFF' : '#000',
                    backgroundColor: this.state.error
                      ? 'rgba(217, 83, 79, 0.8)'
                      : 'rgba(255, 255, 255, 0.8)',
                    textAlign: 'center',
                  }}
                  placeholder={this.state.focused ? '' : 'CODE'}
                  placeholderTextColor="#999"
                  value={this.state.voucher}
                  onFocus={() => this.setState({focused: true})}
                  onChangeText={(text) =>
                    this.setState({voucher: text, error: false})
                  }
                  onBlur={() => this.setState({focused: false})}
                />
                <Button
                  style={{
                    width: '100%',
                    backgroundColor: blueColor,
                    borderRadius: 6,
                  }}
                  onPress={this.onClick}>
                  {!this.state.loading && (
                    <Text
                      color="white"
                      style={{width: '100%', textAlign: 'center'}}>
                      Redeem
                    </Text>
                  )}
                  {this.state.loading && (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  )}
                </Button>
              </View>
            )}
            {!this.state.loading && this.state.existingVoucher && (
              <View style={{width: '60%', height: 120}}>
                <Button
                  style={{
                    width: '100%',
                    height: 80,
                    backgroundColor: this.isVoucherExpired()
                      ? grayColor
                      : blueColor,
                    borderRadius: 6,
                    justifyContent: 'center',
                    flexDirection: 'column',
                    marginBottom: 10,
                    padding: 20,
                  }}
                  disabled={this.isVoucherExpired()}
                  onPress={this.onVoucherClick}>
                  <VStack>
                    <Text
                      numberOfLines={1}
                      color="white"
                      fontWeight="semibold"
                      fontSize="xl">
                      {this.state.existingVoucher.title}
                    </Text>
                    {!this.isVoucherExpired() && (
                      <Text numberOfLines={1} color="white" fontSize="md">
                        {this.state.existingVoucher.subtitle}
                      </Text>
                    )}
                    {this.isVoucherExpired() && (
                      <Text style={{fontStyle: 'italic'}}>
                        This voucher has expired.
                      </Text>
                    )}
                  </VStack>
                </Button>
                <Button
                  style={{
                    width: '100%',
                    backgroundColor: redColor,
                    borderRadius: 6,
                    justifyContent: 'center',
                    flexDirection: 'column',
                  }}
                  small
                  onPress={this.onRemove}>
                  <Text color="white">Discard Voucher</Text>
                </Button>
              </View>
            )}
          </View>
        </View>
      </ImageBackground>
    );
  }
}

export default LoginScreen;
