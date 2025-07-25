import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import tw from 'twrnc'

export default function ProfileScreen() {
  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <View style={tw`flex-1 items-center justify-center`}>
        <Text style={tw`text-xl text-gray-600`}>Perfil</Text>
      </View>
    </SafeAreaView>
  )
}