import React from 'react';
import {ScrollView, Text, VStack, View} from 'native-base';
import HeaderSection from '../sections/HeaderSection';
import SlideshowSection from '../sections/SlideshowSection';
import ActivityFooterSection from '../sections/ActivityFooterSection';
import RichText from '../sections/RichText';

class ActivityOverviewScreen extends React.Component {
  constructor(props) {
    super(props);
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
          <View></View>
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
