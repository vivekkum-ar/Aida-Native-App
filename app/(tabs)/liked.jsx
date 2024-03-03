import { View, Text, Image, SafeAreaView, FlatList, RefreshControl, TouchableOpacity, ToastAndroid, Alert } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { icons } from '../../constants'
import EmptyState from '../../components/EmptyState'
import { getLikedPost, signOut } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '../../components/VideoCard'
import { router } from 'expo-router'
import { useGlobalContext } from '../../context/globalProvider'
import InfoBox from '../../components/InfoBox'
import LottieView from 'lottie-react-native'
import millify from 'millify'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Liked = () => {
  const { user ,setUser, setIsLogged } = useGlobalContext();
  const [refreshing, setRefreshing] = useState(false);
  // const [debugText, setDebugText] = useState("");
  const {data,setData,refetch} = useAppwrite(() => getLikedPost(user.$id,0,true));
  const [loading,setLoading] = useState(true);
  const [likedTabActive,setLikeTabActive] = useState(true);
  const [saveData,setSaveData] = useState([]);
  const [saveIndex,setSaveIndex] = useState();
  const [deleteIndex,setDeleteIndex] = useState();

  // console.log("hi",posts)
  const onScrollEnd = async () => {
    if (data.length > 1) {
      try {
        // ToastAndroid.show("End Reached", ToastAndroid.SHORT);
        const res = await getLikedPost(user.$id,data[data.length - 1].$id,false);
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
  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLogged(false);
    router.replace("/sign-in");
  };

 /* ---------------------------------------------------------------------------------------------- */
 /*                        Empty the saved data (ONLY FOR DEBUGGING PURPOSE)                       */
 /* ---------------------------------------------------------------------------------------------- */
//   useEffect(() => {const handle = async () => {
//   //     handleRetrievePost();
// await AsyncStorage.setItem(user.$id, JSON.stringify([]));
// await AsyncStorage.setItem(`${user.$id}_ids`, JSON.stringify([]));

//   }
// handle();
// }, [])


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
      Alert.alert("Error", error.message, [
        { text: "OK", onPress: () => console.log("OK Pressed") },
      ]);
      throw new Error(error);
    }
  };
  
  
  // Used to save the post offline
  useEffect(() => {
    handleStorePost(saveIndex);
  }, [saveIndex]);

  /* ---------------------------------------------------------------------------------------------- */
  /*                         Function to handle retreiving the post offline                         */
  /* ---------------------------------------------------------------------------------------------- */
  const handleRetrievePost = async () => {
    try {
      // console.log("clicked handleRetrievePost")
      const jsonValue = await AsyncStorage.getItem(user.$id);
      // console.log("jsonValue",JSON.parse(jsonValue)[0] == null);
      // console.log("saveData",saveData);

      /* ------------------- carefully crafted check so saveData is always an Array ------------------- */
      if(JSON.parse(jsonValue)[0] == null) return;  
      setSaveData(JSON.parse(jsonValue));

    } catch (error) {
      // error reading value
      throw new Error(error);
    }
  };

  
  /* ---------------------------------------------------------------------------------------------- */
  /*                          Function to handle deleting the posts offline                         */
  /* ---------------------------------------------------------------------------------------------- */
  const handleDeletePost = async (deleteId) => {
    try {
      // if deleteId is undefined otherwise it will save an empty/null object on every render
      if(deleteId == undefined) return;
      const prevJsonValue = await AsyncStorage.getItem(user.$id);
      const prevIds = await AsyncStorage.getItem(`${user.$id}_ids`);

      await AsyncStorage.setItem(user.$id, JSON.stringify(JSON.parse(prevJsonValue).toSpliced(deleteId,1)));
      await AsyncStorage.setItem(`${user.$id}_ids`, JSON.stringify(JSON.parse(prevIds).toSpliced(deleteId,1)));
      ToastAndroid.show("Post Deleted", ToastAndroid.SHORT);
      handleRetrievePost();
    } catch (error) {
      // error reading value
      throw new Error(error);
    }
  };
  // Used to delete the saved post
  useEffect(() => {
    handleDeletePost(deleteIndex);
  }, [deleteIndex]);

  return (
    <SafeAreaView className="bg-primary h-full">

      <FlatList
        data={likedTabActive ? data ?? [] : saveData}
        keyExtractor={(item) => item.$id}
        renderItem={({ item, index }) => (
          <VideoCard
            key={item.$id}
            video={item}
            docId={item.$id}
            saveId={index}
            updateSaveId={setSaveIndex}
            deleteVisible={likedTabActive ? false : true}
            deleteId={index}
            updateDeleteId={setDeleteIndex}
          />
        )}
        // onEndReachedThreshold={0.2}
        // onEndReached={() => {

        // }}
        ListHeaderComponent={() => (
          <View className="w-full flex justify-center items-center mt-12 px-4">
            <Text className="text-white text-sm">
{/* {debugText} */}
</Text>
            {/* <TouchableOpacity 
            className="flex w-full items-end mb-10"
            onPress={logout}
            >
              <Image
                source={icons.logout}
                resizeMode="contain"
                className="w-6 h-6"
              />
              </TouchableOpacity> */}
            <View className="w-16 h-16 border border-secondary rounded-lg flex justify-center items-center">
              <Image
                source={{ uri: user?.avatar }}
                className="w-[90%] h-[90%] rounded-lg"
                resizeMode="cover"
              />
            </View>

            <InfoBox
              title={user?.username}
              containerStyles="mt-5"
              titleStyles="text-lg"
            />

            <View className="mt-5 flex flex-row">
              <InfoBox
                title={data.length || 0}
                subtitle="Liked Posts"
                titleStyles="text-xl"
                containerStyles="mr-10"
              />
              <InfoBox
                title={saveData.length}
                subtitle="Saved Posts"
                titleStyles="text-xl"
                containerStyles="mr-10"
              />
              <InfoBox
                title={millify(user.followedByUsers.length) || 0}
                subtitle="Followers"
                titleStyles="text-xl"
              />
            </View>

            {/* ----------------------------- Manually designed tab bar component ---------------------------- */}
            <View className="w-screen h-12 my-4 flex flex-row justify-center items-center">
              <TouchableOpacity
                className={`py-2 basis-1/2 ${
                  likedTabActive ? "border-b-4 border-secondary" : ""
                }`}
                onPress={async () => {setLikeTabActive(true);}}
                // onLongPress={() => {setDebugText(output); console.log("first",output)}}
              >
                <Text
                  className={`text-center text-sm font-pmedium flex flex-row justify-center items-end ${
                    likedTabActive ? "text-secondary" : "text-[#cdcde0]"
                  }`}
                >
                  <Image
                    source={
                      likedTabActive ? icons.likeactiveyellow : icons.like
                    }
                    className="w-8 h-6"
                    resizeMode="contain"
                  ></Image>
                  Liked
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`py-2 basis-1/2 ${
                  !likedTabActive ? "border-b-4 border-secondary" : ""
                }`}
                onPress={() => {
                  setLikeTabActive(false);
                  handleRetrievePost();
                }}
              >
                <Text
                  className={`text-center text-sm font-pmedium flex flex-row justify-center items-end ${
                    !likedTabActive ? "text-secondary" : "text-[#cdcde0]"
                  }`}
                >
                  <Image
                    source={
                      !likedTabActive
                        ? icons.bookmarkfillactiveyellow
                        : icons.bookmarkfill
                    }
                    className="w-8 h-6"
                    resizeMode="contain"
                  ></Image>
                  Saved
                </Text>
              </TouchableOpacity>
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
                className="scale-150 border border-white "
                // Find more Lottie files at https://lottiefiles.com/featured
                source={require("../../assets/LottieLoading.json")}
              />
            </View>
          )
        }
      ></FlatList>
    </SafeAreaView>
  );
}

export default Liked