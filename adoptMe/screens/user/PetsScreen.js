import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from "react-native";
import axios from "axios";
import { useTheme } from "../../context/ThemeContext";
import { useFavs } from "../../context/FavsContext";

const PetsScreen = ({ navigation }) => {
  const [pets, setPets] = useState([]);
  const [breedFilter, setBreedFilter] = useState(null);
  const [sizeFilter, setSizeFilter] = useState(null);
  const { theme } = useTheme();
  const { favs, toggleFavs } = useFavs();

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const dogResponse = await axios.get("https://dog.ceo/api/breeds/list/all");
        const breeds = Object.keys(dogResponse.data.message);
        const randomBreeds = breeds.sort(() => 0.5 - Math.random()).slice(0, 10);

        const dogPromises = randomBreeds.map(async (breed) => {
          const res = await axios.get(`https://dog.ceo/api/breed/${breed}/images/random`);
          return { 
            id: `dog-${breed}`, 
            name: breed, 
            type: "Dog", 
            image: res.data.message, 
            size: getDogSize(breed) 
          };
        });
        const dogs = await Promise.all(dogPromises);

        const catResponse = await axios.get("https://api.thecatapi.com/v1/images/search?limit=10");
        const cats = catResponse.data.map((cat, index) => ({
          id: `cat-${index}`, 
          name: `Cat ${index + 1}`, 
          type: "Cat", 
          image: cat.url, 
          size: getCatSize()
        }));

        setPets([...dogs, ...cats]);
      } catch (error) {
        console.error("Error fetching pets:", error);
      }
    };

    fetchPets();
  }, []);

  const getDogSize = (breed) => {
    const sizes = ["Small", "Medium", "Large"];
    return sizes[Math.floor(Math.random() * sizes.length)];
  };

  const getCatSize = () => {
    return "Small"; 
  };

  const filterPets = () => {
    return pets.filter((pet) => {
      const matchesBreed = breedFilter ? pet.name.toLowerCase().includes(breedFilter.toLowerCase()) || pet.type.toLowerCase() === breedFilter.toLowerCase() : true;
      const matchesSize = sizeFilter ? pet.size === sizeFilter : true;
      return matchesBreed && matchesSize;
    });
  };

  const renderItem = ({ item }) => {
    const isFavorite = favs.some((fav) => fav.id === item.id);

    return (
      <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.petInfoContainer}>
          <Text style={[styles.title, { color: theme.textColor }]}>{item.name}</Text>
          <Text style={[styles.type, { color: theme.textColor }]}>
            {item.type === "Dog" ? "🐶" : "🐱"} {item.type} · {item.size}
          </Text>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.detailsButton}
              onPress={() => navigation.navigate("PetDetails", { pet: item })}
            >
              <Text style={styles.buttonText}>View Details</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.favoriteButton, isFavorite ? styles.favoriteActive : styles.favoriteInactive]}
              onPress={() => toggleFavs(item)}
            >
              <Text style={styles.buttonText}>{isFavorite ? "★ Remove" : "☆ Favorite"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.header, { color: theme.textColor }]}>Find Your Perfect Pet</Text>

      <View style={styles.filterSection}>
        <Text style={[styles.filterTitle, { color: theme.textColor }]}>Filter by Type</Text>
        <View style={styles.filterContainer}>
          <TouchableOpacity 
            style={[styles.filterButton, breedFilter === null && styles.activeFilter]} 
            onPress={() => setBreedFilter(null)}
          >
            <Text style={styles.filterText}>All Types</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, breedFilter === "dog" && styles.activeFilter]} 
            onPress={() => setBreedFilter("dog")}
          >
            <Text style={styles.filterText}>Dogs</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, breedFilter === "cat" && styles.activeFilter]} 
            onPress={() => setBreedFilter("cat")}
          >
            <Text style={styles.filterText}>Cats</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.filterTitle, { color: theme.textColor }]}>Filter by Size</Text>
        <View style={styles.filterContainer}>
          <TouchableOpacity 
            style={[styles.filterButton, sizeFilter === null && styles.activeFilter]} 
            onPress={() => setSizeFilter(null)}
          >
            <Text style={styles.filterText}>All Sizes</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, sizeFilter === "Small" && styles.activeFilter]} 
            onPress={() => setSizeFilter("Small")}
          >
            <Text style={styles.filterText}>Small</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, sizeFilter === "Medium" && styles.activeFilter]} 
            onPress={() => setSizeFilter("Medium")}
          >
            <Text style={styles.filterText}>Medium</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, sizeFilter === "Large" && styles.activeFilter]} 
            onPress={() => setSizeFilter("Large")}
          >
            <Text style={styles.filterText}>Large</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList 
        data={filterPets()} 
        renderItem={renderItem} 
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16 
  },
  header: { 
    fontSize: 28, 
    fontWeight: "700", 
    textAlign: "center", 
    marginBottom: 20,
    marginTop: 10
  },
  filterSection: {
    marginBottom: 20
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8
  },
  filterContainer: { 
    flexDirection: "row", 
    flexWrap: "wrap",
    marginBottom: 16
  },
  filterButton: { 
    marginRight: 8,
    marginBottom: 8,
    paddingVertical: 8, 
    paddingHorizontal: 16, 
    backgroundColor: "#e0e0e0", 
    borderRadius: 20
  },
  activeFilter: {
    backgroundColor: "#6B4EFF"
  },
  filterText: { 
    color: "#333", 
    fontWeight: "500" 
  },
  listContainer: {
    paddingBottom: 20
  },
  card: { 
    borderRadius: 16, 
    marginBottom: 20,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  image: { 
    width: "100%", 
    height: 220, 
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16
  },
  petInfoContainer: {
    padding: 16
  },
  title: { 
    fontSize: 20, 
    fontWeight: "700",
    textTransform: "capitalize",
    marginBottom: 6
  },
  type: { 
    fontSize: 16, 
    marginBottom: 16,
    color: "#666"
  },
  buttonsContainer: { 
    flexDirection: "row", 
    justifyContent: "space-between"
  },
  detailsButton: { 
    flex: 1, 
    paddingVertical: 12,
    borderRadius: 8, 
    alignItems: "center", 
    marginRight: 8,
    backgroundColor: "#6B4EFF"
  },
  favoriteButton: { 
    flex: 1, 
    paddingVertical: 12,
    borderRadius: 8, 
    alignItems: "center",
    marginLeft: 8
  },
  favoriteActive: {
    backgroundColor: "#FF8C00"
  },
  favoriteInactive: {
    backgroundColor: "#757575"
  },
  buttonText: { 
    color: "#FFF", 
    fontSize: 16, 
    fontWeight: "600" 
  }
});

export default PetsScreen;