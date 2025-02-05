export interface FinancialSummaryByMonth {
  total_incomes: number;
  total_outcomes: number;
  incomes_by_month: [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
  ];
  outcomes_by_month: [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
  ];
}

export interface FinancialSumaryByWeek {
  total_incomes: number;
  total_outcomes: number;
  incomes_by_week: [number, number, number, number];
  outcomes_by_week: [number, number, number, number];
}

export interface FinancialSumaryByDay {
  total_incomes: number;
  total_outcomes: number;
  incomes_by_day: [number, number, number, number, number, number, number];
  outcomes_by_day: [number, number, number, number, number, number, number];
}

export interface NewClientsByMonth {
  new_clients_by_month: [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
  ];
}

export interface NewClientsByWeek {
  new_clients_by_week: [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
  ];
}

export interface NewClientsByDay {
  new_clients_by_day: [number, number, number, number, number, number, number];
}
