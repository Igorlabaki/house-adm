import { useState,useEffect } from "react";
import { useDebounce } from 'use-debounce';
import { EvilIcons } from "@expo/vector-icons";
import { TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fecthTexts } from "../../store/text/textSlice";

interface SearchFilterListProps{
  fectData: (query:string) => any
}

export default function SearchFilterListComponent({fectData}:SearchFilterListProps) {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();

  const [debouncedQuery] = useDebounce(query, 500); 
  
  useEffect(() => {
    dispatch(fectData(debouncedQuery));
  }, [debouncedQuery]);

  return (
    <View className="w-full py-3 px-2 flex justify-start items-center  rounded-md bg-white flex-row my-3">
      <EvilIcons name="search" size={24} color="black" />
      <TextInput
        onChangeText={(value) => setQuery(value)}
        value={query}
        placeholder={"Search"}
        className="text-sm text-text-gray  outline-none  flex-1"
      />
    </View>
  );
}
