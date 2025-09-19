export interface DelhiveryCostResponse {
  data: DeliveryCostData[];
}

export interface DeliveryCostData {
  charge_ROV: number;
  charge_REATTEMPT: number;
  charge_RTO: number;
  charge_MPS: number;
  charge_pickup: number;
  charge_CWH: number;
  tax_data: TaxData;
  charge_DEMUR: number;
  charge_AWB: number;
  zone: string;
  wt_rule_id: string | null;
  charge_AIR: number;
  charge_FSC: number;
  charge_LABEL: number;
  charge_COD: number;
  status: string;
  charge_PEAK: number;
  charge_POD: number;
  charge_LM: number;
  adhoc_data: Record<string, unknown>;
  charge_CCOD: number;
  gross_amount: number;
  charge_E2E: number;
  charge_DTO: number;
  charge_COVID: number;
  zonal_cl: string | null;
  charge_DL: number;
  total_amount: number;
  charge_DPH: number;
  charge_FOD: number;
  charge_DOCUMENT: number;
  charge_WOD: number;
  charge_INS: number;
  charge_FS: number;
  charge_CNC: number;
  charge_FOV: number;
  charge_QC: number;
  charged_weight: number;
}

export interface TaxData {
  swacch_bharat_tax: number;
  IGST: number;
  SGST: number;
  service_tax: number;
  krishi_kalyan_cess: number;
  CGST: number;
}
