import React from 'react';
import {Text, VStack, ScrollView} from 'native-base';

import HeaderSection from '../sections/HeaderSection';
import DayFooterSection from '../sections/DayFooterSection';
import RichText from '../sections/RichText';

function DayDirectionsScreen({navigation, route}) {
    const data = route.params.data;
    const date = route.params.date;
    const day = route.params.day;

    return (
      <VStack flexDirection="column" justifyContent="space-between" flex={1}>
        <HeaderSection title={data.title} subtitle={`Day ${day}  •  ${date}`} navigation={navigation}/>
        <ScrollView padding={2}>
          <Text fontSize="3xl" fontWeight="semibold">
            Directions
          </Text>
          <RichText html={data.directions} />
        </ScrollView>
        <DayFooterSection data={data} date={date} day={day} navigation={navigation} route={route}/>
      </VStack>
    );
  
}

export default DayDirectionsScreen;
