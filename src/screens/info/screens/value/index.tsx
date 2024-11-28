import { useState } from 'react';

import { ValueModal } from './components/valueModal';
import { fecthValues } from '@store/value/valuesSlice';
import { ValueFlatList } from './components/list/valueFlatList';
import { StyledPressable, StyledText, StyledView } from 'styledComponents';
import { SearchFilterListComponent } from '@components/list/searchFilterList';

export  function ValueScreen() {

  const [isModalOpen, setIsModalOpen] = useState(false)
  
  return (
    <StyledView className='bg-gray-dark flex-1 p-5 flex flex-col h-full w-full'>
        <StyledPressable className='bg-gray-dark' onPress={() => setIsModalOpen(true)}>
          <StyledText className='text-custom-white font-semibold'>Novo Valor</StyledText>
        </StyledPressable>
        <ValueModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} type='CREATE'/>
        <SearchFilterListComponent fectData={fecthValues}/>
        <ValueFlatList />
    </StyledView>
  )
}