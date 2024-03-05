import { View, Text, ScrollView, Image, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import FormField from "../../components/formField";
import CustomButton from "../../components/CustomButton";
import { Link, router } from "expo-router";
import { getCurrentUser, sendResetEmail, signIn } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/globalProvider";
const SignIn = () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const [Form, setForm] = useState({
    email: "",
    password: "",
  });
  const [otpCode, setOtpCode] = useState("");

  const handleReset = async () => {
    var code = Math.floor(100000 + Math.random() * 900000).toString()
    setOtpCode(code);
    console.log(otpCode);
    if (!Form.email) {
      Alert.alert("Error", "Please enter your email");
      return;
    } else {
      setIsSubmitting(true);
      try {
        const result = await sendResetEmail(Form.email, code, Form.email);
        Alert.alert("sent", "message");
      } catch (error) {
        Alert.alert("Error", error.message);
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  const [isSubmitting, setIsSubmitting] = useState(false);
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="" contentContainerStyle={{ height: "100%" }}>
        <View className="w-full  justify-center min-h-[85vh] my-auto px-6">
          <View
            className="flex flex-row items-center 
          justify-start"
          >
            <Image
              source={images.logoSmall}
              className="w-[60px] h-[44px]"
              resizeMode="contain"
            />
            <Text className="inline-flex text-3xl text-white font-psemibold pt-[16 px]">
              Aida
            </Text>
          </View>
          <Text className="text-2xl text-start text-white mt-10 font-psemibold">
            Reset Password
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
          <CustomButton
            title={"Reset Password"}
            handlePress={() => handleReset()}
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
