import { createDrawerNavigator } from "@react-navigation/drawer";
import ProfileScreen from "../screens/admin/ProfileScreen";
import { Feather } from "@expo/vector-icons";
import { createStackNavigator } from '@react-navigation/stack';
import PetsScreen from "../screens/admin/PetsScreen";
import PetDetailsScreen from "../screens/admin/PetDetailsScreen";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const AdminStackNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen
      name="Home"
      component={PetsScreen}
    />
    <Stack.Screen
      name="PetDetailsScreen"
      component={PetDetailsScreen}
    />
  </Stack.Navigator>
);

const AdminNavigator = () => (
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
      component={AdminStackNavigator}
      options={{
        drawerIcon: ({ color }) => <Feather name="home" size={24} color={color} />,
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


export default AdminNavigator;