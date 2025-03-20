import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import { useTheme } from "../../context/ThemeContext";

const PetDetailsScreen = ({ route }) => {
  const { pet } = route.params;
  const { theme } = useTheme();
  const [adopted, setAdopted] = useState(false);

  const submitRequest = () => {
    Alert.alert(
      "Request Submitted",
      `You've submitted an adoption request for ${pet.name}. We'll contact you soon.`,
      [{ text: "OK" }]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Image source={{ uri: pet.image }} style={styles.image} />

      <View style={styles.infoContainer}>
        <Text style={[styles.title, { color: theme.textColor }]}>{pet.name}</Text>
        <Text style={[styles.type, { color: theme.textColor }]}>
          {pet.type === "Dog" ? "🐶" : "🐱"} {pet.type} · {pet.size}
        </Text>

        <View style={styles.detailsCard}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>About</Text>
          <Text style={[styles.description, { color: theme.textColor }]}>
            This pet is looking for a loving forever home. Consider adopting and giving them the life they deserve!
          </Text>
        </View>

        <TouchableOpacity
          style={styles.adoptButton}
          onPress={submitRequest}
        >
          <Text style={styles.buttonText}>📩 Submit Adoption Request</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: 300,
    marginBottom: 16,
  },
  infoContainer: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 6,
    textTransform: "capitalize",
  },
  type: {
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 24,
    color: "#666",
  },
  detailsCard: {
    backgroundColor: "#F5F5F5",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    marginBottom: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "left",
    marginBottom: 8,
  },
  adoptButton: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#6B4EFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default PetDetailsScreen;