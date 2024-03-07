import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Image, Linking, Text, TouchableOpacity, View } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Octicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { signOut } from "../lib/appwrite";
import { router } from "expo-router";
import { useGlobalContext } from "../context/globalProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { images } from "../constants";

const CustomDrawerComponent = (props) => {
  // const{top, bottom} = useSafeAreaInsets();
  const { user, setIsLogged } = useGlobalContext();

  const handleSaveStorageClear = async () => {
    await AsyncStorage.setItem(user.$id, JSON.stringify([]));
    await AsyncStorage.setItem(`${user.$id}_ids`, JSON.stringify([]));
    // ToastAndroid.show("Data Cleared", ToastAndroid.SHORT);
  };

  const logout = async () => {
    await signOut();
    // gives error $id is null
    // setUser(null);

    /* ---------------------------------------------- - --------------------------------------------- */
    /* ----------- Delete all data from storage when user logs out to prevent data leakage ---------- */
    /* ---------------- otherwise user will be able to see the data of previous user ---------------- */
    /* ---------------------------------------------- - --------------------------------------------- */
    handleSaveStorageClear();

    setIsLogged(false);
    router.replace("/sign-in");
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{
        backgroundColor: "#161622",
        borderLeftWidth: 0.5,
        borderLeftColor: "#cdcde0",
        flex: 1,
      }}
    >
        <View className="px-2 py-1 w-[100%] h-24 flex justify-center items-center mb-4">
          <TouchableOpacity
            activeOpacity={0.5}
            // onPress={() => logout()}
            className="h-full rounded-sm flex flex-row justify-center items-center w-full grow-1 px-3"
          >
            <View className="">
              <Image source={images.logoSmall} className="h-20 w-20"></Image>
            </View>
            <View className="">
              <Text className="font-pbold text-3xl text-[#cdcde0]">
                &nbsp;&nbsp;Aida
              </Text>
            </View>

          </TouchableOpacity>
            <View className="px-4 opacity-60">
              <Text className="font-pregular text-xs text-[#cdcde0]">
                &nbsp;&nbsp;ver 1.0.0
              </Text>
          </View>
        </View>
      <DrawerItemList {...props} />

      {/* ------------------------------------- Privacy Policy Page ------------------------------------ */}
      <DrawerItem
        label="Privacy Policy"
        icon={({ focused, size }) => (
          <MaterialCommunityIcons name="police-badge" size={size - 5} color={focused ? "#fc9001" : "#cdcde0"} />
        )}
        labelStyle={{ marginLeft: -25 }}
        style={{
          borderBottomColor: "#cdcde0",
          borderBottomWidth: 0.5,
        }}
        inactiveTintColor="#cdcde0"
        activeTintColor="#fc9001"
        onPress={() => Linking.openURL("https://aidain.web.app/privacy")}
      />

      {/* ------------------------------------- Terms & Conditions Page ------------------------------------ */}
      <DrawerItem
        label="Terms & Conditions"
        icon={({ focused, size }) => (
          <Octicons name="law" size={size - 5} color={focused ? "#fc9001" : "#cdcde0"} />
        )}
        labelStyle={{ marginLeft: -25 }}
        style={{
          borderBottomColor: "#cdcde0",
          borderBottomWidth: 0.5,
        }}
        inactiveTintColor="#cdcde0"
        activeTintColor="#fc9001"
        onPress={() => Linking.openURL("https://aidain.web.app/terms")}
      />
      <View className="px-2 py-1 absolute bottom-0 w-[100%] h-14 flex justify-center items-center">
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => logout()}
          className="h-full rounded-sm flex flex-row justify-start items-start w-full grow-1 px-3"
        >
          <View className="text-red-300 translate-y-1">
          <MaterialCommunityIcons name="logout" size={25} color="red" />
          </View>
          <View className="translate-y-1.5">
            <Text className="font-pmedium text-red-600">
              &nbsp;&nbsp;Logout
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

export default CustomDrawerComponent;
