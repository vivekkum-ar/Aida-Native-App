import { Link } from "expo-router";
import { Text, View } from "react-native";
export default function Page() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-3xl">AIDA</Text>
      <Text>This is the first page of your app.</Text>
      <Link href={"/profile"} className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Profile</Link>
    </View>
  );
}
