import { StyledText } from 'styledComponents'

import SafeAreaViewComponent from '@components/safeAreaView'

export  function HomeScreen() {
  return (
    <SafeAreaViewComponent>
      <StyledText className='bg-black text-red-900 text-whe'>Home</StyledText>
    </SafeAreaViewComponent>
  )
}
