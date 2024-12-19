import React from 'react';
import {Button, Text, HStack, VStack} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';

function checkIfScreen(state, screenName) {
  if (state == screenName) return true;
  return false;
}

const blueColor = '#3254b7';

class DayFooterSection extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const hasDirections =
      this.props.data.directions && this.props.data.directions !== '';
    const hasMap =
      (this.props.data.track &&
        this.props.data.track.routes &&
        this.props.data.track.routes.length) ||
      (this.props.data.markers && this.props.data.markers.length);

    return (
      <HStack justifyContent="space-around" backgroundColor={blueColor}>
        <Button
          flex={1}
          background="transparent"
          active={checkIfScreen(this.props.route.name, 'DayOverview')}
          onPress={() =>
            this.props.navigation.navigate('DayOverview', {
              data: this.props.data,
              date: this.props.date,
              day: this.props.day,
            })
          }>
          <VStack alignItems="center">
            <Icon
              color={
                checkIfScreen(this.props.route.name, 'DayOverview')
                  ? 'white'
                  : 'rgb(180,180,180)'
              }
              name="bullseye"
              size={20}
            />
            <Text
              color={
                checkIfScreen(this.props.route.name, 'DayOverview')
                  ? 'white'
                  : 'rgb(180,180,180)'
              }
              fontSize="sm">
              OVERVIEW
            </Text>
          </VStack>
        </Button>

        {hasDirections ? (
          <Button
            flex={1}
            background="transparent"
            active={checkIfScreen(this.props.route.name, 'DayDirections')}
            // disabled={!hasDirections}
            onPress={() =>
              this.props.navigation.navigate('DayDirections', {
                data: this.props.data,
                date: this.props.date,
                day: this.props.day,
              })
            }>
            <VStack alignItems="center">
              <Icon
                color={
                  checkIfScreen(this.props.route.name, 'DayDirections')
                    ? 'white'
                    : 'rgb(180,180,180)'
                }
                name="map-signs"
                size={20}
              />
              <Text
                color={
                  checkIfScreen(this.props.route.name, 'DayDirections')
                    ? 'white'
                    : 'rgb(180,180,180)'
                }
                fontSize="sm">
                DIRECTIONS
              </Text>
            </VStack>
          </Button>
        ) : <></>}
        {hasMap ? (
          <Button
            flex={1}
            background="transparent"
            // disabled={!hasMap}
            active={checkIfScreen(this.props.route.name, 'DayMap')}
            onPress={() =>
              this.props.navigation.navigate('DayMap', {
                data: this.props.data,
                date: this.props.date,
                day: this.props.day,
              })
            }>
            <VStack alignItems="center">
              <Icon
                color={
                  checkIfScreen(this.props.route.name, 'DayMap')
                    ? 'white'
                    : 'rgb(180,180,180)'
                }
                name="map"
                size={20}
              />
              <Text
                color={
                  checkIfScreen(this.props.route.name, 'DayMap')
                    ? 'white'
                    : 'rgb(180,180,180)'
                }
                fontSize="sm">
                MAP
              </Text>
            </VStack>
          </Button>
        ): <></>}
      </HStack>
    );
  }
}

export default DayFooterSection;
