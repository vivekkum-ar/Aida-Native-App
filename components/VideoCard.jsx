import { useState } from "react";
import { View, Text, TouchableOpacity, Image, Alert, ToastAndroid } from "react-native";
import { icons } from "../constants";
import { ResizeMode, Video } from "expo-av";
import { useGlobalContext } from "../context/globalProvider";
import { likePost } from "../lib/appwrite";
import * as Clipboard from 'expo-clipboard';
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';

const VideoCard = ({
  video: {
    title,
    thumbnail,
    video,
    users: { username, avatar },
    likedByUsers,
    prompt,
    $createdAt,
    $id
  },
  docId,
  ...props
}) => {
  const { user } = useGlobalContext();
  const [likedState, setLikedState] = useState(likedByUsers.includes(user.$id) ? true : false);
  const [likesCounter, setLikesCOunter] = useState(likedByUsers.length);
  /* --------------------------------- State to show/hide the menu -------------------------------- */
  const [visible, setVisible] = useState(false);
  const hideMenu = () => setVisible(false);
  const showMenu = () => setVisible(true);

/* ------------- Copy to clipboard function to copy the prompt text to the clipboard ------------ */
  const copyToClipboard = async (copiedText) => {
    await Clipboard.setStringAsync(copiedText);
    ToastAndroid.show("Text copied to clipboard", ToastAndroid.showWithGravity,ToastAndroid.SHORT);
  };

  const [play, setPlay] = useState(false);
  const handleVideoLike = () => {
    // Alert.alert(`${likedState} ${user.$id} ${likedByUsers.includes(user.$id)}`);
    /* -------------------- transferring each from likedByUsers to likedFromUsers ------------------- */
    let likedFromUsers = [];
    likedByUsers.map((userId) => {
      likedFromUsers.push(userId);
    });
    /* ------------- Editing the likedFromUsers array based on the likedState at client ------------- */
    if(likedState) { // if the video is already liked by the user
      likedFromUsers = likedFromUsers.filter((userId) => userId !== user.$id);
    } else { // if the video is not liked by the user
      likedFromUsers.push(user.$id);
    }

    /* ---- Implemented debouncing to prevent multiple requests to the server when liking a post ---- */
    let timer;
    if(timer) clearTimeout(timer);
      setTimeout(() => {
        try {
          likePost(docId, likedFromUsers, user.$id,true);
          // Alert.alert("Success", "Video liked successfully");
        } catch (error) {
          // console.error(video);
          // Alert.alert("failed", `Video not liked ${likedByUsers}`);
          throw new Error(error);
        }
      },3000);
  };

  return (
    <View className="flex flex-col items-center px-4 mb-14" key={props.key}>
      <View className="flex flex-row gap-3 items-start">
        <View className="flex justify-center items-center flex-row flex-1">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary flex justify-center items-center p-0.5">
            <Image
              source={{ uri: avatar }}
              className="w-full h-full rounded-lg"
              resizeMode="cover"
            />
          </View>

          {/* <Text className="text-white">{thumbnail}</Text> */}
          <View className="flex justify-center flex-1 ml-3 gap-y-1">
            <Text
              className="font-psemibold text-sm text-white"
              numberOfLines={1}
            >
              {username}
            </Text>
            <Text
              className="text-xs text-gray-100 font-pregular"
              numberOfLines={1}
            >Posted on &nbsp;
              {new Date($createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>

        <View className="flex flex-row justify-center items-center">
      <Menu
      
        visible={visible}
        anchor={<TouchableOpacity onPress={() => showMenu()}><Image
          source={icons.menu}
          className="w-10 h-10 pl-8 py-4 -scale-50"
          resizeMode="contain"
          style={{backgroundColor:"#161622", borderColor:"#cdcde0"}}
          
        /></TouchableOpacity>}
        onRequestClose={hideMenu}
      >
        <MenuItem style={{backgroundColor:"#cdcde0"}} className="bg-primary" onPress={hideMenu}>Menu item 1</MenuItem>
        <MenuItem style={{backgroundColor:"#cdcde0"}} className="bg-primary" onPress={hideMenu}>Menu item 2</MenuItem>
        <MenuItem style={{backgroundColor:"#cdcde0"}} className="bg-primary" disabled>Disabled item</MenuItem>
        <MenuDivider color="#161622"/>
        <MenuItem style={{backgroundColor:"#cdcde0"}} className="bg-primary" onPress={hideMenu}>Menu item 4</MenuItem>
      </Menu>
    </View>
        {/* <View className="pt-2">
          <Image
            source={icons.menu}
            className="w-5 h-5"
            resizeMode="contain"
            on
          />
        </View> */}
      </View>

      {play ? (
        <Video
          source={{ uri: video }}
          className="w-full h-72 rounded-xl mt-0"
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish) {
              setPlay(false);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
          className="w-full h-60 rounded-xl mt-0 relative flex justify-center items-center"
        >
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full rounded-xl mt-3"
            resizeMode="cover"
          />

          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
      <View className="border-b border-fuchsia-50 w-full flex flex-row gap-4 justify-between items-end pb-2">
        <View className="flex flex-row gap-4">
          
        <TouchableOpacity
          onPress={() => {
            setLikedState(!likedState);
            handleVideoLike();
            setLikesCOunter(likedState ? likesCounter - 1 : likesCounter + 1);
          }}
        >
          <Image
            source={likedState ? icons.liked : icons.notliked}
            className="h-8 w-8"
          ></Image>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            Alert.alert("Share", "Share this video");
          }}
        >
          <Image
            source={icons.share}
            className="h-8 w-8"
          ></Image>
        </TouchableOpacity>
        </View>
        <View>
        <TouchableOpacity
          onPress={() => {
            Alert.alert("Bookmark", "Bookmark this video");
          }}
        >
          <Image
            source={icons.bookmarkfill}
            className="h-8 w-8"
            ></Image>
        </TouchableOpacity>
            </View>
      </View>
      <Text
        className="font-plight w-full text-sm text-[#cdcde0]"
        numberOfLines={1}
      >
        {likesCounter} {likesCounter > 1 ? "likes" : "like"}
      </Text>
      <Text
        className="font-psemibold w-full text-sm text-[#cdcde0]"
        numberOfLines={1}
      >
        {title}
      </Text>
      <Text
      // role="ScrollView"
        className="font-plight pt-1 w-full text-sm text-[#cdcde0]"
        numberOfLines={3}
        ellipsizeMode="tail"
        // selectable={true}
        onLongPress={() => copyToClipboard(prompt)}
        onPress={() => ToastAndroid.show("Long press to copy", ToastAndroid.SHORT)}
      >
        <Image source={icons.ai} className="h-6 w-6"></Image> {prompt}
      </Text>
    </View>
  );
};

export default VideoCard;
