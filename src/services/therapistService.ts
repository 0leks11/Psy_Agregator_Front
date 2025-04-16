import { TherapistProfileData } from "../types/user";
import api from "./api";

export const getTherapistById = async (
  id: number
): Promise<TherapistProfileData> => {
  const response = await api.get<TherapistProfileData>(`/therapists/${id}/`);
  return response.data;
};
