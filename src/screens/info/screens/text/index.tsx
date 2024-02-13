import { useState } from 'react';
import { TextModal } from './components/textModal';
import { View, Pressable, Text } from 'react-native';
import { TextFlatList } from './components/list/textFlatList';
import SearchFilterListComponent from '../../../../components/list/searchFilterList';
import { fecthTexts } from '../../../../store/text/textSlice';

export  function TextScreen() {

  const [isModalOpen, setIsModalOpen] = useState(false)
  
  return (
    <View className='bg-gray-dark flex-1 p-5 flex flex-col h-full w-full'>
        <Pressable className='bg-gray-dark' onPress={() => setIsModalOpen(true)}>
          <Text className='text-custom-white font-semibold'>New Text</Text>
        </Pressable>
        <TextModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} type='CREATE'/>
        <SearchFilterListComponent fectData={fecthTexts}/>
        <TextFlatList />
    </View>
  )
}

