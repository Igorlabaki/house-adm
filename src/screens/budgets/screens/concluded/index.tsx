import { StyledView } from 'styledComponents'
import OrcamentoAprovadoFilter from '@components/list/OrcamentoAprovadoFilter'
import { OrcamentoAprovadoFlatList } from '../pending/components/list/orcamentoAprovadoFlatList'
import { OrcamentoAprovadoFlatListt } from '../pending/components/list/orcamentoAprovadoFlatListt'

export  function Concludedcreen() {
  return (
    <StyledView className="bg-gray-dark flex-1 p-5 flex flex-col h-full w-full">
      <OrcamentoAprovadoFilter />
      <OrcamentoAprovadoFlatListt />
    </StyledView>
  )
}

