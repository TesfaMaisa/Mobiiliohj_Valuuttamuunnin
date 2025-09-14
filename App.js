import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Button, ActivityIndicator, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';



export default function App() {

  const [from, setFrom] = useState();
  const [amount, setAmount] = useState(0);
  const [result, setResult] = useState(null);
  const [repo, setRepo] = useState([]);
  const [loading, setLoading] = useState(false);
  var myHeaders = new Headers();
  myHeaders.append("apikey", "CnafAy1hY9HgsMh0NALFt7DQTV9bjCMT");

  var requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: myHeaders
  };


  function handleFetch() {
    if(amount < 1){
      alert('Määrän pitää olla yli 0')
    }else{
    setLoading(true);
    fetch(`https://api.apilayer.com/exchangerates_data/convert?to=EUR&from=${from}&amount=${amount}`, requestOptions)
      .then(response => {
        if (!response.ok)
          throw new Error("Erroria fetching kanssa" + response.statusText);
        return response.json();
      })
      .then(data => {
        setRepo(data.items);
        console.log(data)
        setResult(data.result.toFixed(2) + ' EUR')
        setLoading(false);
      })
      .catch(err => console.error(err));
    }
  }

  return (
    <View style={styles.container}>
      <Text style={{fontWeight:'bold'}}>{result}</Text>
      <View style={{flexDirection:'row'}}>
      <TextInput placeholder='Määrä' value={amount} onChangeText={text => setAmount(Number(text))}></TextInput>
        <Picker style={{ height: 200, width: 200 }} selectedValue={from} onValueChange={(itemValue, itemIndex) => setFrom(itemValue)}>
          <Picker.Item label='USD' value="USD" />
          <Picker.Item label='GBP' value="GBP" />
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
