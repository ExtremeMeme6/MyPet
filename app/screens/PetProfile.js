import React, {useState, useEffect} from "react";
import {StyleSheet, View, Image, Modal, Text, ScrollView, ActivityIndicator, Dimensions, TouchableOpacity, TextInput, Keyboard} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { database } from "../firebase";
import { ref, onValue} from "firebase/database";

function PetProfile({navigation, route}) {

    const [pet, setPet] = useState(undefined)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      async function fetchData(){
        const id = await AsyncStorage.getItem('@id')
        const petRef = ref(database, 'pets/' + id);
        onValue(petRef, (snapshot) => {
          setPet(snapshot.val())
          setLoading(false)
        });
      }
      return fetchData()
    }, [])

    return (
      <View style={styles.background}>
        {loading ?
          <View style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1b1717'}}>
            <ActivityIndicator size="large" color="#eeebdd" animating/>
          </View>
        : 
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
