import { View, Text, ScrollView, Image, Alert, Pressable } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import FormField from "../../components/formField";
import CustomButton from "../../components/CustomButton";
import { Link, router, useNavigation } from "expo-router";
import { getCurrentUser, sendResetEmail, signIn } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/globalProvider";
import CustomModal from "../../components/CustomModal";
const SignIn = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [alertData, setAlertData] = useState({ title: "", message: ""});
  const navigation = useNavigation();
  const { setUser, setIsLogged } = useGlobalContext();
  const [Form, setForm] = useState({
    email: "",
    password: "",
  });

  const submit = async () => {
    if (!Form.email || !Form.password) {
      // Alert.alert("Error", "Please fill all fields");
      setAlertData({title:"Error",message:"Please fill all fields"});
    setModalVisible(true);
      // return;
    } else {
      setIsSubmitting(true);
      try {
        const result = await signIn(Form.email, Form.password);
        const res = await getCurrentUser();
        // console.log("res",res);
        setUser(res);
        setIsLogged(true);
        router.replace("/home");
      } catch (error) {
        // Alert.alert("Error", error.message);
        setAlertData({title:"Error",message:"Invalid email or password"});
        setModalVisible(true);
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  return (
    <SafeAreaView className="bg-primary h-full">
      <CustomModal
      ModalVisibility={modalVisible}
      UpdateModalVisibility={setModalVisible}
      closeButton={true}
      AlertMessage={alertData.message}
      AlertTitle={alertData.title}
      closeButtonText="OK"
      widthFix={true}
      />
      <ScrollView className="" contentContainerStyle={{ height: "100%" }}>
        <View className="w-full  justify-center min-h-[85vh] my-auto px-6">
          <View
            className="flex flex-row items-center 
          justify-start"
          >
            <Image
              source={images.logoSmall}
              className="w-[60px] h-[44px] scale-150"
              resizeMode="contain"
            />
            <Text className="inline-flex text-3xl text-white font-psemibold pt-[16 px]">
              Aida
            </Text>
          </View>
          <Text className="text-2xl text-start text-white mt-10 font-psemibold">
            Log in to Aida
          </Text>
          <FormField
            title={"Email"}
            value={Form.email}
            handleChangeText={(e) => {
              setForm({ ...Form, email: e.nativeEvent.text });
            }}
            otherStyles={"mt-7"}
            keyBoardType={"email-address"}
          />
          <FormField
            title={"Password"}
            value={Form.password}
            handleChangeText={(e) => {
              setForm({ ...Form, password: e.nativeEvent.text });
            }}
            otherStyles={"mt-7"}
          />
          <Pressable onPress={() => navigation.navigate("reset-pass")}>
          <View className="flex flex-row justify-end px-4 py-1">
            <Text className="text-[#cdcde0] text-xs font-plight">Forgot Password ?</Text>
            <Text className="text-secondary text-xs font-pregular pl-1">Reset here</Text>
          </View>
          </Pressable>
          <CustomButton
            title={"Sign In"}
            handlePress={submit}
            containerStyles={"mt-7"}
            isLoading={isSubmitting}
          />
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Don't have an account?
            </Text>
            <Link
              href={"/sign-up"}
              className="text-lg text-secondary font-psemibold"
            >
              Sign Up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
