import { useDispatch } from "react-redux";
import { useDebounce } from "use-debounce";
import { useState, useEffect } from "react";
import { EvilIcons } from "@expo/vector-icons";
import { StyledTextInput, StyledView } from "styledComponents";

interface SearchFilterListProps {
  queryName: string;
  entityId: string;
  entityName: string;
  queryParams: URLSearchParams;
  fectData: (query: string) => any;
}

export function SearchFilterListByQueryComponent({
  entityId,
  fectData,
  entityName,
  queryName,
  queryParams,
}: SearchFilterListProps) {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();

  const [debouncedQuery] = useDebounce(query, 500);

  useEffect(() => {
    queryParams.set(entityName, entityId);
    queryParams.set(queryName, query);
    dispatch(fectData(`${queryParams.toString()}`));
  }, [debouncedQuery, entityId]);

  return (
    <StyledView>
      <StyledView className="w-full py-2 px-2 flex justify-start border-[1px] border-gray-200 shadow-lg items-center  rounded-md bg-white flex-row my-3">
        <EvilIcons name="search" size={24} color="black" />
        <StyledTextInput
          onChangeText={(value) => setQuery(value)}
          value={query}
          placeholder={`Filtrar...`}
          className="text-sm text-text-gray  outline-none  flex-1 mt-[7px]"
        />
      </StyledView>
    </StyledView>
  );
}
