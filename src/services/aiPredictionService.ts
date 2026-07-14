export interface PredictionRequest {
  score: string;
  blocks: any[];
  universities: any[];
  majors: any[];
}

export interface PredictionResult {
  universities: {
    name: string;
    majors: {
      name: string;
      predicted_benchmark: number;
      chance: string;
      probability: number;
      advice: string;
    }[];
  }[];
  overall_advice: string;
}

export const aiPredictionService = async (request: PredictionRequest): Promise<PredictionResult> => {
  // Tạm thời tắt tính năng này để nghiên cứu sau
  // Giả lập thời gian chờ 10 giây
  await new Promise(resolve => setTimeout(resolve, 10000));
  
  // Ném ra lỗi hệ thống quá tải
  throw new Error("Hệ thống hiện đang quá tải do số lượng yêu cầu phân tích quá lớn. Vui lòng thử lại sau ít phút.");
};
