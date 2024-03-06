import { View, Text, ScrollView, Image, Alert, Pressable } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import FormField from "../../components/formField";
import CustomButton from "../../components/CustomButton";
import { Link, useNavigation } from "expo-router";
import { sendResetEmail, updatePasswordWithEmail } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/globalProvider";
import LottieView from "lottie-react-native";
const SignIn = () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const [Form, setForm] = useState({
    email: "",
    password: "",
    otp: "",
  });
  const [code, setCode] = useState("123456");
  const [submitted, setSubmitted] = useState(false);
  const navigation = useNavigation();

  const animation = useRef(null);
  useEffect(() => {
    // You can control the ref programmatically, rather than using autoPlay
    animation.current?.play(startFrame = 1, endFrame = 52);
  }, []);
  
  /* ---------------------------------------------------------------------------------------------- */
  /*                                        Send OTP to email                                       */
  /* ---------------------------------------------------------------------------------------------- */
const handleSendOtp = async () => {
  if (!Form.email) {
    Alert.alert("Error", "Please enter your email");
    return;
  } else {
    const newCode = Math.floor(100000 + Math.random() * 900000).toString(); // Generate the OTP
    setCode(newCode); // Update the state with the new OTP
    setSubmitted(true);
    setIsSubmitting(true);
    try {
      const result = await sendResetEmail(Form.email, newCode, Form.email);
      Alert.alert("Success", `Otp sent to ${result.email} successfully`);
    // console.log(Form.otp,code,newCode);
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  }
}

  /* ---------------------------------------------------------------------------------------------- */
  /*                                        Reset Password                                          */
  /* ---------------------------------------------------------------------------------------------- */
  const handleReset = async () => {
    // console.log(Form.otp,code);
    if (!Form.email || !Form.otp || !Form.password) {
      Alert.alert("Error", "Please enter your OTP and new password");
      return;
    } else if(Form.otp.toString() !== code.toString()){
      Alert.alert("Error", "Invalid OTP");
    } else{
      animation.current?.reset();
      animation.current?.play(startFrame = 52, endFrame = 112);
      setIsSubmitting(true);
      try {
        const result = await updatePasswordWithEmail(Form.email,Form.password);
        Alert.alert("Success", "Password reset successfull !", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      
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
              className="w-[60px] h-[44px] scale-150"
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
          {submitted && 
          <>
          <View className="flex relative justify-center">
          <FormField
            title={"OTP"}
            value={Form.otp}
            handleChangeText={(e) => {
              setForm({ ...Form, otp: e.nativeEvent.text.toString() });
              }}
            otherStyles={"mt-7"}
            keyBoardType={"number-pad"}
          />
          <View className="flex flex-row absolute right-0 bottom-2">
              <LottieView
                ref={animation}
                loop={false}
                style={{
                  width: 100,
                  height: 50,
                  // backgroundColor: '#eee',
                }}
                className="border border-white"
                // Find more Lottie files at https://lottiefiles.com/featured
                source={require("../../assets/LoadingChecked.json")}
              />
            </View>
            </View>
            <Pressable onPress={() => handleSendOtp()}>
          <View className="flex flex-row justify-end px-4 py-1">
            <Text className="text-[#cdcde0] text-xs font-plight">Did'nt get the OTP?</Text>
            <Text className="text-secondary text-xs font-pregular pl-1">Resend here</Text>
          </View>
          </Pressable>
            <FormField
              title={"New Password"}
              value={Form.password}
              handleChangeText={(e) => {
                setForm({ ...Form, password: e.nativeEvent.text });
              }}
              otherStyles={"mt-7"}
              keyBoardType={"password"}
            />
            </>
          }
            
          {submitted ?  
          <CustomButton
            title={"Reset Password"}
            handlePress={() => handleReset()}
            containerStyles={"mt-7"}
            isLoading={isSubmitting}
          /> 
          :
          <CustomButton
            title={"Send OTP"}
            handlePress={() => handleSendOtp()}
            containerStyles={"mt-7"}
            isLoading={isSubmitting}
          />}
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
