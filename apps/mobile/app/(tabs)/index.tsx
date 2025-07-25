import { View, Text, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import tw from 'twrnc'
import { FeedCard } from '@/components/FeedCard'
import { fontStyles } from '@/styles/fonts'
import { useState } from 'react'

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      {/* Header */}
      <View style={tw`px-4 py-2 border-b border-gray-100`}>
        <View style={tw`flex-row items-center justify-between mb-3`}>
          <Text style={[tw`text-2xl font-bold text-gray-900`, fontStyles.header]}>FoodShorts</Text>
          <TouchableOpacity style={tw`p-2`}>
            <Ionicons name="notifications-outline" size={24} color="#666" />
          </TouchableOpacity>
        </View>
        
        {/* Search Bar */}
        <View style={tw`flex-row items-center bg-gray-100 rounded-xl px-4 py-3`}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={[tw`flex-1 ml-3 text-base`, fontStyles.body]}
            placeholder="Buscar restaurantes ou pratos..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView style={tw`flex-1`} showsVerticalScrollIndicator={false}>
        {/* Stories dos Lojistas */}
        <View style={tw`py-4`}>
          <View style={tw`px-4 mb-3`}>
            <Text style={[tw`text-lg font-bold text-gray-900`, fontStyles.header]}>
              Lojistas Online
            </Text>
            <Text style={[tw`text-sm text-gray-600`, fontStyles.body]}>
              Recebendo pedidos agora
            </Text>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={tw`px-4`}
          >
            {[
              { id: 1, name: 'Pizza Express', isOnline: true, avatar: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=64&h=64&fit=crop&crop=face' },
              { id: 2, name: 'Burger House', isOnline: true, avatar: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=64&h=64&fit=crop&crop=face' },
              { id: 3, name: 'Sushi House', isOnline: true, avatar: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=64&h=64&fit=crop&crop=face' },
              { id: 4, name: 'Taco Bell', isOnline: false, avatar: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=64&h=64&fit=crop&crop=face' },
              { id: 5, name: 'Pasta Villa', isOnline: true, avatar: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=64&h=64&fit=crop&crop=face' },
            ].map((vendor) => (
              <TouchableOpacity 
                key={vendor.id} 
                style={tw`flex-col items-center mr-4`}
                onPress={() => {
                  // Navegar para o perfil do lojista
                  console.log(`Navegando para perfil do lojista: ${vendor.name}`)
                  // TODO: Implementar navegação: router.push(`/vendor/${vendor.id}`)
                }}
                disabled={!vendor.isOnline}
              >
                {/* Avatar com borda de status */}
                <View style={tw`relative`}>
                  <View style={[
                    tw`w-16 h-16 rounded-full p-0.5`,
                    vendor.isOnline 
                      ? tw`bg-green-500` 
                      : tw`bg-gray-400`
                  ]}>
                    <Image
                      source={{ uri: vendor.avatar }}
                      style={[
                        tw`w-full h-full rounded-full border-2 border-white`,
                        !vendor.isOnline && tw`opacity-60`
                      ]}
                      resizeMode="cover"
                    />
                  </View>
                  
                  {/* Indicador de status */}
                  <View style={[
                    tw`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white items-center justify-center`,
                    vendor.isOnline ? tw`bg-green-500` : tw`bg-gray-400`
                  ]}>
                    <View style={tw`w-2 h-2 bg-white rounded-full`} />
                  </View>
                </View>
                
                {/* Nome do lojista */}
                <Text style={[
                  tw`text-xs mt-2 text-center max-w-16`,
                  fontStyles.body,
                  vendor.isOnline ? tw`text-gray-700` : tw`text-gray-500`
                ]} numberOfLines={2}>
                  {vendor.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Feed de Cards */}
        <View style={tw`px-4 pb-6`}>
          <Text style={[tw`text-xl font-bold text-gray-900 mb-4`, fontStyles.header]}>
            Para você
          </Text>
          
          {[1, 2, 3, 4, 5].map((item) => (
            <FeedCard
              key={item}
              id={item.toString()}
              title={`Deliciosa Pizza ${item}`}
              description="Pizza artesanal com ingredientes frescos"
              price={29.90}
              originalPrice={35.90}
              mediaUrl="https://via.placeholder.com/400x300"
              mediaType="image"
              vendorName={`Pizzaria ${item}`}
              rating={4.5}
              deliveryTime={30}
            />
          ))}
        </View>
      </ScrollView>

      {/* FAB Carrinho */}
      <TouchableOpacity 
        style={tw`absolute bottom-6 right-6 w-14 h-14 bg-orange-500 rounded-full items-center justify-center shadow-lg`}
      >
        <Ionicons name="bag" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  )
}