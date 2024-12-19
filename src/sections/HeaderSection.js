import React from 'react';
import {StatusBar} from 'react-native';
import {
  Button,
  Text,
  HStack,
  View,
  VStack,
} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';

const blueColor = '#3254b7';

function HeaderSection({title, subtitle, navigation }){

    return (
      <View >
        <StatusBar
          translucent
          backgroundColor="rgba(40,70,153,255)"
          barStyle='light-content'
          animated
        />
        <HStack
          backgroundColor={blueColor}
          style={{marginTop: StatusBar.currentHeight}}
          padding={3}>
          <Button background="transparent" onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" color="white" size={20} />
          </Button>
          <View marginLeft={4}>
            <VStack >
              <Text
                color="white"
                flexShrink={1}
                numberOfLines={1}
                fontSize="2xl"
                fontWeight="semibold">
                {title}
              </Text>
              {subtitle && (
                <Text Text color="white" numberOfLines={1} fontSize="md">
                  {subtitle}
                </Text>
              )}
            </VStack>
          </View>
        </HStack>
      </View>
    );
  
}

export default HeaderSection;
