import { Text, View } from 'react-native'

interface ListEmptyProps{
    dataType: string;
}

export  function ListEmpty({dataType}:ListEmptyProps) {
  return (
    <View className='py-3 px-3 flex justify-center items-center flex-1 text-center h-full w-full mt-10'>
        <Text className='text-custom-gray'>No {dataType} register yet</Text>
    </View>
  )
}
