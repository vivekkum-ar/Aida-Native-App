import { Link, Redirect, router } from "expo-router";
import { ActivityIndicator, Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../constants";
import CustomButton from "../components/CustomButton";
import { StatusBar } from "expo-status-bar";
import { useGlobalContext } from "../context/globalProvider";
import { useEffect, useState } from "react";

export default function Page() {
  const { loading, isLogged } = useGlobalContext();
  
  /* --------- fixes the issue of button always being visible even when user is logged in --------- */
  const btnVisible = () => {
    if (loading)
      return (
        <View className="mt-10 flex flex-row justify-center items-center">
          <ActivityIndicator size="large" color="#cdcde0" />
          <Text className="text-sm font-pmedium text-[#cdcde0] ">
            Loading...
          </Text>
        </View>
      );
    else if(isLogged) return <Redirect href="/home" />;
    else
      return (
        <CustomButton
          title={"Continue with Email"}
          handlePress={() => {
            router.push("/sign-in");
          }}
          containerStyles={"w-full mt-7"}
        ></CustomButton>
      );
  };
  
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full justify-center min-h-[85vh] my-auto px-4 items-center">
          <View
            className="flex flex-row items-center 
          justify-center"
          >
            <Image
              source={images.logoSmall}
              className="w-[80px] h-[64px] scale-150"
              resizeMode="contain"
            />
            <Text className="inline-flex text-4xl text-white font-psemibold pt-[16 px]">
              Aida
            </Text>
          </View>
          <Image
            source={images.cards}
            className="max-w-[380px] w-full h-[300px]"
            resizeMode="contain"
          />
          <View className="relative mt-5">
            <Text className="text-3xl text-white font-bold text-center">
              Discover endless possibilities with{" "}
              <Text className="text-secondary-200">Aida</Text>
            </Text>
            <Image
              className="w-[130px] h-[15px] absolute -bottom-2 -right-8"
              source={images.path}
              resizeMode="contain"
            />
          </View>
          <Text className="font-pregular text-gray-100 mt-7 text-center">
            Where Creativity meets innovations: embark on a journey of limitless
            exploration with Aida
          </Text>
          {btnVisible()}
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light"></StatusBar>
    </SafeAreaView>
  );
}
