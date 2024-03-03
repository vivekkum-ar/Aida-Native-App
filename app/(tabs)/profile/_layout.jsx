import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';

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
// header
      }}>
        <Drawer.Screen
          name="index" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Home',
            drawerPosition: 'right',
            headerShown: false,
            drawerType: "front",
          }}
          />
        <Drawer.Screen
          name="user" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'user',
            drawerPosition: 'right',
            headerShown: false,
            drawerType: "front",
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
