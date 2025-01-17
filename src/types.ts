// src/types.ts

export interface ChartDataset {
  label: string
  data: number[]
  backgroundColor?: string
  borderColor?: string
  borderWidth?: number
}

export interface ChartData {
  labels: string[]
  datasets: ChartDataset[]
}

export interface Properties {
  names: string
  address: string
  id: string
  district: string
}
export interface UsageInfo {
  RENT_DT: string
  RENT_HR: string
  RENT_ID: number
  RENT_NM: string
  RENT_TYPE: string
  GENDER_CD: string
  USE_CNT: string
  EXER_AMT: string
  CARBON_AMT: string
  MOVE_METER: string
  MOVE_TIME: string
  START_INDEX: string
  END_INDEX: string
  RNUM: string
}
