import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, Button, Alert } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { auth } from './firebaseconfig'; // Asegúrate de tener tu firebaseconfig.js configurado
import Menu from "./Menu"; 
import agregar from "./agregar";
import editar from "./editar";

function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (username === "Pepito" && password === "1234") {
      // Usar reset en lugar de navigate para el login
      navigation.reset({
        index: 0,
        routes: [{ name: "Menu", params: { username: username } }],
      });
    } else {
      Alert.alert("Error", "Contraseña o usuario mal, Intente de nuevo.");
    }
  };

  const handleCreateAccount = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        Alert.alert("Cuenta creada", `Bienvenido ${user.email}`);
        // Usar reset también aquí
        navigation.reset({
          index: 0,
          routes: [{ name: "Menu", params: { username: user.email } }],
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        Alert.alert("Error al crear cuenta", errorMessage);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Bienvenido</Text>
      <Text style={styles.subTitle}>Inicia sesión con tu cuenta</Text>
      <TextInput
        style={styles.TextInput}
        placeholder="Usuario"
        value={username}
        onChangeText={(text) => setUsername(text)}
      />
      <TextInput
        style={styles.TextInput}
        placeholder="Contraseña"
        secureTextEntry={true}
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <View style={styles.buttonContainer}>
        <Button title="Ingresar" color="black" onPress={handleLogin} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Crear Cuenta" color="black" onPress={handleCreateAccount} />
      </View>
      <Text style={styles.forgotPassword}>¿Olvidó su Contraseña?</Text>
    </View>
  );
}

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: { backgroundColor: 'gray' },
          headerTintColor: 'white',
          contentStyle: { backgroundColor: 'black' },
          // Deshabilitar el gesto de retroceso en iOS
          gestureEnabled: false,
          // Prevenir que el usuario pueda volver atrás con el botón del sistema en Android
          headerLeft: null,
        }}
      >
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ 
            title: "Inicio de Sesión",
            // Prevenir que se pueda volver atrás desde la pantalla de login
            headerLeft: null 
          }} 
        />
        <Stack.Screen 
          name="Menu" 
          component={Menu} 
          options={{ 
            title: "Menú Principal",
            // Prevenir que se pueda volver atrás desde el menú
            headerLeft: null 
          }} 
        />
        <Stack.Screen name="agregar" component={agregar} options={{ title: 'Agregar Producto' }} />
        <Stack.Screen name="editar" component={editar} options={{ title: 'Editar Producto' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "gray",
    alignItems: "center",
    justifyContent: "center",
  },
  titulo: {
    fontSize: 50,
    color: "black",
    fontWeight: "bold",
  },
  subTitle: {
    fontSize: 20,
    color: "black",
  },
  TextInput: {
    borderWidth: 1,
    paddingStart: 20,
    borderColor: "gray",
    padding: 9,
    width: "60%",
    height: 50,
    marginTop: 20,
    borderRadius: 30,
    backgroundColor: "#ffff",
  },
  buttonContainer: {
    marginTop: 30,
    width: "60%",
  },
  forgotPassword: {
    marginTop: 30,
  },
});
