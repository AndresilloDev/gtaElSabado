import React, { useState, useContext, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
  StatusBar
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import petco from '../assets/petco.png';
import { useTheme } from "../context/ThemeContext";
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get("window");

const LoginScreen = () => {
  const { login } = useContext(AuthContext);
  const { theme } = useTheme();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isFocused, setIsFocused] = useState({ username: false, password: false });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  
  const logoAnimation = useRef(new Animated.Value(0)).current;
  const formAnimation = useRef(new Animated.Value(0)).current;
  const inputAnimation = {
    username: useRef(new Animated.Value(0)).current,
    password: useRef(new Animated.Value(0)).current,
  };

  useEffect(() => {
    Animated.sequence([
      Animated.timing(logoAnimation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(formAnimation, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleFocus = (field) => {
    setIsFocused({ ...isFocused, [field]: true });
    Animated.timing(inputAnimation[field], {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = (field) => {
    if ((field === 'username' && !username) || (field === 'password' && !password)) {
      setIsFocused({ ...isFocused, [field]: false });
      Animated.timing(inputAnimation[field], {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const logoStyle = {
    transform: [
      {
        scale: logoAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1],
        }),
      },
    ],
    opacity: logoAnimation,
  };

  const formStyle = {
    transform: [
      {
        translateY: formAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [50, 0],
        }),
      },
    ],
    opacity: formAnimation,
  };

  const labelStyle = (field) => ({
    position: 'absolute',
    left: 15,
    top: inputAnimation[field].interpolate({
      inputRange: [0, 1],
      outputRange: [15, -10],
    }),
    fontSize: inputAnimation[field].interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: inputAnimation[field].interpolate({
      inputRange: [0, 1],
      outputRange: ['#aaa', '#00205B'],
    }),
    backgroundColor: isFocused[field] ? '#fff' : 'transparent',
    paddingHorizontal: isFocused[field] ? 5 : 0,
    zIndex: 10,
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.gradientContainer}>
        <Animated.View style={[styles.logoContainer, logoStyle]}>
          <Image source={petco} style={styles.logo} />
        </Animated.View>

        <Animated.View style={[styles.formContainer, formStyle]}>
          <Text style={styles.title}>Welcome to Petco</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>

          <View style={styles.inputGroup}>
            <Animated.Text style={labelStyle('username')}>
              Username
            </Animated.Text>
            <TextInput
              style={[
                styles.input,
                isFocused.username && styles.inputFocused
              ]}
              value={username}
              onChangeText={setUsername}
              onFocus={() => handleFocus('username')}
              onBlur={() => handleBlur('username')}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Animated.Text style={labelStyle('password')}>
              Password
            </Animated.Text>
            <TextInput
              style={[
                styles.input,
                isFocused.password && styles.inputFocused
              ]}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!isPasswordVisible}
              onFocus={() => handleFocus('password')}
              onBlur={() => handleBlur('password')}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              <Ionicons
                name={isPasswordVisible ? "eye-off" : "eye"}
                size={24}
                color="#00205B"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => login(username, password)}
          >
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity>
              <Text style={styles.signUpText}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  gradientContainer: {
    flex: 1,
    backgroundColor: "#00205B",
    padding: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 60,
    marginBottom: 30,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  formContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00205B",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 24,
    position: "relative",
  },
  input: {
    width: "100%",
    height: 52,
    borderWidth: 1.5,
    borderColor: "#E0E5EC",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#FFFFFF",
  },
  inputFocused: {
    borderColor: "#00205B",
    borderWidth: 2,
    shadowColor: "#00205B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  eyeIcon: {
    position: "absolute",
    right: 16,
    top: 14,
  },
  button: {
    height: 56,
    backgroundColor: "#E31837",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    shadowColor: "#E31837",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: "#00205B",
    fontSize: 14,
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 32,
  },
  footerText: {
    color: "#666",
    fontSize: 14,
  },
  signUpText: {
    color: "#00205B",
    fontWeight: "600",
    marginLeft: 4,
    fontSize: 14,
  },
});

export default LoginScreen;