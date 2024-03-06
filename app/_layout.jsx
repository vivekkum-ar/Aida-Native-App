import { StyleSheet, Text, View } from "react-native";
import React, { useCallback, useMemo, useRef } from "react";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import GlobalProvider from "../context/globalProvider";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CustomBottomSheet from "../components/CustomBottomSheet";
const RootLayout = () => {
  SplashScreen.preventAutoHideAsync();
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });

  const bottomSheetModalRef = useRef(null);
  // callbacks
const handlePresentModalPress = useCallback(() => {
  bottomSheetModalRef.current?.present();
}, []);



  useEffect(() => {
    handlePresentModalPress();
    if (error) throw error;

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <>
      <GlobalProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="search/[query]"
                options={{ headerShown: false }}
              />
              {/* <Stack.Screen name="shared/index" options={{presentation:"modal"}} /> */}
            </Stack>
            <CustomBottomSheet
              children = {
                    <Text className="text-gray-500">Bottom Sheet</Text>
              }
              ref={bottomSheetModalRef}
              snapPoints={["10%", "25%"]}
              handleComponent={
                <View className="flex flex-row justify-center items-start bg-[#cdcde0] rounded-t-xl h-6">
          <Ionicons name="chevron-down" size={30} color="#161622"/>
        </View>
              }
              bottomInset={20}
            />
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </GlobalProvider>
    </>
  );
};

export default RootLayout;

const styles = StyleSheet.create({});
