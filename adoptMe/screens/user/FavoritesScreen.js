import React from "react";
import { View, Text, FlatList, Image, StyleSheet } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { useFavs } from "../../context/FavsContext";

const FavoritesScreen = () => {
  const { favs } = useFavs();
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.header, { color: theme.textColor }]}>My Fav Pets</Text>

      {favs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.textColor }]}>
            No favorite pets yet.
          </Text>
        </View>
      ) : (
        <FlatList
          data={favs}
          numColumns={2} 
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.petInfoContainer}>
                <Text style={[styles.title, { color: theme.textColor }]}>{item.name}</Text>

              </View>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 24,
    marginTop: 10
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },
  emptyText: {
    fontSize: 18,
    textAlign: "center",
    lineHeight: 24
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    flex: 1,
    margin: 8,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: "100%",
    height: 140,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  petInfoContainer: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "left",
    marginBottom: 4,
    textTransform: "capitalize"
  },
  petType: {
    fontSize: 14,
    textAlign: "left",
    color: "#666"
  }
});

export default FavoritesScreen;