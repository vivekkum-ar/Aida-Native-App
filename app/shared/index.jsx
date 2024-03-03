import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { Text, View } from 'react-native'

const shared = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
  return (
    <View>
      
        <Text className="text-lg text-secondary-200 font-psemibold">shared</Text>
    </View>
  )
}

export default shared