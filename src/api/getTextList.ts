export const getTextList = async () => {
  const response = await fetch(
    "https://art56-server-v2.vercel.app/text/getById/clpbccrsb0000uec56u6vt3hm"
  );
  const textList = await response.json();
  return textList;
};
