import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("https://reqres.in/api/users/2");
        setUser(response.data.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}> 
        <ActivityIndicator size="large" color="#3D85C6" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}> 
        <Text style={[styles.errorText, { color: theme.textColor }]}>Failed to load profile.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={[styles.scrollContainer, { backgroundColor: theme.background }]}> 
      <View style={styles.container}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <Text style={[styles.name, { color: theme.textColor }]}>{`${user.first_name} ${user.last_name}`}</Text>
        <Text style={[styles.email, { color: theme.textColor }]}>{user.email}</Text>
        <View style={[styles.interestCard, {backgroundColor: theme.interestCard}]}>
          <Text style={[styles.infoText, { color: theme.textColor }]}>City: {user.location ? user.location.city : "Unknown"}</Text>
        </View>
        <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Interests</Text>
        <View style={styles.interestsContainer}>
          <View style={[styles.interestCard, {backgroundColor: theme.interestCard}]}><Text style={[styles.interestText, { color: theme.textColor }]}>Soccer</Text></View>
          <View style={[styles.interestCard, {backgroundColor: theme.interestCard}]}><Text style={[styles.interestText, { color: theme.textColor }]}>Programming</Text></View>
          <View style={[styles.interestCard, {backgroundColor: theme.interestCard}]}><Text style={[styles.interestText, { color: theme.textColor }]}>Electronic Music</Text></View>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.themeButton} onPress={toggleTheme}>
          <Text style={[styles.buttonText, { color: theme.buttonText }]}>Switch Theme</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#00205B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#00205B",
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoText: {
    fontSize: 16,
    color: "#444",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#00205B",
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  interestsContainer: {
    width: '100%',
  },
  interestCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  interestText: {
    fontSize: 16,
    color: "#444",
  },
  logoutButton: {
    padding: 12, 
    borderRadius: 10,
    width: "90%",
    marginTop: 30,
    alignItems: "center",
    backgroundColor: "#E31837",
  },
  themeButton: {
    padding: 12,
    borderRadius: 10,
    width: "90%",
    marginTop: 20,
    alignItems: "center",
    backgroundColor: "#00205B",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default ProfileScreen;