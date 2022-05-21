import React, { useState } from "react";
import {StyleSheet, View, Image, Modal, Text, ScrollView, ActivityIndicator, Dimensions, TouchableOpacity, TextInput, Keyboard} from "react-native";
import Button from "../components/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from 'react-native-uuid';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { database } from "../firebase";
import { ref, set } from "firebase/database";

function RegisterPet({navigation, route}) {

    const [tempUri, setTempUri] = useState(null)
    const [name, setName] = useState('')
    const [age, setAge] = useState('')
    const [weight, setWeight] = useState('')
    const [gender, setGender] = useState('')
    const [type, setType] = useState('')
    const [breed, setBreed] = useState('')
    const [firstMeal, setFirstMeal] = useState('')
    const [secondMeal, setSecondMeal] = useState('')
    const [diseases, setDiseases] = useState([])

    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {
      setLoading(true)
      const pet = {
        uri: tempUri,
        name: name,
        age: age,
        weight: weight,
        gender: gender,
        type: type,
        breed: breed,
        diseases: diseases,
        firstMeal: firstMeal,
        secondMeal: secondMeal
      }
      let id = uuid.v4()
      await AsyncStorage.setItem('@id', id)
      set(ref(database, 'pets/' + id), pet);
      setLoading(false)
      navigation.navigate("Home")
    }

    const handleImageSelection = async() => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
        else{
          let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            base64: true,
            aspect: [4, 3],
            quality: 0.7,
          });
          if (!result.cancelled) {         
            let smol = await ImageManipulator.manipulateAsync(
              result.uri,
              [{resize: {width: result.width / 4}}],
              { compress: 0.5, base64: true }
            );
            setTempUri(`data:image/*;base64,${smol.base64}`)
          }
        }
      }

    return (
      <View style={styles.background}>
        <ScrollView>
          <Image source={tempUri ? {uri: tempUri} : require("../assets/peticon.png")} style={{width: 70, height: 70, borderRadius: 22, alignSelf: 'center', marginTop: 20}}/>
          <TouchableOpacity onPress={() => handleImageSelection()} style={{width: 70, height: 70, borderRadius: 22, alignSelf: 'center', backgroundColor: '#000', marginTop: -70, opacity: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Image source={require("../assets/edit.png")} style={{width: 30, height: 30}}/>
          </TouchableOpacity>
          <TextInput maxLength={50} selectionColor={'#eeebdd'} keyboardAppearance="dark" style={{height: 50, width: "85%", backgroundColor: "transparent", borderBottomWidth: 1, borderBottomColor: '#505050', paddingLeft: 5, color: "#eeebdd", fontSize: 17, fontFamily: "roboto-regular", marginTop: 20, alignSelf: 'center'}} placeholderTextColor={'#696969'} placeholder={'Pet Name'} onChangeText={(text) => setName(text)} value={name}/>
          <View style={{width: '85%', alignSelf: 'center', marginTop: 30, height: 60, display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
            <TouchableOpacity onPress={() => setGender('Male')} style={{width: 170, height: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: gender === 'Male' ? 'green' : '#eeebdd', borderRadius: 10}}>
              <Image source={require("../assets/male.png")} style={{height: 20, width: 20, tintColor: gender === 'Male' ? 'green' : '#eeebdd'}}/>
              <Text style={{fontFamily: 'roboto-700', color: gender === 'Male' ? 'green' : '#eeebdd', marginLeft: 5}}>Male</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setGender('Female')} style={{width: 170, height: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: gender === 'Female' ? 'green' : '#eeebdd', borderRadius: 10}}>
              <Image source={require("../assets/female.png")} style={{height: 20, width: 20, tintColor: gender === 'Female' ? 'green' : '#eeebdd'}}/>
              <Text style={{fontFamily: 'roboto-700', color: gender === 'Female' ? 'green' : '#eeebdd', marginLeft: 5}}>Female</Text>
            </TouchableOpacity>
          </View>
          <View style={{width: '85%', alignSelf: 'center', marginTop: 30, height: 60, display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
            <TouchableOpacity onPress={() => setType('Cat')} style={{width: 170, height: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: type === 'Cat' ? 'green' : '#eeebdd', borderRadius: 10}}>
              <Text style={{fontFamily: 'roboto-700', color: type === 'Cat' ? 'green' : '#eeebdd', marginLeft: 5}}>Cat</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setType('Dog')} style={{width: 170, height: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: type === 'Dog' ? 'green' : '#eeebdd', borderRadius: 10}}>
              <Text style={{fontFamily: 'roboto-700', color: type === 'Dog' ? 'green' : '#eeebdd', marginLeft: 5}}>Dog</Text>
            </TouchableOpacity>
          </View>
          {type === 'Dog' ?
            <TextInput maxLength={50} selectionColor={'#eeebdd'} keyboardAppearance="dark" style={{height: 50, width: "85%", backgroundColor: "transparent", borderBottomWidth: 1, borderBottomColor: '#505050', paddingLeft: 5, color: "#eeebdd", fontSize: 17, fontFamily: "roboto-regular", marginTop: 20, alignSelf: 'center'}} placeholderTextColor={'#696969'} placeholder={'Pet Breed'} onChangeText={(text) => setBreed(text)} value={breed}/>
          : null}
          <TextInput keyboardType="numeric" maxLength={50} selectionColor={'#eeebdd'} keyboardAppearance="dark" style={{height: 50, width: "85%", backgroundColor: "transparent", borderBottomWidth: 1, borderBottomColor: '#505050', paddingLeft: 5, color: "#eeebdd", fontSize: 17, fontFamily: "roboto-regular", marginTop: 20, alignSelf: 'center'}} placeholderTextColor={'#696969'} placeholder={'Scheduled time for the first meal'} onChangeText={(text) => setFirstMeal(text)} value={firstMeal}/>
          <TextInput keyboardType="numeric" maxLength={50} selectionColor={'#eeebdd'} keyboardAppearance="dark" style={{height: 50, width: "85%", backgroundColor: "transparent", borderBottomWidth: 1, borderBottomColor: '#505050', paddingLeft: 5, color: "#eeebdd", fontSize: 17, fontFamily: "roboto-regular", marginTop: 20, alignSelf: 'center'}} placeholderTextColor={'#696969'} placeholder={'Scheduled time for the second meal'} onChangeText={(text) => setSecondMeal(text)} value={secondMeal}/>
          <View style={{display: 'flex', flexDirection: 'row', width: '85%', height: 50, marginTop: 20, justifyContent: 'space-between', alignSelf: 'center'}}>
            <TextInput keyboardType="numeric" maxLength={50} selectionColor={'#eeebdd'} keyboardAppearance="dark" style={{height: 50, width: "47%", backgroundColor: "transparent", borderBottomWidth: 1, borderBottomColor: '#505050', paddingLeft: 5, color: "#eeebdd", fontSize: 17, fontFamily: "roboto-regular", alignSelf: 'center'}} placeholderTextColor={'#696969'} placeholder={'Pet Age'} onChangeText={(text) => setAge(text)} value={age}/>
            <TextInput keyboardType="numeric" maxLength={50} selectionColor={'#eeebdd'} keyboardAppearance="dark" style={{height: 50, width: "47%", backgroundColor: "transparent", borderBottomWidth: 1, borderBottomColor: '#505050', paddingLeft: 5, color: "#eeebdd", fontSize: 17, fontFamily: "roboto-regular", alignSelf: 'center'}} placeholderTextColor={'#696969'} placeholder={'Pet Weight'} onChangeText={(text) => setWeight(text)} value={weight}/>
          </View>
          <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', width: '85%', marginTop: 20, alignSelf: 'center'}}>
            <Text style={{fontFamily: 'roboto-700', fontSize: 18, color: '#eeebdd'}}>Diseases</Text>
            <TouchableOpacity style={{marginLeft: 'auto'}} onPress={() => setDiseases(['', ...diseases])}>
              <Image source={require('../assets/add.png')} style={{width: 25, height: 25}}/>
            </TouchableOpacity>
          </View>
          {diseases.map((disease, index) => (
            <TextInput key={index} maxLength={50} selectionColor={'#eeebdd'} keyboardAppearance="dark" style={{height: 50, width: "85%", backgroundColor: "transparent", borderBottomWidth: 1, borderBottomColor: '#505050', paddingLeft: 5, color: "#eeebdd", fontSize: 17, fontFamily: "roboto-regular", marginTop: 20, alignSelf: 'center'}} placeholderTextColor={'#696969'} placeholder={'Disease ' + (index+1)} onChangeText={(text) => {
              let arr = diseases.splice()
              arr[index] = text
              setDiseases(arr)
            }} value={disease}/>
          ))}
          <Button isLoading={loading} onPress={() => handleSubmit()} title={'Register Pet'} style={{height: 50, width: '85%', color: '#1B1717', backgroundColor: "#EEEBDD", fontSize: 17, marginTop: 20, alignSelf: 'center'}}/>
        </ScrollView>
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

export default RegisterPet;
