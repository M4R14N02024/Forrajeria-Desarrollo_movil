import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { db } from './firebaseconfig';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const Menu = ({ navigation }) => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProductos, setFilteredProductos] = useState([]);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'productos'));
      const productosData = [];
      
      querySnapshot.forEach((doc) => {
        productosData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      productosData.sort((a, b) => a.nombre.localeCompare(b.nombre));
      setProductos(productosData);
      setFilteredProductos(productosData);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      Alert.alert(
        'Error',
        'No se pudieron cargar los productos. Por favor, intente de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProductos();
    const unsubscribe = navigation.addListener('focus', () => {
      cargarProductos();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const filtered = productos.filter(producto =>
      producto.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProductos(filtered);
  }, [searchQuery, productos]);

  const handleDelete = (productId) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Está seguro de eliminar este producto?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'productos', productId));
              Alert.alert('Éxito', 'Producto eliminado correctamente');
              cargarProductos();
            } catch (error) {
              console.error('Error al eliminar:', error);
              Alert.alert('Error', 'No se pudo eliminar el producto');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleEdit = (product) => {
    navigation.navigate('editar', { producto: product });
  };

  const handleExit = () => {
    Alert.alert(
      'Salir', 
      '¿Estás seguro de que quieres salir?', 
      [
        { 
          text: 'Cancelar', 
          style: 'cancel' 
        },
        { 
          text: 'Sí', 
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }
        },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Bienvenido Pepito</Text>
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleExit}>
          <Text style={styles.logoutButtonText}>SALIR</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nombre"
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#666"
        />
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('agregar')}>
          <View style={styles.addButtonContent}>
            <MaterialIcons name="add-circle" size={24} color="white" style={styles.addIcon} />
            <Text style={styles.addButtonText}>Agregar</Text>
          </View>
        </TouchableOpacity>
      </View>

      <Text style={styles.productsHeader}>PRODUCTOS</Text>

      <View style={styles.tableHeader}>
        <Text style={[styles.columnHeader, { flex: 1.5 }]}>ID</Text>
        <Text style={[styles.columnHeader, { flex: 2 }]}>Nombre</Text>
        <Text style={[styles.columnHeader, { flex: 1 }]}>Acciones</Text>
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredProductos.map((producto) => (
          <View key={producto.id} style={styles.tableRow}>
            <Text style={[styles.idCell, { flex: 1.5 }]} numberOfLines={1} ellipsizeMode="middle">
              {producto.id}
            </Text>
            <Text style={[styles.nameCell, { flex: 2 }]}>{producto.nombre}</Text>
            <View style={[styles.actionsCell, { flex: 1 }]}>
              <TouchableOpacity 
                onPress={() => handleEdit(producto)}
                style={[styles.actionButton, styles.editButton]}>
                <MaterialIcons name="edit" size={24} color="#4A90E2" />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => handleDelete(producto.id)}
                style={[styles.actionButton, styles.deleteButton]}>
                <MaterialIcons name="delete" size={24} color="#FF4444" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: 'red',
    padding: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 25,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  addButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addIcon: {
    marginRight: 5,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  productsHeader: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: 10,
    marginBottom: 10,
  },
  columnHeader: {
    color: 'white',
    fontWeight: 'bold',
  },
  tableContent: {
    flex: 1,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    alignItems: 'center',
  },
  idCell: {
    color: 'white',
    fontSize: 12,
  },
  nameCell: {
    color: 'white',
  },
  actionsCell: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  actionButton: {
    padding: 8,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: 'transparent',
  },
  editButton: {
    backgroundColor: 'transparent',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Menu;