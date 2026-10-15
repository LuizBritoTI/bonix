import { defineStore } from 'pinia'

export interface Campaign {
  id: string
  name: string
  mechanic: string
  audience: string
  redemption: string
  status: 'Ativa' | 'Agendada' | 'Rascunho' | 'Encerrada'
  color: string
  rule: string
  trigger: string
  schedule: string
}

const seed: Campaign[] = [
  { id: 'c1', name: 'Festival de Primavera', mechanic: 'Cashback 15%', audience: 'Todos os clientes', redemption: '1.284', status: 'Ativa', color: 'pink', rule: 'Compras a partir de R$ 100', trigger: 'Compra identificada', schedule: '' },
  { id: 'c2', name: 'Cliente em Dobro', mechanic: 'Pontos em dobro', audience: 'Clientes Ouro', redemption: '846', status: 'Ativa', color: 'blue', rule: 'Sem valor mínimo', trigger: 'Compra identificada', schedule: '' },
  { id: 'c3', name: 'Boas-vindas Bonix', mechanic: 'Bônus de R$ 20', audience: 'Novos clientes', redemption: '—', status: 'Agendada', color: 'teal', rule: 'Primeira compra', trigger: 'Cadastro de cliente', schedule: '2026-10-18T09:00' },
  { id: 'c4', name: 'Semana do Cliente', mechanic: 'Cashback 10%', audience: 'Clientes inativos', redemption: '—', status: 'Rascunho', color: 'violet', rule: 'Compras a partir de R$ 50', trigger: 'Compra identificada', schedule: '' },
]

function loadCampaigns(): Campaign[] {
  try {
    const saved = localStorage.getItem('bonix-campaigns')
    return saved ? JSON.parse(saved) as Campaign[] : seed
  } catch {
    return seed
  }
}

export const useCampaignStore = defineStore('campaigns', {
  state: () => ({ campaigns: loadCampaigns() }),
  actions: {
    save() {
      localStorage.setItem('bonix-campaigns', JSON.stringify(this.campaigns))
    },
    add(draft: Pick<Campaign, 'name' | 'mechanic' | 'audience' | 'rule' | 'trigger' | 'schedule'>) {
      this.campaigns.unshift({ ...draft, id: crypto.randomUUID(), redemption: '—', status: draft.schedule ? 'Agendada' : 'Rascunho', color: 'violet' })
      this.save()
    },
    update(id: string, draft: Pick<Campaign, 'name' | 'mechanic' | 'audience' | 'rule' | 'trigger' | 'schedule'>) {
      const campaign = this.campaigns.find((item) => item.id === id)
      if (campaign) {
        Object.assign(campaign, draft)
        if (campaign.status === 'Agendada' || campaign.status === 'Rascunho') {
          campaign.status = draft.schedule ? 'Agendada' : 'Rascunho'
        }
        this.save()
      }
    },
    toggle(id: string) {
      const campaign = this.campaigns.find((item) => item.id === id)
      if (campaign) {
        campaign.status = campaign.status === 'Ativa' ? 'Encerrada' : 'Ativa'
        this.save()
      }
    },
    duplicate(id: string) {
      const original = this.campaigns.find((item) => item.id === id)
      if (!original) return
      this.campaigns.unshift({ ...original, id: crypto.randomUUID(), name: `${original.name} (cópia)`, status: 'Rascunho' })
      this.save()
    },
  },
})
