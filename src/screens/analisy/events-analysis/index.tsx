import { useEffect, useState } from "react";
import { AppDispatch, RootState } from "@store/index";
import { useDispatch, useSelector } from "react-redux";
import {
  StyledPressable,
  StyledScrollView,
  StyledText,
  StyledView,
} from "styledComponents";
import { formatCurrency } from "react-native-format-currency";
import {
  AnalysisByMonth,
  analysisByMonthVenueAsync,
  AnalysisTotal,
  getEventTrafficNumberVenueAsync,
  getProposalTrafficNumberVenueAsync,
  Venue,
} from "@store/venue/venueSlice";
import { ProposalAnalysisByMonth } from "../proposal-analysis/proposal-analysis-by-month";
import { TrafficSourceAnalysisCOmponent } from "../traffic-source-analysis";
import { ActivityIndicator } from "react-native";
import { AntDesign, FontAwesome } from "@expo/vector-icons";

export function EventsAnalysis() {
  const dispatch = useDispatch<AppDispatch>();
  const queryParams = new URLSearchParams();
  const venue: Venue = useSelector(
    (state: RootState) => state?.venueList.venue
  );

  const analysis: {
    total: AnalysisTotal;
    approved: AnalysisTotal;
    analysisEventsByMonth: AnalysisByMonth[];
    analysisProposalByMonth: AnalysisByMonth[];
  } = useSelector((state: RootState) => state?.venueList.analysis);

  const loading = useSelector((state: RootState) => state?.venueList.loading);

  const trafficSourceList = useSelector(
    (state: RootState) => state?.venueList.eventTrafficNumbers
  );

  const [year, setYear] = useState<any>(new Date().getFullYear());
  useEffect(() => {
    queryParams.append("year", year);
    queryParams.append("approved", "true");
    queryParams.append("venueId", venue.id);

    dispatch(analysisByMonthVenueAsync(`${queryParams.toString()}`));
    dispatch(getEventTrafficNumberVenueAsync(`${queryParams.toString()}`));
  }, [year,venue.id]);

  if (loading) {
    return (
      <StyledView className="h-full bg-gray-dark w-full flex justify-center items-center">
        <ActivityIndicator size="large" color="white" />
        <StyledText className="text-white">Loading</StyledText>
      </StyledView>
    );
  }
  return (
    <StyledScrollView className="bg-gray-dark flex-1 pb-5 flex flex-col h-full w-full relative">
      <StyledView className=" flex flex-row justify-center items-center gap-x-4 py-4">
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
      <ProposalAnalysisByMonth
        list={analysis?.analysisEventsByMonth}
        receitaTotal={analysis?.approved?.total}
      />
      <StyledView className="w-full">
        <StyledView className="w-full flex flex-row justify-between items-center px-5">
          <StyledText className="text-custom-white font-semibold text-[12px] text-center pb-1 pt-2">
            {analysis?.approved.count} eventos
          </StyledText>
          <StyledText className="text-custom-white font-semibold text-[12px] text-center ">
            p/ orcamento:{" "}
            {Math.floor(analysis?.approved?.total) / analysis?.approved?.count
              ? formatCurrency({
                  amount: Number(
                    (
                      Math.floor(analysis?.approved?.total) /
                      analysis?.approved?.count
                    ).toFixed(2)
                  ),
                  code: "BRL",
                })[0]
              : 0}
          </StyledText>
        </StyledView>
        <StyledView className="w-full flex flex-row justify-between items-center px-5">
          <StyledText className="text-custom-white font-semibold text-[12px] text-center ">
            {analysis?.approved?.guestNumber / analysis?.approved.count
              ? (
                  analysis?.approved?.guestNumber / analysis?.approved.count
                ).toFixed(0)
              : 0}{" "}
            pessoas em media
          </StyledText>
          <StyledText className="text-custom-white font-semibold text-[12px] text-center ">
            p/ pessoa:{" "}
            {Math.floor(analysis?.approved?.total) /
            analysis?.approved?.guestNumber
              ? formatCurrency({
                  amount: Number(
                    (
                      Math.floor(analysis?.approved?.total) /
                      analysis?.approved?.guestNumber
                    ).toFixed(2)
                  ),

                  code: "BRL",
                })[0]
              : 0}
          </StyledText>
        </StyledView>
        <StyledText className="text-custom-white font-semibold text-[12px] text-center py-5">
          Taxa de conversao{" "}
          {analysis?.approved?.count / analysis?.total?.count
            ? Number(
                (analysis?.approved?.count / analysis?.total?.count) * 100
              ).toFixed(1)
            : 0}
          %
        </StyledText>
      </StyledView>
      <TrafficSourceAnalysisCOmponent trafficSource={trafficSourceList} />
    </StyledScrollView>
  );
}
