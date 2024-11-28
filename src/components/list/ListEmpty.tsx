import { StyledText, StyledView } from 'styledComponents';
interface ListEmptyProps{
  dataType: string;
}

export  function ListEmpty({dataType}:ListEmptyProps) {
  return (
    <StyledView className='py-3 px-3 flex justify-center items-center flex-1 text-center h-full w-full'>
        <StyledText className='text-custom-gray'>No {dataType} register yet</StyledText>
    </StyledView>
  )
}
