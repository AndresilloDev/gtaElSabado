import { createDrawerNavigator } from "@react-navigation/drawer";
import ProfileScreen from "../screens/user/ProfileScreen";
import { Feather } from "@expo/vector-icons";
import { createStackNavigator } from '@react-navigation/stack';
import PetsScreen from "../screens/admin/PetsScreen";
import PetDetailsScreen from "../screens/admin/PetDetailsScreen";
import FavoritesScreen from "../screens/user/FavoritesScreen";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const UserStackNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen
      name="Inicio"
      component={PetsScreen}
    />
    <Stack.Screen
      name="PetDetailsScreen"
      component={PetDetailsScreen}
    />
  </Stack.Navigator>
);

const UserNavigator = () => (
  <Drawer.Navigator
    screenOptions={{
      headerShown: true, 
      headerStyle: {
        backgroundColor: "#57B4BA", 
      },
      headerTintColor: "#fff", 
      headerTitleStyle: {
        fontWeight: "bold",
      },
      drawerActiveBackgroundColor: "#FE4F2D",
      drawerActiveTintColor: "#fff", 
      drawerInactiveTintColor: "#333", 
      drawerStyle: {
        backgroundColor: "#57B4BA", 
        width: 240,
      },
    }}
  >
    <Drawer.Screen
      name="Inicio"
      component={UserStackNavigator}
      options={{
        drawerIcon: ({ color }) => <Feather name="home" size={24} color={color} />,
      }}
    />
    <Drawer.Screen
      name="Favoritos"
      component={FavoritesScreen}
      options={{
        drawerIcon: ({ color }) => <Feather name="star" size={24} color={color} />,
      }}
    />
    <Drawer.Screen
      name="Perfil"
      component={ProfileScreen}
      options={{
        drawerIcon: ({ color }) => <Feather name="user" size={24} color={color} />,
      }}
    />
  </Drawer.Navigator>
);

export default UserNavigator;