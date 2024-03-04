import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

const AiVideo = () => {
  return (
    <SafeAreaView>
      {/* <StatusBar
              animated={true}
              backgroundColor="#61dafb"
              // barStyle={statusBarStyle}
              // showHideTransition={statusBarTransition}
              hidden={true}
            /> */}
      <StatusBar style="light" backgroundColor="#161622" hidden={false} />
      <Text className="text-2xl font-pextrabold text-white">
        Settings Settings
      </Text>
    </SafeAreaView>
  );
};

export default AiVideo;
