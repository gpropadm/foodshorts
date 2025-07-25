import { View, Text, Image, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import tw from 'twrnc'
import { fontStyles } from '@/styles/fonts'

interface FeedCardProps {
  id: string
  title: string
  description: string
  price: number
  originalPrice?: number
  mediaUrl: string
  mediaType: 'image' | 'video'
  vendorName: string
  rating: number
  deliveryTime: number
}

export function FeedCard({
  id,
  title,
  description,
  price,
  originalPrice,
  mediaUrl,
  mediaType,
  vendorName,
  rating,
  deliveryTime,
}: FeedCardProps) {
  return (
    <View style={tw`bg-white rounded-xl shadow-sm border border-gray-100 mb-4 overflow-hidden`}>
      {/* Media Container */}
      <View style={tw`relative`}>
        <Image
          source={{ uri: mediaUrl }}
          style={tw`w-full h-48`}
          resizeMode="cover"
        />
        
        {/* Video Play Button */}
        {mediaType === 'video' && (
          <TouchableOpacity 
            style={tw`absolute inset-0 items-center justify-center bg-black bg-opacity-30`}
          >
            <View style={tw`w-16 h-16 bg-white bg-opacity-90 rounded-full items-center justify-center`}>
              <Ionicons name="play" size={28} color="#FF6B35" />
            </View>
          </TouchableOpacity>
        )}

        {/* Discount Badge */}
        {originalPrice && originalPrice > price && (
          <View style={tw`absolute top-3 left-3 bg-red-500 px-2 py-1 rounded-md`}>
            <Text style={tw`text-white text-xs font-bold`}>
              {Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF
            </Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View style={tw`p-4`}>
        {/* Vendor Info */}
        <View style={tw`flex-row items-center mb-2`}>
          <Text style={[tw`text-sm text-gray-600 font-medium`, fontStyles.body]}>{vendorName}</Text>
          <View style={tw`flex-row items-center ml-auto`}>
            <Ionicons name="star" size={14} color="#FFB800" />
            <Text style={[tw`text-sm text-gray-600 ml-1`, fontStyles.rating]}>{rating}</Text>
            <Text style={[tw`text-sm text-gray-400 mx-1`, fontStyles.body]}>•</Text>
            <Text style={[tw`text-sm text-gray-600`, fontStyles.time]}>{deliveryTime} min</Text>
          </View>
        </View>

        {/* Title and Description */}
        <Text style={[tw`text-lg font-bold text-gray-900 mb-1`, fontStyles.title]}>{title}</Text>
        <Text style={[tw`text-gray-600 text-sm mb-3`, fontStyles.body]} numberOfLines={2}>
          {description}
        </Text>

        {/* Price and Action */}
        <View style={tw`flex-row items-center justify-between`}>
          <View style={tw`flex-row items-center`}>
            <Text style={[tw`text-xl font-bold text-gray-900`, fontStyles.price]}>
              R$ {price.toFixed(2).replace('.', ',')}
            </Text>
            {originalPrice && originalPrice > price && (
              <Text style={[tw`text-sm text-gray-400 line-through ml-2`, fontStyles.price]}>
                R$ {originalPrice.toFixed(2).replace('.', ',')}
              </Text>
            )}
          </View>

          <TouchableOpacity 
            style={tw`bg-orange-500 px-6 py-2 rounded-lg`}
          >
            <Text style={[tw`text-white font-semibold`, fontStyles.price]}>Pedir agora</Text>
          </TouchableOpacity>
        </View>

        {/* Foodcoins Info */}
        <View style={tw`flex-row items-center justify-between mt-3 pt-3 border-t border-gray-100`}>
          <View style={tw`flex-row items-center`}>
            <Image
              source={require('../../assets/icons/foodcoin_128x128.svg')}
              style={tw`w-5 h-5 mr-1`}
            />
            <Text style={[tw`text-sm text-gray-600`, fontStyles.body]}>
              Você ganha
            </Text>
            <Text style={[tw`text-sm font-bold text-orange-600 ml-1`, fontStyles.price]}>
              {Math.round(price * 5)} coins
            </Text>
          </View>
          <Text style={[tw`text-xs text-gray-500`, fontStyles.body]}>
            Use até 30% do pedido!
          </Text>
        </View>
      </View>
    </View>
  )
}