import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Page() {
  
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-3xl">AIDA</Text>
      <Text>This is the first page of your app.</Text>
      <Link
        href={"/profile"}
        className="text-black font-pblack bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
      >
        Profile
      </Link>
    </View>
  );
}
