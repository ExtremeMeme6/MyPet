import React, { useState, useEffect} from "react";
import {View, SafeAreaView, Image, ScrollView, Text} from "react-native";
import {database} from '../firebase'
import {ref, onValue} from "firebase/database";
import ProgressCircle from 'react-native-progress-circle'
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Button from "../components/Button";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

function HomeScreen({navigation, route}) {

    async function registerForPushNotificationsAsync() {
        let token;
        if (Device.isDevice) {
          const { status: existingStatus } = await Notifications.getPermissionsAsync();
          let finalStatus = existingStatus;
          if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
          }
          if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
          }
          token = (await Notifications.getExpoPushTokenAsync()).data;
        } else {
          alert('Must use physical device for Push Notifications');
        }
      
        if (Platform.OS === 'android') {
          Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
          });
        }
      
        return token;
      }

    const [expoPushToken, setExpoPushToken] = useState('');
    const [averageBPM, setAverageBPM] = useState(0)
    const [temperature, setTemperature] = useState(0)
    const [hasEaten, setHasEaten] = useState(false)
    const [hasDrank, setHasDrank] = useState(false)
    const [hasLitter, setHasLitter] = useState(false)
    const [containerFood, setContainerFood] = useState(0)
    const [containerWater, setContainerWater] = useState(0)

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
      }, [])

    useEffect(() => {
      const databaseRef = ref(database);
      const listener = onValue(databaseRef, (snapshot) => {
        setAverageBPM(snapshot.val().AverageBPM)
        setTemperature(snapshot.val().Temperature.toFixed(1))
        // if(snapshot.val().Temperature.toFixed(1) >= 40 || snapshot.val().Temperature.toFixed(1) <= 20){
        //     const message = {
        //         to: expoPushToken,
        //         sound: 'default',
        //         title: 'Critical Pet Temperature Level',
        //         body: 'Current pet temperature: ' + snapshot.val().Temperature,
        //     };
        //     fetch('https://exp.host/--/api/v2/push/send', {
        //         method: 'POST',
        //         headers: {
        //         Accept: 'application/json',
        //         'Accept-encoding': 'gzip, deflate',
        //         'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify(message),
        //     });
        // }
        setHasEaten(snapshot.val().HasEaten)
        setHasDrank(snapshot.val().HasDrank)
        setHasLitter(snapshot.val().HasLitter)
        setContainerFood(snapshot.val().foodContainer)
        // if(snapshot.val().foodContainer <= 100){
        //     const message = {
        //         to: expoPushToken,
        //         sound: 'default',
        //         title: 'Food Container Level Low',
        //         body: 'Current food container level: ' + snapshot.val().foodContainer + " G",
        //     };
        //     fetch('https://exp.host/--/api/v2/push/send', {
        //         method: 'POST',
        //         headers: {
        //         Accept: 'application/json',
        //         'Accept-encoding': 'gzip, deflate',
        //         'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify(message),
        //     });
        // }
        setContainerWater(snapshot.val().waterContainer)
        // if(snapshot.val().waterContainer <= 50){
        //     const message = {
        //         to: expoPushToken,
        //         sound: 'default',
        //         title: 'Water Container Level Low',
        //         body: 'Water container is almost empty',
        //     };
        //     fetch('https://exp.host/--/api/v2/push/send', {
        //         method: 'POST',
        //         headers: {
        //         Accept: 'application/json',
        //         'Accept-encoding': 'gzip, deflate',
        //         'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify(message),
        //     });
        // }
      });
      return () => listener
    }, [])

    return (
            <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1, backgroundColor: '#1B1717'}} contentContainerStyle={{alignItems: 'center', display: 'flex', flexDirection: 'column'}}>
                <Text style={{fontFamily: 'roboto-700', fontSize: 20, marginTop: 20, marginLeft: 20, color: '#eeebdd', alignSelf: 'flex-start'}}>Water Level: <Text style={{color: containerWater < 50 ? '#ce1212' : '#0f0'}}>{containerWater < 50 ? 'LOW' : 'OK'}</Text></Text>
                <Text style={{fontFamily: 'roboto-700', fontSize: 20, marginTop: 20, marginLeft: 20, color: '#eeebdd', alignSelf: 'flex-start'}}>Has Eaten: <Text style={{color: hasEaten === 0 ? '#ce1212' : '#0f0'}}>{hasEaten === 0 ? 'No' : 'Yes'}</Text></Text>
                <Text style={{fontFamily: 'roboto-700', fontSize: 20, marginTop: 20, marginLeft: 20, color: '#eeebdd', alignSelf: 'flex-start'}}>Has Drank: <Text style={{color: hasDrank === 0 ? '#ce1212' : '#0f0'}}>{hasDrank === 0 ? 'No' : 'Yes'}</Text></Text>
                <Text style={{fontFamily: 'roboto-700', fontSize: 20, marginTop: 20, marginLeft: 20, color: '#eeebdd', alignSelf: 'flex-start'}}>Has Visted the Litter Box: <Text style={{color: hasLitter === 0 ? '#ce1212' : '#0f0'}}>{hasLitter === 0 ? 'No' : 'Yes'}</Text></Text>
                <Text style={{fontFamily: 'roboto-700', color: '#eeebdd', fontSize: 25, marginTop: 20, marginBottom: 20}}>Temperature</Text>
                <ProgressCircle percent={(temperature / 45) * 100} radius={80} borderWidth={8} color="#F0A500" shadowColor="#505050" bgColor="#1b1717">
                    <Text style={{fontSize: 18, color: '#eeebdd', fontFamily: 'roboto-700'}}>{temperature + '°C'}</Text>
                </ProgressCircle>
                <Text style={{fontFamily: 'roboto-700', color: '#eeebdd', fontSize: 25, marginTop: 20, marginBottom: 20}}>Heart Rate</Text>
                <ProgressCircle percent={(averageBPM / 150) * 100} radius={80} borderWidth={8} color="#CE1212" shadowColor="#505050" bgColor="#1b1717">
                    <Text style={{fontSize: 18, color: '#eeebdd', fontFamily: 'roboto-700'}}>{averageBPM + ' BPM'}</Text>
                </ProgressCircle>
                <Text style={{fontFamily: 'roboto-700', color: '#eeebdd', fontSize: 25, marginTop: 20, marginBottom: 20}}>Food Container</Text>
                <ProgressCircle percent={(containerFood / 1500) * 100} radius={80} borderWidth={8} color="#0f0" shadowColor="#505050" bgColor="#1b1717">
                    <Text style={{fontSize: 18, color: '#eeebdd', fontFamily: 'roboto-700'}}>{containerFood + ' G'}</Text>
                </ProgressCircle>
                <Button onPress={() => navigation.navigate("Pet Profile")} title={'Go To Pet Profile'} style={{height: 50, width: '85%', color: '#1B1717', backgroundColor: "#EEEBDD", fontSize: 17, marginTop: 20, marginBottom: 10}}/>             
            </ScrollView>
  );
}

export default HomeScreen;
