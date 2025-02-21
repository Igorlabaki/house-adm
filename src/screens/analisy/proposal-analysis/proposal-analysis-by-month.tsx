import { View } from "react-native";
import { StyledText, StyledView } from "styledComponents";

export interface AnalysisByMonth {
  month: string;
  count: number;
  total: number;
  guestNumber: number;
}

interface ProposalAnalysisByMonthProps{
  receitaTotal: number;
  list: AnalysisByMonth[];
}

export function ProposalAnalysisByMonth({
  list,
  receitaTotal,
}: ProposalAnalysisByMonthProps) {
  return (
    <>
      {list &&
        list?.map((month: AnalysisByMonth, index) => {
          return (
            <StyledView
              key={index}
              className="flex flex-row justify-between  items-center w-full h-[20px]"
            >
              <StyledText className="text-custom-white font-semibold text-[13px] w-[10%]  ml-1">
                {month.month.slice(0, -1)}
              </StyledText>
              <StyledView className="flex flex-row flex-1 gap-x-2 justify-start items-center ">
                {/* @ts-ignore */}
                <View
                  style={{
                    height: 17,
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    backgroundColor: "#6b7280",
                    borderRadius: 40,
                    overflow: "hidden",
                    gap: 10,
                  }}
                >
                  {/*@ts-ignore */}
                  <View style={{
                      width: `${((month.total / receitaTotal) * 100).toFixed(
                        0
                      )}%`,
                      height: 17,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "row",
                      backgroundColor: "#54a0ff",
                    }}
                  ></View>
                </View>
              </StyledView>
              {/* <StyledText className="text-custom-white font-semibold text-[12px]">
                      {`${item?.count}`}
                    </StyledText> */}
              <StyledText className="text-custom-white text-right font-semibold flex justify-end items-center  text-[12px] w-[12%] mr-1">
                {month?.total
                  ? `${((month?.total / Number(receitaTotal)) * 100).toFixed(
                      0
                    )}%`
                  : "0%"}
              </StyledText>
            </StyledView>
          );
        })}
    </>
  );
}
