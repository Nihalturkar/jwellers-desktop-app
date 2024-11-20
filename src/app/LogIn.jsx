import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LoginApi } from '../api/auth';
import Toasty from './components/modal';
import { Ionicons } from '@expo/vector-icons';

export default function LoginPage() {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [errorToast, setErrorToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      setErrorToast(true);
      setToastMessage('Please fill all fields');
      setTimeout(() => setErrorToast(false), 2000);
      return;
    }

    if (!isValidEmail(email)) {
      setErrorToast(true);
      setToastMessage('Please enter a valid email address');
      setTimeout(() => setErrorToast(false), 2000);
      return;
    }

    setLoading(true);
    const postdata = { email, password };
    
    console.log("post", postdata);

    // Call the LoginApi function
    LoginApi((error, message) => {
      setLoading(false); // Stop loading regardless of success or error
      if (message === "success") {
        setShowToast(true);
        setToastMessage('Login successful');
        setTimeout(() => setShowToast(false), 2000);
        // Navigate to Home screen after successful login
        navigation.navigate('Home');
      } else {
        setErrorToast(true);
        setToastMessage(message || 'User  not found!');
        setTimeout(() => setErrorToast(false), 2000);
      }
    }, postdata);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.container}>
      {showToast && <Toasty type='success' message={toastMessage} />}
      {errorToast && <Toasty type='error' message={toastMessage} />}

      {/* Left Side: Login Form */}
      <View style={styles.formCard}>
        <Text style={styles.title}>Welcome Back</ Text>
        <Text style={styles.title2}>Enter Your Email And Password To Log in</Text>
        <Text style={styles.title3}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Text style={styles.title3}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
            <Ionicons 
              name={showPassword ? "eye-off" : "eye"} 
              size={20} 
              color="#A0AEC0"
            />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          {loading && <ActivityIndicator size={20} color="white"/>}
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      </View>

      {/* Right Side: Image */}
      <View style={styles.imageContainer}>
        <Image 
          source={require('../assets/Images/Image.png')} 
          style={styles.backgroundImage} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  formCard: {
    flex: 1,
    padding: 90,
    marginLeft: 40,
    marginRight: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    marginLeft:180,
    fontWeight: 'bold',
    color:"#4FD1C5"
  },
  title2:{
    fontSize: 15,
    marginBottom: 40,
    marginLeft:180,
    color:"#A0AEC0"
  },
  title3:{
    fontSize: 15,
    marginBottom: 10,
    marginLeft:180,
  },
  input: {
    width: 320,
    height: 50,
    marginLeft:180,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  button: {
    marginLeft:180,
    width: 320,
    height: 50,
    backgroundColor: '#4FD1C5',
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap:20,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageContainer: {
    flex: 1,
    marginBottom:120,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 20, 
    overflow: 'hidden',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    // resizeMode: 'cover',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 320,
    height: 50,
    marginLeft: 180,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 10,
  },
  eyeIcon: {
    padding: 10,
  },
});