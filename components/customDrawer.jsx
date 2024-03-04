import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { Text, TouchableOpacity, View } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { signOut } from "../lib/appwrite";
import { router } from "expo-router";
import { useGlobalContext } from "../context/globalProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
          flex: 1,
        }}
      >
        <DrawerItemList {...props} />
        <View className="px-2 py-1 absolute bottom-0 w-[100%] h-14 flex justify-center items-center">
          <TouchableOpacity activeOpacity={0.5} onPress={() => logout()} className="h-full rounded-sm flex flex-row justify-start items-start w-full grow-1 px-3">
              <View className="text-red-300 translate-y-1">
                <Ionicons name={"log-out-outline"} color={"red"} size={25} />
              </View>
              <View className="translate-y-1.5">
              <Text className="font-pmedium text-red-600">&nbsp;&nbsp;Logout</Text>
              </View>
          </TouchableOpacity>
        </View>
      </DrawerContentScrollView>
    );
};

export default CustomDrawerComponent;
