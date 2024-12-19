import React from 'react';
import AppRouter from './src/AppRouter';
import * as Sentry from '@sentry/react-native';
import {sentryKey} from './src/variables';
import { NativeBaseProvider } from 'native-base';
import './gesture-handler';

Sentry.init({
  dsn: sentryKey,
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
    };
  }

  async componentDidMount() {
    /*
        await Font.loadAsync({
            Roboto: require('native-base/Fonts/Roboto.ttf'),
            Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
            ...FontAwesome.font,
            ...Ionicons.font
        });
        */
    this.setState({isReady: true});
  }

  render() {
    /*
        if (!this.state.isReady) {
            return <AppLoading />;
        } else {
            return <AppRouter />;
        }
        */
    return (
      <NativeBaseProvider>
        <AppRouter />
      </NativeBaseProvider>
    );
  }
}

export default App;
