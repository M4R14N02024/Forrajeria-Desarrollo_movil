import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  ImageBackground, 
  Alert 
} from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebaseconfig';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function EditarProducto({ route, navigation }) {
  const { producto } = route.params;
  
  const [nombre, setNombre] = useState(producto.nombre);
  const [precio, setPrecio] = useState(producto.precio.toString());
  const [stock, setStock] = useState(producto.stock.toString());
  const [descripcion, setDescripcion] = useState(producto.descripcion || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleActualizar = async () => {

    if (!nombre.trim() || !precio.trim() || !stock.trim()) {
      Alert.alert('Error', 'Por favor completa los campos obligatorios');
      return;
    }

    setIsLoading(true);
    try {
      const productoRef = doc(db, "productos", producto.id);
      await updateDoc(productoRef, {
        nombre: nombre.trim(),
        precio: parseFloat(precio),
        stock: parseInt(stock),
        descripcion: descripcion.trim(),
        fechaActualizacion: new Date()
      });

      Alert.alert(
        'Éxito',
        'Producto actualizado correctamente',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      console.error("Error al actualizar el producto: ", error);
      Alert.alert('Error', 'No se pudo actualizar el producto. Intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground 
      source={{ uri: 'https://i.pinimg.com/originals/e6/80/c1/e680c193340a4939786ae1609bcc2551.jpg' }} 
      style={styles.background}
    >
      <View style={styles.container}>
        
        
        <View style={styles.formContainer}>
          <Text style={styles.label}>Nombre del producto: *</Text>
          <TextInput
            style={styles.input}
            value={nombre}
            onChangeText={setNombre}
            placeholder="Nombre"
            placeholderTextColor="#888"
          />
          
          <Text style={styles.label}>Precio: *</Text>
          <TextInput
            style={styles.input}
            value={precio}
            onChangeText={setPrecio}
            placeholder="Precio"
            keyboardType="numeric"
            placeholderTextColor="#888"
          />

          <Text style={styles.label}>Stock: *</Text>
          <TextInput
            style={styles.input}
            value={stock}
            onChangeText={setStock}
            placeholder="Stock"
            keyboardType="numeric"
            placeholderTextColor="#888"
          />

          <Text style={styles.label}>Descripción:</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={descripcion}
            onChangeText={setDescripcion}
            placeholder="Descripción"
            multiline
            placeholderTextColor="#888"
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, styles.saveButton, isLoading && styles.buttonDisabled]}
              onPress={handleActualizar}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Actualizando...' : 'Actualizar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 10,
    margin: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4a4a4a',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  icon: {
    marginRight: 10,
  },
  formContainer: {
    width: '100%',
    padding: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: 'white',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
    color: '#000',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 0.48,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#dc3545',
  },
  saveButton: {
    backgroundColor: '#28a745',
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});