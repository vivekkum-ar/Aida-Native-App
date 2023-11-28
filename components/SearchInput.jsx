import { View, Text, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import React, { useState } from "react";
import { icons } from "../constants";
import { router, usePathname } from "expo-router";

const SearchInput = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  ...props
}) => {
  // const [showPassword, setShowPassword] = useState(false);
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  return (
      <View className="mt-6 space-x-4 flex-row w-full h-16 px-4 bg-black-100 border-2 border-black-200 rounded-2xl focus:border-secondary items-center">
        <TextInput
          className="flex-1 font-pregular text-white mt-0.5 text-base"
          value={query}
          placeholder={placeholder}
          placeholderTextColor={"#cdcde0"}
          onChange={(e) => {setQuery(e.nativeEvent.text)}}
        />
          <TouchableOpacity
            onPress={() => {
              if(!query){
                return Alert.alert("Missing Query","Please enter a search query")
              }
              
              if(pathname.startsWith("/search")){
                router.setParams({query});
              }
                else{
                  router.push(`/search/${query}`)
                }
            }}
          >
            <Image source={icons.search} className="w-5 h-5" resizeMode="contain"></Image>
          </TouchableOpacity>
      </View>
  );
};

export default SearchInput;
