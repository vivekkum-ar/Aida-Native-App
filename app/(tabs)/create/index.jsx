import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../../components/formField";
import { ResizeMode, Video } from "expo-av";
import { icons, images } from "../../../constants";
import CustomButton from "../../../components/CustomButton";
import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";
import { createVideo } from "../../../lib/appwrite";
import { useGlobalContext } from "../../../context/globalProvider";
import CustomModal from "../../../components/CustomModal";
const CreateUpload = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [alertData, setAlertData] = useState({ title: "", message: "" });
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [Form, setForm] = useState({
    title: "",
    video: null,
    thumbnail: null,
    prompt: "",
    createdByUser: "",
  });
  useEffect(() => {
    setForm({ ...Form, createdByUser: user.$id });
  }, []);
  const submit = async () => {
    // console.log(Form)
    if (!Form.title || !Form.video || !Form.thumbnail || !Form.prompt) {
      // return Alert.alert("Error","Please fill all fields");
      setAlertData({ title: "Error", message: "Please fill all fields" });
      setModalVisible(true);
      return;
    } else {
      setUploading(true);
      try {
        await createVideo(Form);
        // Alert.alert("Success","Post created successfully");
        setAlertData({
          title: "Success",
          message: "Post created successfully",
        });
        setModalVisible(true);
        router.push("/home");
      } catch (error) {
        // Alert.alert("Error",error.message);
        setAlertData({ title: "Error", message: error.message });
        setModalVisible(true);
      } finally {
        setForm({
          title: "",
          video: null,
          thumbnail: null,
          prompt: "",
          createdByUser: "",
        });
        setUploading(false);
      }
    }
  };
  const openFilePicker = async (selectType) => {
    const result = await DocumentPicker.getDocumentAsync({
      type:
        selectType === "image"
          ? ["image/png", "image/jpg", "image/jpeg"]
          : ["video/mp4", "video/mov", "video/avi", "video/mkv", "video/gif"],
    });
    if (!result.canceled) {
      if (selectType === "image") {
        setForm({ ...Form, thumbnail: result.assets[0] });
        // console.log(Form)
      }
      if (selectType === "video") {
        setForm({ ...Form, video: result.assets[0] });
        // console.log(result)
      }
    } else if (result.canceled) {
      // Alert.alert("No Document picked","Please pick a document");
      // console.log("first");
      setAlertData({
        title: "No Document Picked",
        message: "Please pick a document",
      });
      setModalVisible(true);
      return;
    } else {
      setTimeout(() => {
        // Alert.alert("Document picked",JSON.stringify(result,null,2));
        setAlertData({
          title: "Document Picked",
          message: JSON.stringify(result, null, 2),
        });
        setModalVisible(true);
        // Alert.alert("No Document picked","Please pick a document");
      }, 100);
    }
  };

  return (
    <SafeAreaView className="h-full bg-primary">
      <CustomModal
        ModalVisibility={modalVisible}
        UpdateModalVisibility={setModalVisible}
        closeButton={true}
        AlertMessage={alertData.message}
        AlertTitle={alertData.title}
        closeButtonText="OK"
        widthFix={true}
      />
      <ScrollView className="px-4">
        {/* <Text className="text-white text-2xl font-psemibold">Upload Video</Text> */}
        <FormField
          title="Video Title"
          value={Form.title}
          placeholder="Enter video title"
          handleChangeText={(e) =>
            setForm({ ...Form, title: e.nativeEvent.text })
          }
          //   otherStyles="mt-10"
        ></FormField>
        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Upload Video
          </Text>

          <TouchableOpacity
            onPress={() => {
              openFilePicker("video");
            }}
          >
            {Form.video ? (
              <Video
                source={{ uri: Form.video.uri }}
                className="w-full h-64 rounded-2xl"
                // useNativeControls
                resizeMode={ResizeMode.COVER}
                // isLooping
              ></Video>
            ) : (
              <View className="w-full h-40 px-4 bg-black-100 rounded-2xl justify-center items-center">
                <View className="w-14 h-14 border-dashed border border-secondary-100 justify-center items-center">
                  <Image
                    className="w-12 h-12"
                    source={icons.upload}
                    resizeMode="contain"
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Upload Thumbnail
          </Text>
          <TouchableOpacity
            onPress={() => {
              openFilePicker("image");
            }}
          >
            {Form.thumbnail ? (
              <Image
                source={{ uri: Form.thumbnail.uri }}
                className="w-full h-64 rounded-2xl"
                resizeMode={ResizeMode.COVER}
              ></Image>
            ) : (
              <View className="w-full h-16 border-2 border-black-200 flex-row space-x-2 px-4 bg-black-100 rounded-2xl justify-center items-center">
                <Image
                  className="w-5 h-5"
                  source={icons.upload}
                  resizeMode="contain"
                />
                <Text className="text-sm text-gray-100 font-pmedium ">
                  Choose a file
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <FormField
          title="AI Prompt"
          value={Form.prompt}
          placeholder="Enter AI Prompt"
          handleChangeText={(e) =>
            setForm({ ...Form, prompt: e.nativeEvent.text })
          }
          otherStyles="mt-7"
        ></FormField>
        <CustomButton
          title="Submit & Pulish"
          handlePress={submit}
          containerStyles="mt-7"
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateUpload;
