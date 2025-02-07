export function transformMoneyToNumber(money:string | undefined){
    return money
        .replace("R$", "")
        .replace(/\./g, "") 
        .replace(/\./g, "") 
        .replace(",", ".") 
        .trim();
}