const allItems = $input.all();
const ratesNode = $("HTTP Request").first(); 
const ratesData = ratesNode.json.rates || ratesNode.json;

const rates = {
  THB: parseFloat(ratesData.THB) || 37.0,
  USD: parseFloat(ratesData.USD) || 1.1,
  JPY: parseFloat(ratesData.JPY) || 160.0,
  GBP: parseFloat(ratesData.GBP) || 0.85,
  EUR: 1,
};

const outputItems = [];

for (let i = 0; i < allItems.length; i++) {
  const data = { ...allItems[i].json };

  // แปลง String ให้เป็น Number ก่อนคำนวณ
  const salePrice = parseFloat(data.Sale_Price) || 0;
  const baseCost = parseFloat(data.Base_Cost) || 0;
  const quantity = parseFloat(data.Quantity) || 0;
  
  const rateLocal = rates[data.Currency] || 1;
  const rateCost = rates[data.Base_Currency || 'USD'] || 1;
  const rateTHB = rates.THB;

  // --- คำนวณหาค่าต่อหน่วยก่อน ---
  // สูตร: (ราคาขาย / เรทเงินนั้น) * เรท THB
  const unitSaleTHB = (salePrice / rateLocal) * rateTHB;
  const unitCostTHB = (baseCost / rateCost) * rateTHB;

  // --- คำนวณยอดรวม ---
  data.Sale_THB = Math.round((unitSaleTHB * quantity) * 100) / 100;
  data.Cost_THB = Math.round((unitCostTHB * quantity) * 100) / 100;
  data.Profit_THB = Math.round((data.Sale_THB - data.Cost_THB) * 100) / 100;

  // เพิ่ม Field ไว้เช็คค่าเฉยๆ (ลบออกได้ตอนใช้งานจริง)
  data.Debug_Unit_Sale = Math.round(unitSaleTHB * 100) / 100;

  outputItems.push({ json: data });
}

return outputItems;
