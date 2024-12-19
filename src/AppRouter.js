import LoginScreen from './screens/LoginScreen';
import ActivityOverviewScreen from './screens/ActivityOverviewScreen';
import ActivityDaysScreen from './screens/ActivityDaysScreen';
import DayOverviewScreen from './screens/DayOverviewScreen';
import DayDirectionsScreen from './screens/DayDirectionsScreen';
import DayMapScreen from './screens/DayMapScreen';
import ImageScreen from './screens/ImageScreen';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// const config = {
//     headerMode: 'none',
//     // initialRouteName: 'Login',
//     // transitionConfig: () => ({
//     //     transitionSpec: {
//     //         duration: 0
//     //     }
//     // })
// };

// const ActivityNavigator = createSwitchNavigator({
//     ActivityOverview: { screen: ActivityOverviewScreen },
//     ActivityDays: { screen: ActivityDaysScreen }
// }, config);

// const DayNavigator = createSwitchNavigator({
//     DayOverview: { screen: DayOverviewScreen },
//     DayDirections: { screen: DayDirectionsScreen },
//     DayMap: { screen: DayMapScreen }
// }, config);

// const MainNavigator = createStackNavigator({
//     Login: { screen: LoginScreen },
//     Activity: ActivityNavigator,
//     Day: DayNavigator,
//     Image: { screen: ImageScreen }
// }, config);

const DayStack = createStackNavigator();
const ActivityStack = createStackNavigator();
const MainStack = createStackNavigator();


function ActivityNavigator() {
    return (

        <ActivityStack.Navigator
        screenOptions={{
            headerShown: false,
        }}>
                <ActivityStack.Screen name="ActivityOverview" component={ActivityOverviewScreen} />
                <ActivityStack.Screen name="ActivityDays" component={ActivityDaysScreen} />

        </ActivityStack.Navigator>
    )
}


function DayNavigator() {
    return (

        <DayStack.Navigator
        screenOptions={{
            headerShown: false,
        }}>
                <DayStack.Screen name="DayOverview" component={DayOverviewScreen} />
                <DayStack.Screen name="DayDirections" component={DayDirectionsScreen} />
                <DayStack.Screen name="DayMap" component={DayMapScreen} />

        </DayStack.Navigator>
    )
}

function AppRouter() {
    return (
        <NavigationContainer>
            <MainStack.Navigator
                initialRouteName="Login"
                screenOptions={{
                    headerShown: false,
                }}>
                <MainStack.Screen name="Login" component={LoginScreen} />
                {/* <MainStack.Screen name="Activity" component={ActivityNavigator} /> */}
                <MainStack.Screen name="ActivityOverview" component={ActivityOverviewScreen} />
                <MainStack.Screen name="ActivityDays" component={ActivityDaysScreen} />
                {/* <MainStack.Screen name="Day" component={DayNavigator} /> */}

                <MainStack.Screen name="DayOverview" component={DayOverviewScreen} />
                <MainStack.Screen name="DayDirections" component={DayDirectionsScreen} />
                <MainStack.Screen name="DayMap" component={DayMapScreen} />
                <MainStack.Screen name="Image" component={ImageScreen} />
            </MainStack.Navigator>
        </NavigationContainer>
    );
}

export default AppRouter;
