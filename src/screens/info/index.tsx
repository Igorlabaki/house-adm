import { StyledView } from 'styledComponents';
import { InfoNavigator } from './navigator';

export function InfoScreen() {
  return (
    <StyledView className='bg-gray-dark h-full w-full'>
      <InfoNavigator />
    </StyledView>
  );
}
