import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  Button,
} from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { icons, images } from "../../../constants";
import CustomModal from "../../../components/CustomModal";
import LottieView from "lottie-react-native";
import musicLottie from "../../../assets/music-animation.json";
import editingLottie from "../../../assets/editing-lady.json";
import storyWriting from "../../../assets/script-writing.json";

const AiVideo = () => {
  const [query, setQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [alertData, setAlertData] = useState({ title: "", message: "" });
  return (
    <View className="flex-1 p-2 bg-primary">
      <CustomModal
        ModalVisibility={modalVisible}
        UpdateModalVisibility={setModalVisible}
        closeButton={query ? false : true}
        AlertMessage={alertData.message}
        AlertTitle={alertData.title}
        closeButtonText="OK"
        widthFix={true}
      >
        {query ? (
          <View className="flex-row justify-center">
            <LottieView
              autoPlay
              loop
              source={setTimeout(() => {
                if (Math.round(Math.random() * 2) + 1 === 1) {
                  return musicLottie;
                } else if (Math.round(Math.random() * 2) + 1 == 2) {
                  return editingLottie;
                } else {
                  return storyWriting;
                }
              }, 1500)}
              colorFilters={[{ keypath: "button", color: "#FF0000" }]}
              className="w-52 h-52"
            ></LottieView>
          </View>
        ) : (
          ""
        )}
      </CustomModal>

      <StatusBar style="light" backgroundColor="#161622" hidden={false} />
      <View className="px-4 space-y-2">
        <View className="flex flex-row justify-between items-start">
          <View className="flex-1 items-start">
            <Text className="font-pmedium text-sm text-gray-100">
              A.I. results
            </Text>
            <View className="flex flex-row justify-center items-start">
              <Image className="w-6 h-6 mt-1" source={icons.ai} />
              <Text className="font-psemibold text-md text-white">
                {query ? query : "Please enter a prompt to generate a video"}
              </Text>
            </View>
          </View>
          {/* <View className="mt-1.5">
                <Image
                  source={images.logoSmall}
                  className="w-9 h-10 scale-150"
                  resizeMode="contain"
                ></Image>
              </View> */}
        </View>

        {/* ------------------------------ This is the SearchInput component ----------------------------- */}
        <View className="mt-4 flex flex-row items-center space-x-4 w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-secondary">
          <TextInput
            className="text-base mt-0.5 text-white flex-1 font-pregular"
            value={query}
            placeholder="Imagine something 🚀 ..."
            placeholderTextColor="#CDCDE0"
            onChangeText={(e) => setQuery(e)}
          />

          <TouchableOpacity
            onPress={() => {
              if (query === "") {
                setAlertData({
                  title: "Error",
                  message: "Please enter a prompt to generate a video",
                });
                setModalVisible(true);
                return;
              } else {
                setAlertData({
                  title: "Loading",
                  message: "Preparing your video.....",
                });
                setModalVisible(true);
                return;
              }
            }}
            onLongPress={() => {
              setModalVisible(true);
            }}
          >
            <Image
              source={icons.search}
              className="w-5 h-5"
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        {/* <View className="w-full pt-5 pb-8 flex-1">
            <Text className="text-gray-100 text-pregular text-lg mb-3">
              Latest Videos
            </Text>
            <Trending 
            className=""
            posts = {latestData.data ?? []} 
            />
           </View> */}
      </View>
    </View>
  );
};

export default AiVideo;
