import React from 'react';
import {ScrollView, VStack, Text} from 'native-base';
import HeaderSection from '../sections/HeaderSection';
import SlideshowSection from '../sections/SlideshowSection';
import DayFooterSection from '../sections/DayFooterSection';
import RichText from '../sections/RichText';

function DayOverviewScreen({navigation, route}) {
    const data = route.params.data;
    const date = route.params.date;
    const day = route.params.day

    return (
      <VStack flexDirection="column" flex={1} justifyContent="space-between">
        <HeaderSection title={data.title} subtitle={`Day ${day}  •  ${date}`} navigation={navigation}/>
        <ScrollView padding={2}>
          <Text fontSize="3xl" fontWeight="semibold">
            Day Overview
          </Text>
          <SlideshowSection images={data.images} navigation={navigation}/>
          <RichText html={data.description} />
        </ScrollView>
        <DayFooterSection data={data} date={date} day={day} navigation={navigation} route={route}/>
      </VStack>
    );
  }


export default DayOverviewScreen;
