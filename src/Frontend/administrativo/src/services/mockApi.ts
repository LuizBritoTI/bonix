export interface Metric {
  label: string
  value: string
  change: string
  trend: 'up' | 'down'
}

export interface Customer {
  id: string
  name: string
  email: string
  initials: string
  tier: string
  points: number
  spent: string
  color: string
}

export async function getDashboardMetrics(): Promise<Metric[]> {
  await new Promise((resolve) => setTimeout(resolve, 220))
  return [
    { label: 'Vendas identificadas', value: 'R$ 284.650', change: '+12,8%', trend: 'up' },
    { label: 'Cashback distribuído', value: 'R$ 18.420', change: '+8,2%', trend: 'up' },
    { label: 'Clientes ativos', value: '12.840', change: '+6,4%', trend: 'up' },
    { label: 'Taxa de retorno', value: '34,6%', change: '+2,1%', trend: 'up' },
  ]
}

export const mockCustomers: Customer[] = [
  { id: '1', name: 'Ana Carolina Souza', email: 'ana.souza@email.com', initials: 'AS', tier: 'Diamante', points: 2840, spent: 'R$ 8.450', color: 'rose' },
  { id: '2', name: 'Pedro Henrique Lima', email: 'pedro.lima@email.com', initials: 'PL', tier: 'Ouro', points: 1960, spent: 'R$ 5.280', color: 'blue' },
  { id: '3', name: 'Juliana Martins Costa', email: 'ju.costa@email.com', initials: 'JC', tier: 'Prata', points: 1240, spent: 'R$ 3.120', color: 'violet' },
  { id: '4', name: 'Lucas Ferreira Alves', email: 'lucas.alves@email.com', initials: 'LA', tier: 'Ouro', points: 2180, spent: 'R$ 6.790', color: 'teal' },
  { id: '5', name: 'Mariana Oliveira', email: 'mari.oliveira@email.com', initials: 'MO', tier: 'Bronze', points: 780, spent: 'R$ 1.940', color: 'amber' },
]
