import React, { useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { QuenstionModalComponent } from './components/questionModal'
import SearchFilterListComponent from '../../../../components/list/searchFilterList'
import { QuestionFlatList } from './components/list/questionFlatList'
import { fecthQuestions } from '../../../../store/question/questionSlice'

export  function QuestionScreen() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  return (
    <View className='bg-gray-dark flex-1 p-5 flex flex-col h-full w-full'>
        <Pressable className='bg-gray-dark' onPress={() => setIsModalOpen(true)}>
          <Text className='text-custom-white font-semibold'>New Question</Text>
        </Pressable>
        <QuenstionModalComponent isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} type='CREATE'/>
        <SearchFilterListComponent fectData={fecthQuestions}/>
        <QuestionFlatList />
    </View>
  )
}

