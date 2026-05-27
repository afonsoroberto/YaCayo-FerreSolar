import type { Payment, StatsToday, BankDistributionItem, VolumeDataPoint } from '../types'

export const mockPayments: Payment[] = []

export const volumeData: VolumeDataPoint[] = []

export const bankDistribution: BankDistributionItem[] = []

export const statsToday: StatsToday = {
  totalValidated: 0,
  paymentsProcessed: 0,
  paymentsTotal: 0,
  pending: 0,
  banksConnected: 0,
  banksTotal: 4,
  avgTimeSeconds: 0,
  changePercent: 0,
}
