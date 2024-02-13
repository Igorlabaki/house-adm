import React from 'react'
import { Text, View } from 'react-native'
import SafeAreaViewComponent from '../../components/safeAreaView'

export  function HomeScreen() {
  return (
    <SafeAreaViewComponent>
      <Text className='bg-black text-red-900 text-whe'>Home</Text>
    </SafeAreaViewComponent>
  )
}
