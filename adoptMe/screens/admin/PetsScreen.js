import React, { useEffect, useState, useRef } from "react";
import {
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  FlatList, 
  Image, 
  StatusBar,
  Animated,
  ActivityIndicator,
  SafeAreaView,
  Dimensions,
  Platform,
  Modal,
  TextInput
} from "react-native";
import axios from "axios";
import { useTheme } from "../../context/ThemeContext";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.85;

const PetsScreen = ({ navigation }) => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const { theme } = useTheme();
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

const [modalVisible, setModalVisible] = useState(false);
const [petName, setPetName] = useState("");
const [petDetails, setPetDetails] = useState("");
const [petImage, setPetImage] = useState(null);

const toggleModal = () => {
  setModalVisible(!modalVisible);
};

const renderAddPetModal = () => (
  <Modal background="#220" visible={modalVisible} animationType="slide">
    <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={toggleModal}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Add a Pet</Text>

        <TouchableOpacity style={styles.imagePicker}>
          <Ionicons name="camera" size={24} color="#777" />
          <Text style={styles.imageText}>Upload Image</Text>
        </TouchableOpacity>

        {petImage && <Image source={{ uri: petImage }} style={styles.previewImage} />}

        <TextInput
          style={styles.input}
          placeholder="Pet Name"
          value={petName}
          onChangeText={setPetName}
        />

        <TextInput
          style={[styles.input, styles.detailsInput]}
          placeholder="Details"
          value={petDetails}
          onChangeText={setPetDetails}
          multiline
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={toggleModal}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  </Modal>
);


  useEffect(() => {
    fetchPets();
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const fetchPets = async () => {
    try {
      setLoading(true);
      
      // Fetch dogs
      const responseDogs = await axios.get("https://dog.ceo/api/breeds/list/all");
      const breeds = Object.keys(responseDogs.data.message);
      const randomBreeds = breeds.sort(() => 0.5 - Math.random()).slice(0, 10);

      const dogsPromises = randomBreeds.map(async (breed) => {
        const res = await axios.get(`https://dog.ceo/api/breed/${breed}/images/random`);
        return {
          id: `dog-${breed}`,
          name: breed.charAt(0).toUpperCase() + breed.slice(1),
          type: "Dog",
          image: res.data.message,
          age: Math.floor(Math.random() * 10) + 1, // Random age between 1-10
          gender: Math.random() > 0.5 ? "Male" : "Female",
          size: ["Small", "Medium", "Large"][Math.floor(Math.random() * 3)],
        };
      });
      const dogs = await Promise.all(dogsPromises);

      // Fetch cats
      const responseCats = await axios.get("https://api.thecatapi.com/v1/images/search?limit=10");
      const cats = responseCats.data.map((cat, index) => ({
        id: `cat-${index}`,
        name: `Whiskers ${index + 1}`,
        type: "Cat",
        image: cat.url,
        age: Math.floor(Math.random() * 10) + 1, // Random age between 1-10
        gender: Math.random() > 0.5 ? "Male" : "Female",
        size: ["Small", "Medium", "Large"][Math.floor(Math.random() * 3)],
      }));

      setPets([...dogs, ...cats]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching pets:", error);
      setLoading(false);
    }
  };

  const filterPets = (type) => {
    setActiveFilter(type);
  };

  const getFilteredPets = () => {
    if (activeFilter === "All") return pets;
    return pets.filter(pet => pet.type === activeFilter);
  };

  const renderItem = ({ item, index }) => {
    const inputRange = [
      (index - 1) * CARD_WIDTH,
      index * CARD_WIDTH,
      (index + 1) * CARD_WIDTH
    ];
    
    const scale = scrollY.interpolate({
      inputRange,
      outputRange: [0.9, 1, 0.9],
      extrapolate: 'clamp'
    });

    const opacity = scrollY.interpolate({
      inputRange,
      outputRange: [0.7, 1, 0.7],
      extrapolate: 'clamp'
    });

    return (
      <Animated.View style={[
        styles.cardContainer,
        { 
          transform: [{ scale }],
          opacity
        }
      ]}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate("PetDetailsScreen", { pet: item })}
        >
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)']}
              style={styles.gradient}
            />
            
            <View style={styles.petBadge}>
              <Text style={styles.petType}>{item.type}</Text>
            </View>
            
            <View style={styles.cardContent}>
              <Text style={styles.title}>{item.name}</Text>
              <View style={styles.petInfo}>
                <View style={styles.infoChip}>
                  <Ionicons name="calendar-outline" size={14} color="#fff" />
                  <Text style={styles.infoText}>{item.age} yr</Text>
                </View>
                <View style={styles.infoChip}>
                  <Ionicons name={item.gender === "Male" ? "male" : "female"} size={14} color="#fff" />
                  <Text style={styles.infoText}>{item.gender}</Text>
                </View>
                <View style={styles.infoChip}>
                  <Ionicons name="resize" size={14} color="#fff" />
                  <Text style={styles.infoText}>{item.size}</Text>
                </View>
              </View>
              
              <TouchableOpacity
                style={styles.detailsButton}
                onPress={() => navigation.navigate("PetDetailsScreen", { pet: item })}
              >
                <Text style={styles.detailsButtonText}>View Details</Text>
                <Ionicons name="chevron-forward" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderHeader = () => (
    <Animated.View 
      style={[
        styles.header,
        {backgroundColor:theme.background},
        {
          opacity: fadeAnim,
          transform: [
            { 
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-50, 0]
              })
            }
          ]
        }
      ]}
    >
      <View style={styles.headerTopRow}>
        <View>
          <Text style={[styles.welcomeText, {color: theme.textColor}]}>Find Your</Text>
          <Text style={[styles.headerTitle, {color: theme.textColor}]}>Perrita or Gatita</Text>
        </View>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[styles.filterButton, activeFilter === "All" && styles.activeFilter]}
          onPress={() => filterPets("All")}
        >
          <Text style={[styles.filterText, activeFilter === "All" && styles.activeFilterText]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterButton, activeFilter === "Dog" && styles.activeFilter]}
          onPress={() => filterPets("Dog")}
        >
          <Text style={[styles.filterText, activeFilter === "Dog" && styles.activeFilterText]}>Dogs</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterButton, activeFilter === "Cat" && styles.activeFilter]}
          onPress={() => filterPets("Cat")}
        >
          <Text style={[styles.filterText, activeFilter === "Cat" && styles.activeFilterText]}>Cats</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" style={{color: theme.textColor}} />
        <Text style={[styles.loadingText,{color: theme.textColor}]}>Finding Perritas y Gatitas...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="dark-content" style={{backgroundColor: theme.background}} />
      
      {renderHeader()}
      
      <Animated.FlatList 
        data={getFilteredPets()}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        style={{ opacity: fadeAnim }}
      />
      
      <TouchableOpacity 
        style={styles.floatingButton} 
        onPress={toggleModal}
      >
        <Ionicons name="paw" size={24} color="#fff" />
      </TouchableOpacity>

      {renderAddPetModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#00205B",
    fontWeight: "500",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 20 : 10,
    paddingBottom: 10,
    backgroundColor: "#f5f7fa",
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00205B",
  },
  filterContainer: {
    flexDirection: "row",
    marginVertical: 10,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  activeFilter: {
    backgroundColor: "#00205B",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  activeFilterText: {
    color: "#fff",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  cardContainer: {
    width: "100%",
    marginBottom: 20,
  },
  card: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: 220,
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
  },
  petBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "#E31837",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  petType: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  cardContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  petInfo: {
    flexDirection: "row",
    marginBottom: 12,
  },
  infoChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginRight: 8,
  },
  infoText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 4,
  },
  detailsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00205B",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "flex-end",
  },
  detailsButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 4,
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#E31837",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semi-transparente
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  imagePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    width: '100%',
    justifyContent: 'center',
  },
  imageText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#777',
  },
  previewImage: {
    width: 100,
    height: 100,
    marginBottom: 15,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    fontSize: 16,
  },
  detailsInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    color: '#333',
  },
});

export default PetsScreen;