import axios from "axios";
import { API_KEY, BANKQR_URL, CLIENT_ID } from "./config";

const bankQRService = axios.create({
  baseURL: BANKQR_URL,
  headers: {
    "x-client-id": CLIENT_ID,
    "x-api-key": API_KEY,
    "Content-Type": "application/json",
  },
});

export const generateBankQR = async ({
  accountNo,
  accountName,
  acqId,
  addInfo,
  amount,
}) => {
  try {
    const res = await bankQRService.post("/generate", {
      accountNo,
      accountName,
      acqId,
      addInfo,
      amount,
      template: "print",
    });

    return res.data?.data?.qrDataURL;
  } catch (error) {
    console.error("Lỗi tạo QR:", error);
    throw error;
  }
};
export default bankQRService;
