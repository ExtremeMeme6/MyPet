import React, { useState } from "react";
import { Image } from "react-native";
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {ActionSheetProvider, connectActionSheet} from '@expo/react-native-action-sheet';
import HomeScreen from './app/screens/HomeScreen';
import PetProfile from "./app/screens/PetProfile";
import RegisterPet from "./app/screens/RegisterPet";

const Stack = createStackNavigator();

function App() {
  
  const [loading, setLoading] = useState(true)

  const _loadAssetsAsync = async() =>{
    let images = [    
      require('./app/assets/arrow-back.png'),
      require('./app/assets/edit.png'),
      require('./app/assets/peticon.png'),
      require('./app/assets/male.png'),
      require('./app/assets/female.png'),
      require('./app/assets/add.png'),
    ]

    await AsyncStorage.clear()
  
    let fonts = [
      {'roboto-700': require('./app/assets/fonts/roboto-700.ttf')},
      {'archivo-black-regular': require('./app/assets/fonts/archivo-black-regular.ttf')},
      {'roboto-regular': require('./app/assets/fonts/roboto-regular.ttf')},
    ]
  
    const imageAssets = images.map((image) => {
      if (typeof image == "string") {
        return Image.prefetch(image);
      } else {
        return Asset.fromModule(image).downloadAsync();
      }
    });
  
    const fontAssets = fonts.map(font => Font.loadAsync(font));
  
    await Promise.all(imageAssets);
    await Promise.all(fontAssets);
  }

    if(loading){
      return(
        <AppLoading
          startAsync={_loadAssetsAsync}
          onFinish={() => setLoading(false)}
          onError={console.warn}
        />
      )
    }
    else{
      return (
        <NavigationContainer>
          <Stack.Navigator screenOptions={{headerStyle: {backgroundColor: '#151010', shadowColor: '#100505'}, headerTintColor: '#eeebdd', headerBackTitleVisible: false, headerBackImage: () => <Image source={require('./app/assets/arrow-back.png')} style={{width: 30, height: 35, marginLeft: 20}} />}}>
            <Stack.Screen name="Home" component={HomeScreen} options={{headerLeft: () => null}}/>
            <Stack.Screen name="Pet Profile" component={PetProfile}/>
            <Stack.Screen name="Register Pet" component={RegisterPet}/>
          </Stack.Navigator>
        </NavigationContainer>
      );
    }
  }

const ConnectedApp = connectActionSheet(App);

export default class AppContainer extends React.Component {
  render() {
    return (
      <ActionSheetProvider>
        <ConnectedApp />
      </ActionSheetProvider>
    );
  }
}