import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert, TouchableOpacity, ActionSheetIOS, TextInput, Switch, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';
import { auth, db } from '../Firebase/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const PasswordRegister = () => {
  const navigation = useNavigation();
  const [selectedApp, setSelectedApp] = useState('');
  const [email, setEmail] = useState('');
  const [passwordLength, setPasswordLength] = useState(0);
  const [lowercaseEnabled, setLowercaseEnabled] = useState(false);
  const [uppercaseEnabled, setUppercaseEnabled] = useState(false);
  const [digitsEnabled, setDigitsEnabled] = useState(false);
  const [specialCharsEnabled, setSpecialCharsEnabled] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('red');
  const [passwordStrength, setPasswordStrength] = useState('Insegura');
  const [isSaving, setIsSaving] = useState(false);


  const applications = [
    { label: 'Facebook', value: 'facebook' },
    { label: 'Instagram', value: 'instagram' },
    { label: 'Twitter', value: 'twitter' },
    { label: 'Google', value: 'google' },
    { label: 'Spotify', value: 'spotify' },
  ];

  const handleAppSelect = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: [...applications.map(app => app.label), 'Cancelar'],
        cancelButtonIndex: applications.length,
      },
      (buttonIndex) => {
        if (buttonIndex < applications.length) {
          const selected = applications[buttonIndex].value;
          setSelectedApp(selected);
        }
      }
    );
  };

  const generatePassword = () => {
    let characterSet = '';
    if (lowercaseEnabled) characterSet += 'abcdefghijklmnopqrstuvwxyz';
    if (uppercaseEnabled) characterSet += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (digitsEnabled) characterSet += '0123456789';
    if (specialCharsEnabled) characterSet += '!@#$%^&*()_+[]{}|;:,.<>?';

    if (characterSet.length === 0 || passwordLength === 0) {
      setGeneratedPassword('');
      return;
    }

    let password = '';
    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * characterSet.length);
      password += characterSet[randomIndex];
    }

    setGeneratedPassword(password);
  };

  const handleSave = async () => {
    if (!selectedApp || !email) {
      Alert.alert('Error', 'Por favor, selecciona una aplicación y proporciona un correo electrónico.');
      return;
    }
    try {
      const userId = auth.currentUser.uid;

      await addDoc(collection(db, 'passwords'), {
        userId,
        app: selectedApp,
        email: email,
        password: generatedPassword,
        createdAt: serverTimestamp(),
      });

      Alert.alert('Éxito', `Contraseña registrada para ${selectedApp} con el correo ${email}.`);
      
      setSelectedApp('');
      setEmail('');
      setPasswordLength(0);
      setLowercaseEnabled(false);
      setUppercaseEnabled(false);
      setDigitsEnabled(false);
      setSpecialCharsEnabled(false);
      setGeneratedPassword('');

      navigation.navigate('Main');

    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al guardar la contraseña. Inténtalo de nuevo.');
      console.error(error);
    }
  };

  const updateBackgroundColor = () => {
    const activeSwitches = [lowercaseEnabled, uppercaseEnabled, digitsEnabled, specialCharsEnabled].filter(Boolean).length;
    let newColor = 'red';
    let strengthText = 'Insegura';

    if (passwordLength > 0) {
      if (passwordLength > 12 || activeSwitches >= 3) {
        newColor = 'green';
        strengthText = 'Segura';
      } else if (passwordLength > 6) {
        newColor = 'gold';
        strengthText = 'Decente';
      }
    }

    setBackgroundColor(newColor);
    setPasswordStrength(strengthText);
  };

  useEffect(() => {
    generatePassword();
    updateBackgroundColor();
  }, [passwordLength, lowercaseEnabled, uppercaseEnabled, digitsEnabled, specialCharsEnabled]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registro de Contraseña</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Aplicación:</Text>
        <View style={styles.row}>
          <Text style={styles.selectedAppText}>
            {selectedApp ? selectedApp.charAt(0).toUpperCase() + selectedApp.slice(1) : 'Ninguna seleccionada'}
          </Text>
          <TouchableOpacity style={styles.button} onPress={handleAppSelect}>
            <Text style={styles.buttonText}>Seleccionar</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.emailInput}
          placeholder="Ingresa tu correo electrónico"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Longitud de Contraseña:</Text>
        <Text style={styles.passwordLengthText}>{passwordLength} caracteres</Text>
        <Slider
          minimumValue={0}
          maximumValue={20}
          step={1}
          value={passwordLength}
          onValueChange={setPasswordLength}
          minimumTrackTintColor="blue"
          maximumTrackTintColor="#ccc"
          style={styles.slider}
        />
      </View>
      {[
        { label: 'Letras minúsculas (a-z)', value: lowercaseEnabled, setter: setLowercaseEnabled },
        { label: 'Letras mayúsculas (A-Z)', value: uppercaseEnabled, setter: setUppercaseEnabled },
        { label: 'Dígitos (0-9)', value: digitsEnabled, setter: setDigitsEnabled },
        { label: 'Caracteres especiales', value: specialCharsEnabled, setter: setSpecialCharsEnabled },
      ].map(({ label, value, setter }) => (
        <View style={styles.inputContainer} key={label}>
          <Text style={styles.label}>{label}</Text>
          <View style={styles.switchContainer}>
            <Switch
              value={value}
              onValueChange={setter}
              trackColor={{ false: "#767577", true: "blue" }}
              thumbColor={value ? "#ffffff" : "#f4f3f4"}
            />
          </View>
        </View>
      ))}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Contraseña generada:</Text>
        <Text style={styles.generatedPasswordText}>{generatedPassword || 'Sin contraseña generada'}</Text>
      </View>
      <View style={[styles.statusContainer, { backgroundColor }]}>
        <Text style={styles.statusText}>
          {`Contraseña: ${passwordStrength}`}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.customButton} onPress={handleSave}>
          <Text style={styles.customButtonText}>Guardar Contraseña</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    padding: 16,
    backgroundColor: '#0a1f44', // Color de fondo suave
  },
  title: {
    fontSize: 30,
    textAlign: 'center',
    marginVertical: 30,
    marginBottom: 50,
    fontWeight: 'bold',
    color: 'white', // Color blanco para el título
  },
  inputContainer: {
    marginBottom: 20,
    paddingVertical: 10,
    backgroundColor: '#ffffff', // Fondo blanco para el contenedor de entrada
    borderRadius: 10,
    paddingHorizontal: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
    color: '#333', // Color de texto oscuro
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedAppText: {
    fontSize: 16,
    flex: 1,
    marginRight: 10,
    color: '#666', // Color gris
  },
  button: {
    backgroundColor: 'blue', // Color del botón
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff', // Color blanco para el texto del botón
    fontSize: 16,
  },
  emailInput: {
    borderWidth: 1,
    borderColor: '#ccc', // Color de borde gris
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  passwordLengthText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333', // Color de texto oscuro
  },
  slider: {
    width: '100%',
    height: 40,
  },
  switchContainer: {
    alignItems: 'flex-end',
    marginTop: -30,
  },
  generatedPasswordText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black', // Color rojo para el texto de contraseña generada
  },
  statusContainer: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    backgroundColor: '#0a1f44', // Color de fondo del contenedor de estatus
  },
  statusText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#fff', // Color blanco para el texto de estatus
  },
  buttonContainer: {
    marginTop: 20,
  },
  customButton: {
    backgroundColor: 'blue', // Color del botón personalizado
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 40,
  },
  customButtonText: {
    color: '#fff', // Color blanco para el texto del botón personalizado
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PasswordRegister;
