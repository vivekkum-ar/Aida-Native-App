import {
  View,
  Text,
  Image,
  SafeAreaView,
  FlatList,
  RefreshControl,
  ToastAndroid,
  ActivityIndicator,
  StyleSheet,
  ActivityIndicatorBase,
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

const Home = () => {
  const {user} = useGlobalContext();
  const [refreshing, setRefreshing] = useState(false);
  const { data, setData, refetch } = useAppwrite(getAllPosts);
  const [loading,setLoading] = useState(true);
  const latestData = useAppwrite(getLatestPosts);
  const [saveIndex,setSaveIndex] = useState();
  console.log("1",data)
  const onScrollEnd = async () => {
    if (data.length > 1) {
      try {
        ToastAndroid.show("End Reached", ToastAndroid.SHORT);
        const res = await getAllPostsAfter(data[data.length - 1].$id);
        setData([...data, ...res]);
        let timer;
        if(timer) clearTimeout(timer);
        timer = setTimeout(() => {
          setLoading(false);
        },2000);
      } catch (error) {
        let timer;
        if(timer) clearTimeout(timer);
        timer = setTimeout(() => {
          setLoading(false);
        },2000);
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
  const handleStorePost = async (saveId) => {
    try {
      const prevJsonValue = await AsyncStorage.getItem(user.$id);

      /* ---------- if already saved posts then append the new post else create a fresh Array --------- */
      // if(JSON.parse(prevJsonValue)[0] == null){
      //   const jsonValue = JSON.stringify([data[saveId]]);
      // } else{
      //   const jsonValue = JSON.stringify([...JSON.parse(prevJsonValue),data[saveId]]);
      // }
      const jsonValue = JSON.stringify(JSON.parse(prevJsonValue)[0] == null ? [data[saveId]] : [...JSON.parse(prevJsonValue),data[saveId]]);
      console.log(jsonValue);
      await AsyncStorage.setItem(user.$id, jsonValue);
      ToastAndroid.show("Post Saved", ToastAndroid.SHORT);
    } catch (error) {
      // saving error
      ToastAndroid.show("Post not saved", ToastAndroid.SHORT);
      throw new Error(error);
    }
  };


  return (
    <SafeAreaView className="bg-primary">
      <FlatList
        data={data}
        keyExtractor={(item) => item.$id}
        renderItem={({ item,index }) => (
          <VideoCard key={item.$id} video={item} docId={item.$id} saveId={index} updateSaveId={setSaveIndex} />
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
                  className="w-9 h-10"
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
        ListFooterComponent={() => (
          loading && <View className="flex flex-row justify-center">
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
            source={require('../../assets/LottieLoading.json')}
          />
        </View>
        )}
      ></FlatList>
    </SafeAreaView>
  );
};

export default Home;
