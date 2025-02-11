export interface FinancialSummary {
  total_income: number;
  total_outcome: number;
  incomes: number[];
  outcomes: number[];
  labels: string[];
}

export interface NewClientsSummary {
  total_clients: number;
  clients_value: number[];
  labels: string[];
}
