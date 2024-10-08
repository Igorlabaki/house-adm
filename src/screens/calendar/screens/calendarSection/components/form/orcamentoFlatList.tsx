import { BugdetType } from "type";
import { styled } from "nativewind";
import { FlatList } from "react-native";
import React, { useCallback } from "react";
import { FieldMetaProps, FormikErrors } from "formik";

import { ListEmpty } from "@components/list/ListEmpty";
import { OrcamentoItemFlatList } from "./orcamentoItemFlatList";
import { ItemSeparatorList } from "@components/list/itemSeparatorList";

export const StyledFlatList = styled(FlatList<BugdetType>);

interface OrcamentoFlatListProps {
    orcamentos: BugdetType[];
    getFieldMeta: <Value>(name: string) => FieldMetaProps<Value>;
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => Promise<void | FormikErrors<any>>
}

export const OrcamentoFlatList = React.memo(({getFieldMeta, setFieldValue,orcamentos }:OrcamentoFlatListProps) => {

  const renderItem = useCallback(({ item }: { item: BugdetType }) => {
    return <OrcamentoItemFlatList budget={item} getFieldMeta={getFieldMeta} setFieldValue={setFieldValue}/>;
  }, []);
  
  return (
    <>
      <StyledFlatList
        data={orcamentos}
        className={`mt-4 flex-1`}
        keyExtractor={(item: BugdetType) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <ItemSeparatorList />}
        ListEmptyComponent={() => <ListEmpty dataType="orcamento" />}
        windowSize={3}
        maxToRenderPerBatch={3}
        initialNumToRender={3}
      />
    </>
  );
});
