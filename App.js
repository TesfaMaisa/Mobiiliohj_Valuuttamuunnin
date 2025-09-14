import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View, Button, ActivityIndicator, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';



export default function App() {

  const [from, setFrom] = useState([]);
  const [amount, setAmount] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [key, setKeys] = useState([])

  var myHeaders = new Headers();
  myHeaders.append("apikey", "3l1V7pwQ1euxh6GQonVpmxZ59XBEMyee");

  var requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: myHeaders
  };


  function getSymbols() {
    fetch("https://api.apilayer.com/exchangerates_data/symbols", requestOptions)
      .then(response => {
        if (!response.ok)
          throw new Error("Erroria fetching kanssa" + response.statusText);
        return response.json();
      })
      .then(data => {
        console.log(Object.keys(data))
        setKeys(Object.keys(data.symbols))
        setLoading(false);
      })
      .catch(err => console.error(err));
  }


  useEffect(() => {
    getSymbols()
  }, [])

  const handleFetch = () => {
    if (amount < 1) {
      alert('Määrän pitää olla yli 0')
    } else {
      setLoading(true);
      fetch(`https://api.apilayer.com/exchangerates_data/convert?to=EUR&from=${from}&amount=${amount}`, requestOptions)
        .then(response => {
          if (!response.ok)
            throw new Error("Erroria fetching kanssa" + response.statusText);
          return response.json();
        })
        .then(data => {
          setResult(data.result.toFixed(2) + ' EUR')
          setLoading(false);
        })
        .catch(err => console.error(err));
    }
  }


  return (
    <View style={styles.container}>
     <Image source={require('./assets/euro.jpg')} style={{height:200, width:200}} />
      <Text style={{ fontWeight: 'bold', fontSize:40}}>{result}</Text>
      <View style={{ flexDirection: 'row' }}>
        <TextInput placeholder='Määrä' value={amount} onChangeText={text => setAmount(Number(text))}></TextInput>
        <Picker style={{ height: 200, width: 200 }} selectedValue={from} onValueChange={(itemValue, itemIndex) => setFrom(itemValue)}>
          {key.map((currency) =>
            <Picker.Item label={currency} value={currency} />)}
        </Picker>
      </View>
      <Button title='Muunna' onPress={handleFetch} />
      {loading && <ActivityIndicator size='large' />}

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
