import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, TouchableWithoutFeedback, Keyboard, ScrollView, Alert } from 'react-native';
import { db } from '../Firebase/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        name,
        birthdate,
        email,
      });

      console.log('Usuario registrado:', { name, birthdate, email });
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      Alert.alert('Error', 'Hubo un problema al registrarse. Verifica tus datos.');
    }
  };

  const formatBirthdate = (text) => {
    const numbers = text.replace(/\D/g, '');
    let formatted = '';

    if (numbers.length > 0) {
      formatted += numbers.substring(0, 4);
    }
    if (numbers.length >= 5) {
      formatted += '-' + numbers.substring(4, 6);
    }
    if (numbers.length >= 7) {
      formatted += '-' + numbers.substring(6, 8);
    }

    return formatted;
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Registro</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#aaa"
          />
          <TextInput
            style={styles.input}
            placeholder="Fecha de nacimiento (YYYY-MM-DD)"
            value={birthdate}
            onChangeText={(text) => setBirthdate(formatBirthdate(text))}
            placeholderTextColor="#aaa"
            maxLength={10} 
          />
          <TextInput
            style={styles.input}
            placeholder="Correo"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="#aaa"
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#aaa"
          />
          <TextInput
            style={styles.input}
            placeholder="Verifica tu contraseña"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholderTextColor="#aaa"
          />
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>¡Regístrate!</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1f44',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 120,
    marginTop: -80,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 1,
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default RegisterScreen;
