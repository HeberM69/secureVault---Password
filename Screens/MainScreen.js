import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native'; // Asegúrate de incluir ActivityIndicator
import { db } from '../Firebase/firebaseConfig';
import { collection, query, where, getDocs, limit, startAfter, deleteDoc, doc } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
  const [passwords, setPasswords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const auth = getAuth();

  useEffect(() => {
    fetchPasswords();
  }, [auth]);

  const fetchPasswords = async () => {
    setLoading(true);
    const userId = auth.currentUser.uid;
    const passwordsCollection = collection(db, 'passwords');
    const q = query(passwordsCollection, where('userId', '==', userId), limit(10));

    try {
      const querySnapshot = await getDocs(q);
      const passwordsData = [];
      querySnapshot.forEach((doc) => {
        passwordsData.push({ id: doc.id, ...doc.data() });
      });
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setPasswords(passwordsData);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las contraseñas.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadMorePasswords = async () => {
    if (lastVisible) {
      const userId = auth.currentUser.uid;
      const passwordsCollection = collection(db, 'passwords');
      const q = query(passwordsCollection, where('userId', '==', userId), startAfter(lastVisible), limit(10));

      try {
        const querySnapshot = await getDocs(q);
        const passwordsData = [];
        querySnapshot.forEach((doc) => {
          passwordsData.push({ id: doc.id, ...doc.data() });
        });
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setPasswords((prev) => [...prev, ...passwordsData]);
      } catch (error) {
        Alert.alert('Error', 'No se pudieron cargar más contraseñas.');
        console.error(error);
      }
    }
  };

  const onRefresh = async () => {
    setLoading(true);
    await fetchPasswords();
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          onPress: async () => {
            try {
              await signOut(auth);
              Alert.alert('Sesión cerrada', 'Has cerrado sesión correctamente.');
              navigation.navigate('Home');
            } catch (error) {
              Alert.alert('Error', 'No se pudo cerrar sesión.');
              console.error(error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const deletePassword = async (id) => {
    Alert.alert(
      'Eliminar Contraseña',
      '¿Estás seguro de que quieres eliminar esta contraseña?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'passwords', id));
              setPasswords(prevPasswords => prevPasswords.filter(password => password.id !== id));
              Alert.alert('Éxito', 'Contraseña eliminada correctamente.');
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la contraseña.');
              console.error(error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const filteredPasswords = passwords.filter(password =>
    password.app.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.userIconContainer}>
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="person-circle-outline" size={64} color="white" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Contraseñas Guardadas</Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar aplicación..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#A9A9A9"
        />
      </View>

      <FlatList
        data={filteredPasswords}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.appName}>{item.app}</Text>
            <Text style={styles.email}>{item.email}</Text>
            <Text style={styles.password}>{item.password}</Text>
            <TouchableOpacity onPress={() => deletePassword(item.id)}>
              <Ionicons name="trash" size={24} color="#FF4500" />
            </TouchableOpacity>
          </View>
        )}
        onEndReached={loadMorePasswords}
        onEndReachedThreshold={0.5}
        onRefresh={onRefresh}
        refreshing={loading}
        ListHeaderComponent={loading && <ActivityIndicator color="white" size="large" marginTop="20" marginBottom="-20" />} // Cambia el color aquí
      />

      <TouchableOpacity 
        style={styles.addButton} 
        onPress={() => navigation.navigate('PasswordRegister')}
      >
        <Ionicons name="add" size={32} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#0a1f44',
  },
  userIconContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 20,
    color: 'white',
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchInput: {
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  item: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  appName: {
    fontWeight: 'bold',
    color: '#333',
  },
  email: {
    fontWeight: 'bold',
    color: 'gray',
  },
  password: {
    fontWeight: 'bold',
    marginTop: 4,
    color: '#555',
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: 'blue',
    borderRadius: 70,
    padding: 20,
    elevation: 5,
  },
});

export default HomeScreen;
