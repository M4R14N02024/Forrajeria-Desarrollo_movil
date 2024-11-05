import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebaseconfig';

export default function Pantalla({ navigation }) { 
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const nombreUsuario = "UsuarioPop"; 

  const limpiarFormulario = () => {
    setNombre('');
    setPrecio('');
    setStock('');
    setDescripcion('');
  };

  const handleGuardar = async () => {
    
    if (!nombre.trim() || !precio.trim() || !stock.trim()) {
      Alert.alert('Error', 'Por favor completa los campos obligatorios');
      return;
    }

    setIsLoading(true);
    try {
      const docRef = await addDoc(collection(db, "productos"), {
        nombre: nombre.trim(),
        precio: parseFloat(precio),
        stock: parseInt(stock),
        descripcion: descripcion.trim(),
        fechaCreacion: new Date(),
        usuario: nombreUsuario
      });

      Alert.alert(
        'Éxito',
        'Producto guardado correctamente',
        [
          {
            text: 'OK',
            onPress: () => {
              limpiarFormulario();
              navigation.navigate('Menu'); 
            }
          }
        ]
      );
      console.log("Documento agregado con ID: ", docRef.id);
    } catch (error) {
      console.error("Error al guardar el producto: ", error);
      Alert.alert('Error', 'No se pudo guardar el producto. Intente nuevamente.');
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
          <TouchableOpacity 
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleGuardar}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Guardando...' : 'Guardar'}
            </Text>
          </TouchableOpacity>
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
    backgroundColor: 'rgba(255, 255, 255, 0.2)', 
    borderRadius: 10,
  },
  formContainer: {
    width: '100%',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: 'white',
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
  },
  textArea: {
    height: 100,
  },
  button: {
    backgroundColor: 'orange',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
