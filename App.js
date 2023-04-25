import axios from "axios";
import { useEffect, useState } from "react";
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Location from 'expo-location';

const API_KEY = "941486768a152956047899b6bfd97333";

export default function App() {
  const [dataMeteo, setDataMeteo] = useState(false);
  const [citySearch, setCitySearch] = useState("");

  const onSearchCityChange = async (text) => {
    setCitySearch(text);

    if (text.length > 2) {
      await axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?q=${text}&lang=fr&units=metric&appid=${API_KEY}`
        )
        .then((res) => {
          console.log(res.status)
          if (res.status === 200) setDataMeteo(res.data);
          if (res.status === 404) setDataMeteo(false);
        })
        .catch((err) => setDataMeteo(false));
    }
  };

  const getDataMeteo = async () => {
    await axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=Nantes&lang=fr&units=metric&appid=${API_KEY}`
      )
      .then((res) => {});
  };

  const getPosition = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setDataMeteo(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      await axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&lang=fr&units=metric&appid=${API_KEY}`
        )
        .then((res) => {
          console.log(res.data)
          if (res.status === 200) setDataMeteo(res.data);
          if (res.status === 404) setDataMeteo(false);
        })
        .catch((err) => setDataMeteo(false));
  }

  useEffect(() => {
    getDataMeteo();
  }, []);

  return (
    <View>
        <SafeAreaView>
          <Text style={styles.labelInput}>Rechercher une ville</Text>
          <TextInput
            placeholder="Trouver une ville"
            value={citySearch}
            onChangeText={onSearchCityChange}
            style={styles.textInput}
          />
          <TouchableOpacity
            onPress={getPosition}
          >
            <Text style={styles.button}>Me géolocaliser</Text>
          </TouchableOpacity>
        </SafeAreaView>

      {dataMeteo && (
        <SafeAreaView style={styles.meteoDataContainer}>
          {dataMeteo.name && <Text style={{fontSize: 18, fontWeight: 700}}>{dataMeteo.name}</Text>}
          <Text>{dataMeteo.main.temp}°</Text>
          <Text>Température min: {dataMeteo.main.temp_min}°</Text>
          <Text>Température max: {dataMeteo.main.temp_max}°</Text>
        </SafeAreaView>
      )}
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  labelInput: {
    marginLeft: 12,
    marginVertical: 5,
    fontSize: 12,
  },
  textInput: {
    height: 40,
    marginHorizontal: 12,
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
  },

  meteoDataContainer: {
    marginVertical: 32,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  button: {
    borderRadius: 5,
    backgroundColor: '#772338',
    marginVertical: 12,
    textAlign: "center",
    color: '#fff',
    fontSize: 18,
    padding: 16
  }
});
