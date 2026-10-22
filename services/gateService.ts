import api from '../lib/axios';

export interface GateInwardPayload {
  vehicle_number: string;
  driver_name: string;
  driver_mobile: string;
  transporter_name: string;
  material_type: string;
  material_type_other?: string | null;
  source_type: string;
  source_name: string;
  source_location: string;
  reference_number: string;
  challan_number: string;
  expected_quantity: number;
  expected_quantity_unit: string;
  expected_bags: number;
  remarks: string;
}

export interface GateInwardResponse {
  id: number;
  gate_token: string;
  arrival_date_time: string;
  vehicle_number: string;
  driver_name: string;
  driver_mobile: string;
  transporter_name: string;
  material_type: string;
  material_type_other: string | null;
  source_type: string;
  source_name: string;
  source_location: string;
  reference_number: string;
  challan_number: string;
  expected_quantity: string | number;
  expected_quantity_unit: string;
  expected_bags: number;
  status: string;
  remarks: string;
  created_at: string;
  created_by: number;
  created_by_name: string;
  cancellation_reason: string | null;
  cancelled_at: string | null;
}

export interface GatePassDetails {
  gate_token: string;
  mill_name: string;
  arrival_date_time: string;
  vehicle_number: string;
  driver_name: string;
  driver_mobile: string;
  transporter_name: string;
  material_type: string;
  source_type: string;
  source_name: string;
  source_location: string;
  reference_number: string;
  challan_number: string;
  expected_quantity: string | number;
  expected_quantity_unit: string;
  expected_bags: number;
  status: string;
  operator_name: string;
  barcode_data: string;
  barcode_image: string;
  next_step: string;
  instructions: string[];
}

export const gateService = {
  // 1. Create Inward Entry: POST /staff/gate_guard/inward
  createInwardEntry: async (payload: GateInwardPayload): Promise<GateInwardResponse> => {
    const response = await api.post<GateInwardResponse>('/staff/gate_guard/inward', payload);
    return response.data;
  },

  // 2. Direct PATCH update: PATCH /staff/gate_guard/inward/{id}
  updateInwardEntry: async (id: number, payload: GateInwardPayload): Promise<GateInwardResponse> => {
    const response = await api.patch<GateInwardResponse>(`/staff/gate_guard/inward/${id}`, payload);
    return response.data;
  },

  // 3. Delete Inward Entry: DELETE /staff/gate_guard/inward/delete/{id}
  deleteInwardEntry: async (id: number): Promise<{ detail: string }> => {
    try {
      const response = await api.delete<{ detail: string }>(`/staff/gate_guard/inward/delete/${id}`);
      return response.data;
    } catch (err: any) {
      // Fallback to POST if backend accepts POST for delete
      if (err.response?.status === 405) {
        const postRes = await api.post<{ detail: string }>(`/staff/gate_guard/inward/delete/${id}`);
        return postRes.data;
      }
      throw err;
    }
  },

  // 4. Fetch Driver Gate Pass with Barcode: GET /staff/gate_guard/inward/{gate_token}/gate-pass
  getGatePass: async (gate_token: string): Promise<GatePassDetails> => {
    const response = await api.get<GatePassDetails>(`/staff/gate_guard/inward/${gate_token}/gate-pass`);
    return response.data;
  },
};