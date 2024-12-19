import React from 'react';
import {Button, Text, HStack, VStack} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';

const blueColor = '#3254b7';

class ActivityFooterSection extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const isActivityOverview = this.props.route.name === 'ActivityOverview';

    return (
      <HStack justifyContent="space-evenly" backgroundColor={blueColor}>
        <Button
          flex={1}
          background="transparent"
          active={isActivityOverview}
          onPress={() => this.props.navigation.navigate('ActivityOverview', {data: this.props.data})}>
          <VStack alignItems="center">
            <Icon
              color={isActivityOverview ? 'white' : 'rgb(180,180,180)'}
              name="bullseye"
              size={20}
            />
            <Text
              color={isActivityOverview ? 'white' : 'rgb(180,180,180)'}
              fontSize="sm">
              OVERVIEW
            </Text>
          </VStack>
        </Button>
        <Button
          flex={1}
          background="transparent"
          active={isActivityOverview}
          onPress={() => this.props.navigation.navigate('ActivityOverview', {data: this.props.data})}>
          <VStack alignItems="center">
            <Icon
              color={isActivityOverview ? 'white' : 'rgb(180,180,180)'}
              name="bullseye"
              size={20}
            />
            <Text
              color={isActivityOverview ? 'white' : 'rgb(180,180,180)'}
              fontSize="sm">
              PDFs
            </Text>
          </VStack>
        </Button>
        <Button
          flex={1}
          background="transparent"
          active={!isActivityOverview}
          onPress={() => this.props.navigation.navigate('ActivityDays', {data: this.props.data})}>
          <VStack alignItems="center">
            <Icon
              color={!isActivityOverview ? 'white' : 'rgb(180,180,180)'}
              name="calendar-alt"
              size={20}
            />
            <Text
              color={!isActivityOverview ? 'white' : 'rgb(180,180,180)'}
              fontSize="sm">
              DAYS
            </Text>
          </VStack>
        </Button>
      </HStack>
    );
  }
}

export default ActivityFooterSection;
