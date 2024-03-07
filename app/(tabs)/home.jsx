import {
  View,
  Text,
  Image,
  SafeAreaView,
  FlatList,
  RefreshControl,
  ToastAndroid,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { icons, images } from "../../constants";
import SearchInput from "../../components/SearchInput";
import Trending from "../../components/Trending";
import EmptyState from "../../components/EmptyState";
import {
  getAllPosts,
  getAllPostsAfter,
  getLatestPosts,
} from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import VideoCard from "../../components/VideoCard";
import LottieView from "lottie-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGlobalContext } from "../../context/globalProvider";
import CustomModal from "../../components/CustomModal";

const Home = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [alertData, setAlertData] = useState({ title: "", message: ""});
  const { user } = useGlobalContext();
  const [refreshing, setRefreshing] = useState(false);
  const { data, setData, refetch } = useAppwrite(getAllPosts);
  const [loading, setLoading] = useState(true);
  const latestData = useAppwrite(getLatestPosts);
  const [saveIndex, setSaveIndex] = useState();
  // console.log("1",data)
  const onScrollEnd = async () => {
    if (data.length > 1) {
      try {
        // ToastAndroid.show("End Reached", ToastAndroid.SHORT);
        const res = await getAllPostsAfter(data[data.length - 1].$id);
        setData([...data, ...res]);
        let timer;
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          setLoading(false);
        }, 2000);
      } catch (error) {
        let timer;
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          setLoading(false);
        }, 2000);
        throw new Error(error);
      }
    } else return;
  };
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const animation = useRef(null);
  useEffect(() => {
    // You can control the ref programmatically, rather than using autoPlay
    animation.current?.play();
  }, []);

  /* ---------------------------------------------------------------------------------------------- */
  /*                           Function to handle saving the posts offline                          */
  /* ---------------------------------------------------------------------------------------------- */
  // let output = "";
  const handleStorePost = async (saveId) => {
    try {
      // If saveId is undefined, return early to avoid saving an empty/null object
      if (saveId === undefined) return;
      // output+="passed1";
      // Retrieve previous values from AsyncStorage
      const prevJsonValue = await AsyncStorage.getItem(user.$id);
      // output+="passed2";
      const prevIds = await AsyncStorage.getItem(`${user.$id}_ids`);
      // output+="passed3";
      // Parse the retrieved values, defaulting to empty arrays if null
      const parsedPrevJsonValue = prevJsonValue ? JSON.parse(prevJsonValue) : [];
      // output+="passed4";
      const parsedPrevIds = prevIds ? JSON.parse(prevIds) : [];
      // output+="passed5";
      // Check if the posts have been saved before
      if (parsedPrevIds.length > 0) {
        // output+="passed6";
        // If the post is not already saved, save it
        if (!parsedPrevIds.includes(data[saveId].$id)) {
          // output+="passed7";
          parsedPrevIds.push(data[saveId].$id);
          // output+="passed8";
          parsedPrevJsonValue.push(data[saveId]);
          // output+="passed9";
          await AsyncStorage.setItem(
            `${user.$id}_ids`,
            JSON.stringify(parsedPrevIds)
          );
          // output+="passed10";
          await AsyncStorage.setItem(
            user.$id,
            JSON.stringify(parsedPrevJsonValue)
          );
          // output+="passed11";
          ToastAndroid.show("Post Saved", ToastAndroid.SHORT);
        } else {
          ToastAndroid.show("Post already saved", ToastAndroid.SHORT);
          // output+="passed12";
        }
      } else {
        // If no post is saved, save the current post
        parsedPrevIds.push(data[saveId].$id);
        // output+="passed13";
        parsedPrevJsonValue.push(data[saveId]);
        // output+="passed14";
        await AsyncStorage.setItem(
          `${user.$id}_ids`,
          JSON.stringify(parsedPrevIds)
        );
        // output+="passed15";
        await AsyncStorage.setItem(
          user.$id,
          JSON.stringify(parsedPrevJsonValue)
        );
        // output+="passed16";
        ToastAndroid.show("Post Saved", ToastAndroid.SHORT);
      }
    } catch (error) {
      // Saving error
      ToastAndroid.show("Post not saved", ToastAndroid.SHORT);
      // Alert.alert("Error", error.message, [
      //   { text: "OK", onPress: () => console.log("OK Pressed") },
      // ]);
      setAlertData({title:"Error",message:error.message});
    setModalVisible(true);
      throw new Error(error);
    }
  };

  // Used to save the post offline
  useEffect(() => {
    handleStorePost(saveIndex);
  }, [saveIndex]);

  return (
    <SafeAreaView className="bg-primary">
      <CustomModal
      ModalVisibility={modalVisible}
      UpdateModalVisibility={setModalVisible}
      closeButton={true}
      AlertMessage={alertData.message}
      AlertTitle={alertData.title}
      closeButtonText="OK"
      widthFix={true}
      />
      <FlatList
        data={data}
        keyExtractor={(item) => item.$id}
        renderItem={({ item, index }) => (
          <VideoCard
            key={item.$id}
            video={item}
            docId={item.$id}
            saveId={index}
            updateSaveId={setSaveIndex}
          />
          // <Text>{item.$id}</Text>
        )}
        ListHeaderComponent={() => (
          <View className="my-16 px-4 space-y-6">
            <View className="flex flex-row justify-between items-start">
              <View className="">
                <Text className="font-pmedium text-sm text-gray-100">
                  Welcome Back
                </Text>
                <Text className="font-psemibold text-2xl text-white">Viv</Text>
              </View>
              <View className="mt-1.5">
                <Image
                  source={images.logoSmall}
                  className="w-9 h-10 scale-150"
                  resizeMode="contain"
                ></Image>
              </View>
            </View>
            <SearchInput placeholder={"Search for a video"} />
            <View className="w-full pt-5 pb-8 flex-1">
              <Text className="text-gray-100 text-pregular text-lg mb-3">
                Latest Videos
              </Text>
              <Trending className="" posts={latestData.data ?? []} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title={"No videos found"}
            description={"Please try again later"}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          ></RefreshControl>
        }
        onEndReachedThreshold={0.9}
        onEndReached={() => {
          if (data.length > 1) {
            onScrollEnd();
          }
        }}
        ListFooterComponent={() =>
          loading && (
            <View className="flex flex-row justify-center">
              <LottieView
                autoPlay
                ref={animation}
                style={{
                  width: 800,
                  height: 100,
                  // backgroundColor: '#eee',
                }}
                className="scale-150 border border-white -translate-y-10"
                // Find more Lottie files at https://lottiefiles.com/featured
                source={require("../../assets/LottieLoading.json")}
              />
            </View>
          )
        }
      ></FlatList>
    </SafeAreaView>
  );
};

export default Home;
