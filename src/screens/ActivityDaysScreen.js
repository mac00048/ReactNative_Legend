import React from 'react';
import {Image, TouchableOpacity} from 'react-native';
import {
  Text,
  Body,
  VStack,
  View,
  ScrollView,
  HStack,
  Divider,
} from 'native-base';
import {format, parseISO, addDays} from 'date-fns';

import Icon from 'react-native-vector-icons/FontAwesome5';
import HeaderSection from '../sections/HeaderSection';
import ActivityFooterSection from '../sections/ActivityFooterSection';

function ActivityDaysScreen({navigation, route}) {

  function calculateDate(startDate, index) {
    const date = parseISO(startDate);
    return format(addDays(date, index), 'yyyy-MM-dd');
  }
    const data = route.params.data;

    return (
      <VStack flexDirection="column" flex={1} justifyContent="space-between">
        <HeaderSection title={data.title} subtitle={data.subtitle} navigation={navigation}/>
        <ScrollView>
          {data.days.map((day, i) => (
            <TouchableOpacity 
            key={i}
            onPress={() =>
              navigation.navigate('DayOverview', {
                data: day,
                date: calculateDate(data.startDate, i),
                day: i + 1,
              })
            }>
            <VStack>
              <HStack
                padding={7}
                flexDirection="row"
                justifyContent="space-between"
                key={day.id}
                alignItems="center">
                <Image
                  square
                  large
                  source={
                    day.images.length > 0 ? {uri: day.images[0].source} : ''
                  }
                  flex={1}
                  style={{
                    width: 150,
                    height: 100,
                  }}
                />
                <VStack flex={2} paddingLeft={4} paddingRight={4}>
                  <Text fontSize="lg" fontWeight="semibold">
                    {day.title}
                  </Text>
                  <Text fontSize="lg" color="gray.500">
                    Day {i + 1} • {calculateDate(data.startDate, i)}
                  </Text>
                </VStack>
                <Icon name="arrow-right" size={20} color="rgb(130, 130, 130)" />
              </HStack>
              <Divider />
            </VStack>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <ActivityFooterSection data={data} navigation={navigation} route={route}/>
      </VStack>
    );
  
}

export default ActivityDaysScreen;
