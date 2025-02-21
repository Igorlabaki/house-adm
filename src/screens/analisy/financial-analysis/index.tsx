import React, { useEffect, useState } from "react";
import { AppDispatch, RootState } from "@store/index";
import { useDispatch, useSelector } from "react-redux";
import {
  analysisByMonthVenueAsync,
  AnalysisTotal,
  Venue,
} from "@store/venue/venueSlice";
import { formatCurrency } from "react-native-format-currency";
import {
  StyledPressable,
  StyledScrollView,
  StyledText,
  StyledView,
} from "styledComponents";
import { getAnalysisExpenseAsync } from "@store/expense/expenseSlice";
import { AntDesign } from "@expo/vector-icons";
import ExpenseChartComponent from "./expense-chart";

export default function FinancialAnalysisComponent() {
  const analysis: {
    total: AnalysisTotal;
    approved: AnalysisTotal;
  } = useSelector((state: RootState) => state?.venueList.analysis);

  const expenseAnalysis = useSelector(
    (state: RootState) => state?.expenseList.analysis
  );
  const dispatch = useDispatch<AppDispatch>();
  const queryParams = new URLSearchParams();
  const venue: Venue = useSelector(
    (state: RootState) => state?.venueList.venue
  );
  const [year, setYear] = useState<any>(new Date().getFullYear());

  useEffect(() => {
    queryParams.append("year", year);
    queryParams.append("venueId", venue.id);

    dispatch(analysisByMonthVenueAsync(`${queryParams.toString()}`));
    dispatch(getAnalysisExpenseAsync(`${queryParams.toString()}`));
  }, [year, venue.id]);

  return (
    <StyledScrollView className="bg-gray-dark flex-1 pb-16 flex flex-col h-full w-full relative">
      <StyledView className=" flex flex-row justify-center items-center gap-x-4 pt-4">
        <StyledPressable onPress={() => setYear((year) => year - 1)}>
          <AntDesign name="left" size={10} color="white" />
        </StyledPressable>
        <StyledText className="text-lg text-white  text-center">
          {year}
        </StyledText>
        <StyledPressable
          className="text-lg text-white  text-center"
          onPress={() => setYear((year) => year + 1)}
        >
          <AntDesign name="right" size={10} color="white" />
        </StyledPressable>
      </StyledView>
      <ExpenseChartComponent expenseAnalise={expenseAnalysis} />
      <StyledView className=" pb-10">
        <StyledView className="flex w-full justify-between flex-row px-5">
          <StyledText className="text-custom-white font-semibold text-[12px] text-center ">
            {`Receita Bruta : ${
              formatCurrency({
                amount: Number(analysis?.approved?.total?.toFixed(2)),
                code: "BRL",
              })[0]
            }`}
          </StyledText>
          <StyledText className="text-custom-white font-semibold text-[12px] text-center ">
            {`Despesa anual : ${
              formatCurrency({
                amount: Number((expenseAnalysis?.total?.annual + expenseAnalysis?.total?.esporadic).toFixed(2)),
                code: "BRL",
              })[0]
            }`}
          </StyledText>
        </StyledView>
        <StyledText className="text-custom-white font-semibold text-[12px] text-center pt-3">
          {`Receita liquida : ${
            formatCurrency({
              amount: Number(
                (
                  analysis?.approved.total - (expenseAnalysis?.total?.annual + expenseAnalysis?.total?.esporadic)
                )?.toFixed(2)
              ),
              code: "BRL",
            })[0]
          }`}
        </StyledText>
      </StyledView>
    </StyledScrollView>
  );
}
