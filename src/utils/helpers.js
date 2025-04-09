// src/utils/helpers.js
import { format, parseISO, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfYear, endOfYear, eachMonthOfInterval, getMonth, getYear, isWithinInterval } from 'date-fns';

// --- Formatting ---
export const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    return format(parseISO(dateString), 'MMM d, yyyy');
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return dateString; // Return original if parsing fails
  }
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD', // TODO: Make this configurable later
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatMonthYear = (date) => {
    return format(date, 'MMM yyyy');
}

// --- Calculations ---
export const calculateTotalIncome = (transactions) => {
  return transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
};

export const calculateTotalExpenses = (transactions) => {
  return transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
};

export const calculateNetProfit = (transactions) => {
  return calculateTotalIncome(transactions) - calculateTotalExpenses(transactions);
};

export const calculateBalance = (transactions) => {
    // Could be the same as Net Profit if starting from 0,
    // or could incorporate a starting balance later.
    return calculateNetProfit(transactions);
}

// --- Data Aggregation ---

// Helper to get transactions within a date range
const getTransactionsInInterval = (transactions, interval) => {
  return transactions.filter(t => {
    try {
      return isWithinInterval(parseISO(t.date), interval);
    } catch {
      return false; // Ignore invalid dates
    }
  });
};

// Generate summary data for a given period type and date range
export const generateSummaryData = (transactions, periodType = 'monthly', year) => {
    const targetYear = year || getYear(new Date());
    const yearStart = startOfYear(new Date(targetYear, 0, 1));
    const yearEnd = endOfYear(new Date(targetYear, 11, 31));

    let periods = [];
    if (periodType === 'monthly') {
        periods = eachMonthOfInterval({ start: yearStart, end: yearEnd }).map(monthStart => ({
            label: formatMonthYear(monthStart),
            interval: { start: startOfMonth(monthStart), end: endOfMonth(monthStart) }
        }));
    } else if (periodType === 'quarterly') {
        // Generate 4 quarters
        for (let i = 0; i < 4; i++) {
            const quarterStartMonth = i * 3;
            const dateInQuarter = new Date(targetYear, quarterStartMonth, 1);
            const start = startOfQuarter(dateInQuarter);
            const end = endOfQuarter(dateInQuarter);
            periods.push({
                label: `Q${i + 1} ${targetYear}`,
                interval: { start, end }
            });
        }
    } else { // Yearly (just one period)
         periods.push({
             label: `${targetYear}`,
             interval: { start: yearStart, end: yearEnd }
         });
    }


    return periods.map(period => {
        const periodTransactions = getTransactionsInInterval(transactions, period.interval);
        const income = calculateTotalIncome(periodTransactions);
        const expenses = calculateTotalExpenses(periodTransactions);
        const net = income - expenses;

        // Calculate expense breakdown for the period
        const expenseBreakdown = periodTransactions
            .filter(t => t.type === 'expense')
            .reduce((acc, t) => {
                acc[t.category] = (acc[t.category] || 0) + parseFloat(t.amount || 0);
                return acc;
            }, {});

        return {
            periodLabel: period.label,
            income,
            expenses,
            net,
            expenseBreakdown // Store breakdown per period
        };
    });
};


export const getExpenseCategoryBreakdown = (transactions) => {
    return transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
            const category = t.category || 'Uncategorized';
            acc[category] = (acc[category] || 0) + parseFloat(t.amount || 0);
            return acc;
        }, {});
};

export const getIncomeExpenseDataForChart = (summaryData) => {
    const labels = summaryData.map(d => d.periodLabel);
    const incomeData = summaryData.map(d => d.income);
    const expenseData = summaryData.map(d => d.expenses);
    return { labels, incomeData, expenseData };
};