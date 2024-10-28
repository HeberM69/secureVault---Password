import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, TouchableWithoutFeedback, Keyboard, Alert, Image } from 'react-native';
import { auth } from '../Firebase/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

const HomeScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setEmail('');
      setPassword('');
    });

    return unsubscribe;
  }, [navigation]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate('Main');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      Alert.alert('Error', 'Hubo un problema al iniciar sesión. Verifica tus credenciales.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>SecureVault</Text>
          <Image source={require('../assets/Logo-removebg-preview.png')} style={styles.logo} />
        </View>
        <View style={styles.formContainer}>
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
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Iniciar sesión</Text>
          </TouchableOpacity>
          <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
            ¿No tienes cuenta? Regístrate aquí
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1f44',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    alignItems: 'center',
    backgroundColor: '#0a1f44',
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    color: 'white',
  },
  logo: {
    width: 200,
    height: 200, 
    marginTop: 10, 
    marginBottom: -60,
    resizeMode: 'contain',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
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
  link: {
    textAlign: 'center',
    marginTop: 25,
    color: 'white',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default HomeScreen;
