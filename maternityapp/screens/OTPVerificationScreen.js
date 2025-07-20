import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function OTPVerificationScreen({ navigation, route }) {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const { uid, mobile } = route.params || {};

  function handleVerify() {
    if (otp === '123456') { // mock OTP
      navigation.replace('Main');
    } else {
      setError('Invalid OTP. Try again.');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter OTP sent to {mobile}</Text>
      <TextInput style={styles.input} value={otp} onChangeText={setOtp} placeholder="Enter OTP" keyboardType="number-pad" />
      <Button title="Verify OTP" onPress={handleVerify} />
      <Button title="Resend OTP" onPress={() => setError('OTP resent (mock).')} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  label: { fontSize: 16, marginBottom: 10 },
  input: { width: '80%', borderWidth: 1, borderColor: '#aaa', borderRadius: 5, padding: 10, marginBottom: 10 },
  error: { color: 'red', marginTop: 10 },
});
