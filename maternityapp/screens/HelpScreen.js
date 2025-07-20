import React from 'react';
import { View, Text, Button, StyleSheet, Linking } from 'react-native';

export default function HelpScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Help & Support</Text>
      <Text style={styles.section}>FAQs</Text>
      <Text>- How to register?
- What is ANC?
- What supplements should I take?</Text>
      <Text style={styles.section}>Contact Support</Text>
      <Button title="Call Support" onPress={() => Linking.openURL('tel:1800123456')} />
      <Button title="Email Support" onPress={() => Linking.openURL('mailto:support@maternalhealth.gov.in')} />
      <Button title="WhatsApp" onPress={() => Linking.openURL('https://wa.me/919876543210')} />
      <Text style={styles.section}>Feedback</Text>
      <Button title="Submit Feedback" onPress={() => {}} />
      <Text style={styles.section}>How to Register</Text>
      <Text>Visit your nearest ANC/PHC center or our website.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  section: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 5 },
});
