import { useState } from 'react';

import { View, Pressable, Text } from 'react-native';

import SearchFilterListComponent from '../../../../components/list/searchFilterList';

import { ValueModal } from './components/valueModal';
import { ValueFlatList } from './components/list/valueFlatList';
import { fecthValues } from '../../../../store/value/valuesSlice';

export  function ValueScreen() {

  const [isModalOpen, setIsModalOpen] = useState(false)
  
  return (
    <View className='bg-gray-dark flex-1 p-5 flex flex-col h-full w-full'>
        <Pressable className='bg-gray-dark' onPress={() => setIsModalOpen(true)}>
          <Text className='text-custom-white font-semibold'>New Value</Text>
        </Pressable>
        <ValueModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} type='CREATE'/>
        <SearchFilterListComponent fectData={fecthValues}/>
        <ValueFlatList />
    </View>
  )
}