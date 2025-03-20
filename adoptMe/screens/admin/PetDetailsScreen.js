import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Animated,
  StatusBar,
  SafeAreaView,
  Dimensions,
  Share
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';


const { width } = Dimensions.get("window");
const HEADER_MAX_HEIGHT = 300;
const HEADER_MIN_HEIGHT = 90;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const PetDetailsScreen = ({ route, navigation }) => {
  const { pet } = route.params;
  const { theme } = useTheme();
  const [adopted, setAdopted] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const animatedOpacity = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(animatedOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);
  
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });
  
  const imageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });
  
  const imageTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -50],
    extrapolate: 'clamp',
  });
  
  const titleScale = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.9, 0.8],
    extrapolate: 'clamp',
  });
  
  const titleTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -20, -40],
    extrapolate: 'clamp',
  });
  
  const headerZIndex = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE, HEADER_SCROLL_DISTANCE + 1],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  });
  
  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp',
  });
  
  const sharePet = async () => {
    try {
      await Share.share({
        message: `Check out this adorable ${pet.type} named ${pet.name} available for adoption!`,
        url: pet.image,
      });
    } catch (error) {
      alert('Error sharing pet');
    }
  };
  
  const renderPetInfo = () => (
    <View style={styles.infoSection}>
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <View style={styles.infoIconContainer}>
            <Ionicons name="calendar-outline" size={20} color="#00205B" />
          </View>
          <View>
            <Text style={styles.infoLabel}>Age</Text>
            <Text style={styles.infoValue}>{pet.age} years</Text>
          </View>
        </View>
        
        <View style={styles.infoItem}>
          <View style={styles.infoIconContainer}>
            <Ionicons name={pet.gender === "Male" ? "male" : "female"} size={20} color="#00205B" />
          </View>
          <View>
            <Text style={styles.infoLabel}>Gender</Text>
            <Text style={styles.infoValue}>{pet.gender}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <View style={styles.infoIconContainer}>
            <Ionicons name="resize" size={20} color="#00205B" />
          </View>
          <View>
            <Text style={styles.infoLabel}>Size</Text>
            <Text style={styles.infoValue}>{pet.size}</Text>
          </View>
        </View>
        
        <View style={styles.infoItem}>
          <View style={styles.infoIconContainer}>
            <Ionicons name="paw" size={20} color="#00205B" />
          </View>
          <View>
            <Text style={styles.infoLabel}>Type</Text>
            <Text style={styles.infoValue}>{pet.type}</Text>
          </View>
        </View>
      </View>
    </View>
  );
  
  const generateRandomDescription = () => {
    const personalities = ["playful", "curious", "affectionate", "gentle", "energetic", "calm"];
    const activities = ["playing with toys", "going for walks", "cuddling", "meeting new friends", "exploring"];
    const needs = ["loving home", "patient owner", "regular exercise", "caring family"];
    
    const personality = personalities[Math.floor(Math.random() * personalities.length)];
    const activity = activities[Math.floor(Math.random() * activities.length)];
    const need = needs[Math.floor(Math.random() * needs.length)];
    
    return `${pet.name} is a ${personality} ${pet.type.toLowerCase()} who loves ${activity}. This adorable companion is waiting for a ${need}. With proper care and love, ${pet.name} will be your loyal friend for many years to come.`;
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
      
      <Animated.View
      >
        <Animated.Image
          source={{ uri: pet.image }}
          style={[
            styles.headerImage,
            {
              opacity: imageOpacity,
              transform: [{ translateY: imageTranslateY }],
            },
          ]}
          resizeMode="cover"
        />
        
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'transparent']}
          style={styles.headerGradient}
        />
        
        <Animated.View
          style={[
            styles.headerTitleContainer,
            {
              opacity: headerTitleOpacity,
              transform: [{ scale: titleScale }],
            },
          ]}
        >
          <Text style={styles.headerTitle}>{pet.name}</Text>
        </Animated.View>
      </Animated.View>
      
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      
      <Animated.ScrollView
        contentContainerStyle={styles.scrollContentContainer}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        <View style={{ height: HEADER_MAX_HEIGHT }} />
        
        <Animated.View 
          style={[
            styles.contentContainer,
            {backgroundColor: theme.background},
            {
              opacity: animatedOpacity,
              transform: [
                { 
                  translateY: animatedOpacity.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }) 
                }
              ]
            }
          ]}
        >
          <View style={styles.titleSection}>
            <View>
              <Text style={[styles.petName, {color: theme.textColor}]}>{pet.name}</Text>
              <Text style={[styles.petType, {color: theme.textColor}]}>{pet.type}</Text>
            </View>
            
            <TouchableOpacity 
              style={[styles.favoriteButton, favorite && styles.favoriteButtonActive]}
              onPress={() => setFavorite(!favorite)}
            >
              <Ionicons 
                name={favorite ? "heart" : "heart-outline"} 
                size={22} 
                color={favorite ? theme.textColor : "#E31837"} 
              />
            </TouchableOpacity>
          </View>
          
          {renderPetInfo()}
          
          <View style={styles.descriptionSection}>
            <Text style={[styles.sectionTitle,{color: theme.textColor}]}>About</Text>
            <Text style={[styles.description,{color: theme.textColor}]}>
              {generateRandomDescription()}
            </Text>
          </View>
          
          <View style={styles.contactSection}>
            <Text style={[styles.sectionTitle, {color: theme.textColor}]}>Adoption Information</Text>
            <View style={[styles.contactCard, {backgroundColor: theme.background}]}>
              <View style={styles.contactHeader}>
                <Ionicons name="information-circle" size={24} color={theme.textColor} />
                <Text style={[styles.contactTitle,{color: theme.textColor}]}>Adoption Process</Text>
              </View>
              <Text style={[styles.contactText,{color: theme.textColor}]}>
                Ready to welcome {pet.name} into your family? The adoption process is simple.
                Complete an application, meet with our adoption counselor, and if approved, 
                you can bring {pet.name} home the same day!
              </Text>
              
              <TouchableOpacity style={styles.contactButton} onPress={() => alert("Contact form would open")}>
                <Text style={styles.contactButtonText}>Contact Shelter</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity style={styles.shareButton} onPress={sharePet}>
              <Ionicons name="share-social" size={20} color="#00205B" />
              <Text style={styles.shareButtonText}>Share</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.editButton, { backgroundColor: "#F39C12" }]}
              onPress={() => alert("Edit functionality")}
            >
              <Ionicons name="create" size={20} color="#fff" />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.deleteButton, { backgroundColor: "#E74C3C" }]}
              onPress={() => {
                alert("Pet removed from listings");
                navigation.goBack();
              }}
            >
              <Ionicons name="trash" size={20} color="#fff" />
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.ScrollView>
      
      <View style={[styles.bottomBar,{backgroundColor: theme.background}]}>
        <TouchableOpacity
          style={[styles.adoptButton, adopted && styles.adoptedButton]}
          onPress={() => setAdopted(!adopted)}
        >
          <Ionicons name={adopted ? "checkmark-circle" : "heart"} size={20} color="#fff" />
          <Text style={styles.adoptButtonText}>
            {adopted ? "Solicited" : "Solicit as Adopted"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    backgroundColor: '#00205B',
  },
  headerImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: null,
    height: HEADER_MAX_HEIGHT,
    resizeMode: 'cover',
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  headerTitleContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  scrollContentContainer: {
    paddingBottom: 80,
  },
  contentContainer: {
    padding: 20,
    backgroundColor: '#f5f7fa',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  petName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00205B',
  },
  petType: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  favoriteButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E31837',
  },
  favoriteButtonActive: {
    backgroundColor: '#E31837',
    borderColor: '#E31837',
  },
  infoSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 32, 91, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00205B',
  },
  descriptionSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00205B',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
  },
  contactSection: {
    marginBottom: 20,
  },
  contactCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00205B',
    marginLeft: 8,
  },
  contactText: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
  },
  contactButton: {
    marginTop: 10,
    backgroundColor: '#00205B',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#00205B',
  },
  shareButtonText: {
    color: '#00205B',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  adoptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E31837',
    paddingVertical: 14,
    borderRadius: 8,
  },
  adoptedButton: {
    backgroundColor: '#27AE60',
  },
  adoptButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  petImage: {
    width: '100%',
    height: 250,
    borderRadius: 16,
    marginBottom: 16,
  },
  petInfoContainer: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  petName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00205B',
    marginBottom: 8,
  },
  petBreed: {
    fontSize: 18,
    color: '#555',
    marginBottom: 8,
  },
  petAge: {
    fontSize: 16,
    color: '#777',
  },
});

export default PetDetailsScreen;