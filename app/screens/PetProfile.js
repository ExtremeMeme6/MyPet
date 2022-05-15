import React, {useState, useEffect} from "react";
import {StyleSheet, View, Image, Modal, Text, ScrollView, ActivityIndicator, Dimensions, TouchableOpacity, TextInput, Keyboard} from "react-native";
import Button from "../components/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";

function PetProfile({navigation, route}) {

    const [pet, setPet] = useState(null)

    useEffect(() => {
        async function fetchData(){
            const obj = await AsyncStorage.getItem('@pet')
            setPet(JSON.parse(obj))
        }
        fetchData()
    }, [])

    return (
      <View style={styles.background}>
        {pet ?
          <View style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Image source={pet.uri ? {uri: pet.uri} : require("../assets/peticon.png")} style={{width: 70, height: 70, borderRadius: 22, marginTop: 20}}/>
            <Text style={{fontFamily: 'roboto-700', marginTop: 20, color: '#eeebdd'}}>Name: {pet.name}</Text>
            <Text style={{fontFamily: 'roboto-700', marginTop: 20, color: '#eeebdd'}}>Age: {pet.age}</Text>
            <Text style={{fontFamily: 'roboto-700', marginTop: 20, color: '#eeebdd'}}>Gender: {pet.gender}</Text>
            <Text style={{fontFamily: 'roboto-700', marginTop: 20, color: '#eeebdd'}}>Weight: {pet.weight}</Text>
            <Text style={{fontFamily: 'roboto-700', marginTop: 20, color: '#eeebdd'}}>Type: {pet.type}</Text>
            {pet.type === 'Dog' ? <Text style={{fontFamily: 'roboto-700', marginTop: 20, color: '#eeebdd'}}>Breed: {pet.breed}</Text> : null}
            <Text style={{fontFamily: 'roboto-700', marginTop: 20, color: '#eeebdd'}}>Diseases:</Text>
            {pet.diseases.map((disease, index) => (
              <Text key={index} style={{fontFamily: 'roboto-regular', marginTop: 20, color: '#eeebdd'}}>{disease}</Text>
            ))}
          </View>
        : 
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column'}}>
                <Text style={{fontFamily: 'roboto-700', fontSize: 20, color: '#eeebdd'}}>No Pet Registered</Text>
                <Text style={{fontFamily: 'roboto-regular', fontSize: 18, color: '#eeebdd', marginTop: 10, marginRight: 50, marginLeft: 50, textAlign: 'center'}}>It looks like you don't have any pets registered</Text>
                <Button onPress={() => navigation.navigate("Register Pet")} title={'Register Pet'} style={{height: 50, width: '85%', color: '#1B1717', backgroundColor: "#EEEBDD", fontSize: 17, marginTop: 20}}/>
            </View>
        }
      </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#1B1717',
    display: 'flex',
    flexDirection: 'column',
  }
});

export default PetProfile;
