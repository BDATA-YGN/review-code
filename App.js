import {Provider} from 'react-redux';
import {useEffect} from 'react';
import {store} from './src/stores/store';
import AppNavigator from './src/routes/AppNavigator';

import SplashScreen from 'react-native-splash-screen';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import MyAccount from './src/screens/GeneralSettings/MyAccount';
//test_commit

const App = () => {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{flex: 1}}>
        <AppNavigator />
     
      </GestureHandlerRootView>
    </Provider>
  );
};
export default App;
