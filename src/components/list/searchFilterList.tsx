import { useDispatch } from "react-redux";
import { useDebounce } from 'use-debounce';
import { useState,useEffect } from "react";

import { EvilIcons, FontAwesome } from "@expo/vector-icons";
import { StyledTextInput, StyledView } from "styledComponents";
interface SearchFilterListProps{
  fectData: (query: string) => any
}

export function SearchFilterListComponent({fectData}:SearchFilterListProps) {
  const [query, setQuery] = useState(" ");
  const dispatch = useDispatch();

  const [debouncedQuery] = useDebounce(query, 500);
  
  useEffect(() => {
    dispatch(fectData(query));
  }, [debouncedQuery]);

  return (
    <StyledView>
      <StyledView className="w-full py-3 px-2 flex justify-start items-center  rounded-md bg-white flex-row my-3">
        <EvilIcons name="search" size={24} color="black" />
        <StyledTextInput
          onChangeText={(value) => setQuery(value)}
          value={query}
          placeholder={"Search"}
          className="text-sm text-text-gray  outline-none  flex-1"
        />
      </StyledView>
    </StyledView>
  );
}
