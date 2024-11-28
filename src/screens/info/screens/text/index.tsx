import { useState } from 'react';

import { TextModal } from './components/textModal';
import { fecthTexts } from '@store/text/textSlice';
import { TextFlatList } from './components/list/textFlatList';
import { StyledPressable, StyledText, StyledView } from 'styledComponents';
import { SearchFilterListComponent } from '@components/list/searchFilterList';

export  function TextScreen() {

  const [isModalOpen, setIsModalOpen] = useState(false)
  
  return (
    <StyledView className='bg-gray-dark flex-1 p-5 flex flex-col h-full w-full'>
        <StyledPressable className='bg-gray-dark' onPress={() => setIsModalOpen(true)}>
          <StyledText className='text-custom-white font-semibold'>Novo Texto</StyledText>
        </StyledPressable>
        <TextModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} type='CREATE'/>
        <SearchFilterListComponent fectData={fecthTexts}/>
        <TextFlatList />
    </StyledView>
  )
}

