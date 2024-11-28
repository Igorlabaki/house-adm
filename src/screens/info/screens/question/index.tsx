import { useState } from 'react'

import { fecthQuestions } from '@store/question/questionSlice'
import { QuenstionModalComponent } from './components/questionModal'
import { QuestionFlatList } from './components/list/questionFlatList'
import { StyledPressable, StyledText, StyledView } from 'styledComponents'
import { SearchFilterListComponent } from '@components/list/searchFilterList'

export  function QuestionScreen() {

  const [isModalOpen, setIsModalOpen] = useState(false)
  
  return (
    <StyledView className='bg-gray-dark flex-1 p-5 flex flex-col h-full w-full'>
        <StyledPressable className='bg-gray-dark' onPress={() => setIsModalOpen(true)}>
          <StyledText className='text-custom-white font-semibold'>Nova Pergunta</StyledText>
        </StyledPressable>
        <QuenstionModalComponent isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} type='CREATE'/>
        <SearchFilterListComponent fectData={fecthQuestions}/>
        <QuestionFlatList />
    </StyledView>
  )
}

