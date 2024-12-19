import React from 'react';
import {Dimensions, Image} from 'react-native';
import {Box, VStack} from 'native-base';
import HeaderSection from '../sections/HeaderSection';

function ActivityOverviewScreen({navigation, route}) {
    const data = route.params.data;

    return (
      <VStack style={{height: Dimensions.get('window').height}}>
        <HeaderSection title={data.title} subtitle={data.subtitle} navigation={navigation} />
        <Box bgColor="black" justifyContent="center" flex={1}>
          <Image
            source={{uri: data.source}}
            style={{
              width: Dimensions.get('window').width,
              height: '100%',
            }}
            resizeMode="contain"
          />
        </Box>
      </VStack>
    );

}

export default ActivityOverviewScreen;
