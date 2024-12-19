import React from 'react';
import {Dimensions, PermissionsAndroid, StyleSheet} from 'react-native';
import {Box, Button, View, VStack, ZStack} from 'native-base';
import MapboxGL from '@rnmapbox/maps';
import {UserLocationRenderMode} from '@rnmapbox/maps';
import {lineString} from '@turf/helpers';
import {mapboxKey, brandPrimary} from '../variables';
import Icon from 'react-native-vector-icons/FontAwesome6';
import IconClose from 'react-native-vector-icons/Fontisto';
import Toast from 'react-native-simple-toast';

import HeaderSection from '../sections/HeaderSection';
import DayFooterSection from '../sections/DayFooterSection';

MapboxGL.setWellKnownTileServer('Mapbox');
MapboxGL.setAccessToken(mapboxKey);

class DayMapScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dimensions: undefined,
      location: undefined,
      navigate: false,
    };
  }

  componentDidMount() {
    MapboxGL.setTelemetryEnabled(false);
    // request location permission
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Legendary Adventure Location Permission',
        message:
          'Legendary Adventure needs needs access to your location to assist you on the map.',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    )
      .then((permissionStatus) => {
        if (permissionStatus !== PermissionsAndroid.RESULTS.GRANTED) {
          this.showToast('Location permission denied.');
        }
      })
      .catch((error) => {
        console.warn(error);
      });
  }

  computeInitialBounds = () => {
    const data = this.props.route.params.data;
    const coordinates = [];

    if (data.markers) {
      coordinates.push(...data.markers);
    }

    if (data.track && data.track.routes) {
      data.track.routes.forEach((route) => {
        coordinates.push(...route);
      });
    }

    if (!coordinates.length) {
      return {
        bounds: {
          ne: [-180, 90],
          sw: [180, -90],
        },
      };
    }

    const ne = [
      coordinates.reduce((min, point) => Math.min(min, point.longitude), 180),
      coordinates.reduce((max, point) => Math.max(max, point.latitude), -180),
    ];

    const sw = [
      coordinates.reduce((max, point) => Math.max(max, point.longitude), -180),
      coordinates.reduce((min, point) => Math.min(min, point.latitude), 180),
    ];

    return {
      ne: ne,
      sw: sw,
      paddingLeft: 50,
      paddingRight: 50,
      paddingTop: 50,
      paddingBottom: 50,
    };
  };

  onLayout = (event) => {
    const {width, height} = event.nativeEvent.layout;

    this.setState({
      dimensions: {
        width: width,
        height: height,
      },
    });
  };

  onUserLocationUpdate = (location) => {
    this.setState({
      location: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
    });
  };

  onFitToUser = () => {
    if (!this.state.location) {
      this.showToast('Could not detect location.');
      return;
    }

    this.setState(
      {
        navigate: false,
      },
      () => {
        this.camera.setCamera({
          centerCoordinate: [
            this.state.location.longitude,
            this.state.location.latitude,
          ],
          zoomLevel: 16,
          heading: 0,
          pitch: 0,
          animationDuration: 200,
        });
      },
    );
  };

  onFitToTrack = () => {
    this.setState(
      {
        navigate: false,
      },
      () => {
        const initialBounds = this.computeInitialBounds();

        console.log(initialBounds)
        this.camera.setCamera({
          bounds: {
            ne: initialBounds.ne,
            sw: initialBounds.sw,
            paddingLeft: 50,
            paddingRight: 50,
            paddingTop: 50,
            paddingBottom: 50,
          },
          heading: 0,
          pitch: 0,
          animationDuration: 200,
        });
      },
    );
  };

  onNavigate = () => {
    if (!this.state.location) {
      this.showToast('Could not detect location.');
      return;
    }

    this.setState(
      (state) => {
        return {
          navigate: !state.navigate,
        };
      },
      () => {
        if (!this.state.navigate) {
          this.onFitToTrack();
        }
      },
    );
  };

  renderRoutes() {
    const data = this.props.route.params.data
    const routes = [];

    if (!data.track || !data.track.routes) {
      return;
    }

    data.track.routes.map((route, i) => {
      const line = lineString(
        route.map((point) => [point.longitude, point.latitude]),
      );

      routes.push(
        <MapboxGL.ShapeSource
          key={`route-${i}`}
          id={`routeSource-${i}`}
          shape={line}>
          <MapboxGL.LineLayer
            id={`routeFill-${i}`}
            style={{
              lineColor: brandPrimary,
              lineCap: MapboxGL.LineJoin.Round,
              lineWidth: 4,
              lineOpacity: 0.8,
            }}
          />
        </MapboxGL.ShapeSource>,
      );
    });

    return routes;
  }

  renderMarkers() {
    const data = this.props.route.params.data
    const markers = [];

    if (!data.markers) {
      return;
    }

    data.markers.map((marker, i) => {
      markers.push(
        <MapboxGL.PointAnnotation
          key={`marker-${i}`}
          id={`marker-${i}`}
          coordinate={[marker.longitude, marker.latitude]}>
          <MapboxGL.Callout
            id={`marker-callout-${i}`}
            title={marker.description}
          />
        </MapboxGL.PointAnnotation>,
      );
    });

    return markers;
  }

  showToast(message) {
    Toast.show(message, 5000);
  }

  render() {
    const data = this.props.route.params.data
    const date = this.props.route.params.date
    const day = this.props.route.params.day

    return (
      <VStack flexDirection="column" justifyContent="space-between" flex={1}>
        <HeaderSection title={data.title} subtitle={`Day ${day}  •  ${date}`} navigation={this.props.navigation}/>
        <ZStack
          onLayout={this.onLayout}
          flex={1}
          alignItems="flex-end"
          flexDir="column"
          justifyContent="flex-end">
          {this.state.dimensions ? (
            <View
              style={{
                // width: this.state.dimensions.width,
                // height: this.state.dimensions.height,
                width: Dimensions.get('window').width,
                height: '100%',
              }}>
              <MapboxGL.MapView
                ref={(ref) => {
                  this.map = ref;
                }}
                style={{flex: 1}}
                styleURL={'mapbox://styles/mapbox/outdoors-v12'}
                // logoEnabled={false}
                // attributionEnabled={false}
              >
                <MapboxGL.Camera
                  ref={(ref) => {
                    this.camera = ref;
                  }}
                  defaultSettings={{
                    bounds: this.computeInitialBounds(),
                  }}
                  // zoomLevel={10}
                  // animationDuration={1000}
                  // centerCoordinate={this.state.navigate && this.state.location && this.state.location.latitude ? [this.state.location.latitude, this.state.location.longitude] : undefined}

                  // navigation mode
                  followUserLocation={this.state.navigate}
                  followUserMode={'compass'}
                  followZoomLevel={16}
                  followPitch={90}
                  animationMode='flyTo'
                  animationDuration={2000}
                  
                />

                {this.renderRoutes()}

                {this.renderMarkers()}

                <MapboxGL.UserLocation
                  minDisplacement={1}
                  renderMode={'normal'}
                  animated
                  showsUserHeadingIndicator
                  onUpdate={this.onUserLocationUpdate}
                />
              </MapboxGL.MapView>
            </View>
          ) : undefined}

          <VStack padding={1}>
            {this.state.navigate && (
              <Button
                borderRadius={100}
                w={50}
                h={50}
                margin={1}
                backgroundColor="rgba(255, 255, 255, 0.8)"
                onPress={this.onNavigate}>
                <IconClose name="close-a" size={20} />
              </Button>
            )}
            {!this.state.navigate && (
              <Button
                backgroundColor="#3254b7"
                borderRadius={100}
                w={50}
                h={50}
                margin={1}
                onPress={this.onNavigate}>
                <Icon name="location-arrow" color="white" size={20} />
              </Button>
            )}
            <Button
              backgroundColor="rgba(255, 255, 255, 0.8)"
              borderRadius={100}
              w={50}
              h={50}
              margin={1}
              onPress={this.onFitToUser}>
              <Icon name="location-crosshairs" size={20} />
            </Button>
            <Button
              backgroundColor="rgba(255, 255, 255, 0.8)"
              borderRadius={100}
              w={50}
              h={50}
              margin={1}
              onPress={this.onFitToTrack}>
              <Icon name="route" size={20} />
            </Button>
          </VStack>
        </ZStack>
        <DayFooterSection data={data} date={date} day={day} navigation={this.props.navigation} route={this.props.route} />
      </VStack>
    );
  }
}

export default DayMapScreen;
