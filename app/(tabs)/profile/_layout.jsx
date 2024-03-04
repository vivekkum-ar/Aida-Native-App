import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import CustomDrawerComponent from '../../../components/customDrawer';
import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { Redirect } from 'expo-router';

export default function Layout() {
  // const navigation = useNavigation();

  // useEffect(() => {
  //   navigation.setOptions({ headerShown: false });
  // }, [navigation]);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}
    >
      <Drawer screenOptions={{
        headerShown: false,   
        drawerActiveTintColor: "#ff9001",
        drawerInactiveTintColor: "#cdcde0",
        drawerLabelStyle: {
          marginLeft: -25,
        },
        
// header
      }}
      drawerContent={(props) => (
        <CustomDrawerComponent {...props} />
      )}
      >
        <Drawer.Screen
          name="index" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Profile',
            drawerPosition: 'right',
            drawerLabelStyle: {
              marginLeft: -25,
            },
            drawerItemStyle: {
              borderBottomColor: "#cdcde0",
              borderBottomWidth: 0.5,
            },
            headerShown: false,
            drawerType: "slide",
            drawerIcon: ({ focused, size }) => (
              <Ionicons
                name="person-outline"
                size={size-5}
                color={focused ? "#fc9001" : "#cdcde0"}
              />
            ),
          }}
          drawerContentOptions={{
            activeTintColor: "#ff9001",
            inactiveTintColor: "#cdcde0",
          }}
          />

<Drawer.Screen
          name="editprofile" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Edit Profile',
            drawerPosition: 'right',
            drawerLabelStyle: {
              marginLeft: -25,
            },
            drawerItemStyle: {
              borderBottomColor: "#cdcde0",
              borderBottomWidth: 0.5,
            },
            headerShown: false,
            drawerType: "slide",
            drawerIcon: ({ focused, size }) => (
              <Ionicons
                name="create-outline"
                size={size-5}
                color={focused ? "#fc9001" : "#cdcde0"}
              />
            ),
          }}
          drawerContentOptions={{
            activeTintColor: "#ff9001",
            inactiveTintColor: "#cdcde0",
          }}
          />
        <Drawer.Screen
          name="user" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Settings',
            drawerPosition: 'right',
            drawerLabelStyle: {
              marginLeft: -25,
            },
            drawerItemStyle: {
              borderBottomColor: "#cdcde0",
              borderBottomWidth: 0.5,
            },
            headerShown: false,
            drawerType: "slide",
            drawerIcon: ({ focused, size }) => (
              <Ionicons
                name="settings-outline"
                size={size-5}
                color={focused ? "#fc9001" : "#cdcde0"}
              />
            ),
          }}
          drawerContentOptions={{
            activeTintColor: "#ff9001",
            inactiveTintColor: "#cdcde0",
          }}
          />
        
        
      </Drawer>
      
    </GestureHandlerRootView>
  );
}
