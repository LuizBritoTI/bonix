<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  ArrowDownLeft, ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight,
  CircleDollarSign, Download, Gift, Settings2, Sparkles, X,
} from '@lucide/vue'
import { z } from 'zod'
import { useAuthStore } from '../stores/auth'
import { useCampaignStore } from '../stores/campaigns'

const route = useRoute()
const auth = useAuthStore()
const campaignStore = useCampaignStore()
const section = computed(() => String(route.meta.section ?? ''))
const configs = computed(() => section.value === 'Configurações')
const scheduled = computed(() => section.value === 'Agendamentos')
const reports = computed(() => section.value === 'Relatórios')
const month = ref(new Date(2026, 9, 1))
const daysInMonth = computed(() => new Date(month.value.getFullYear(), month.value.getMonth() + 1, 0).getDate())
const calendarCells = computed(() => [
  ...Array.from({ length: month.value.getDay() }, () => null),
  ...Array.from({ length: daysInMonth.value }, (_, index) => index + 1),
])
const monthLabel = computed(() => month.value.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }))
const monthOffset = computed(() => (month.value.getFullYear() - 2026) * 12 + month.value.getMonth() - 9)
const settings = ref([
  { title: 'Marcas', detail: 'Vai de Bônus · 1 marca ativa', icon: '✦' },
  { title: 'Lojas', detail: '12 unidades · 3 cidades', icon: '⌖' },
  { title: 'Equipe e permissões', detail: '8 usuários · 3 perfis de acesso', icon: '◎' },
  { title: 'Etiquetas de clientes', detail: 'VIP, novo cliente, alto valor + 5', icon: '◇' },
  { title: 'Parâmetros de fidelidade', detail: 'Pontos, validade e conversão', icon: '↗' },
  { title: 'Regras de cashback', detail: 'Acúmulo, resgate e limites', icon: '％' },
].map((item) => ({ ...item, detail: localStorage.getItem(`bonix-setting-${item.title}`) ?? item.detail })))
const activeSetting = ref('')
const settingValue = ref('')
const seedBonusTransactions = [
  { customer: 'Ana Carolina Souza', kind: 'Cashback concedido', date: 'Hoje, 10:24', amount: '+ R$ 32,80', positive: true },
  { customer: 'Pedro Henrique Lima', kind: 'Resgate de cashback', date: 'Hoje, 09:12', amount: '− R$ 42,50', positive: false },
  { customer: 'Juliana Martins Costa', kind: 'Bônus de aniversário', date: 'Ontem, 16:45', amount: '+ R$ 20,00', positive: true },
  { customer: 'Lucas Ferreira Alves', kind: 'Cashback concedido', date: 'Ontem, 14:08', amount: '+ R$ 18,90', positive: true },
]
type BonusTransaction = (typeof seedBonusTransactions)[number]
function loadBonusTransactions(): BonusTransaction[] {
  try {
    const saved = localStorage.getItem('bonix-bonus-transactions')
    return saved ? JSON.parse(saved) as BonusTransaction[] : seedBonusTransactions
  } catch {
    return seedBonusTransactions
  }
}
const bonusTransactions = ref(loadBonusTransactions())
const showBonusForm = ref(false)
const bonusCustomer = ref('')
const bonusAmount = ref('')
const bonusError = ref('')
const bonusSchema = z.object({
  customer: z.string().trim().min(3, 'Informe o nome do cliente.'),
  amount: z.coerce.number().positive('O valor deve ser maior que zero.').max(10000, 'O valor máximo é R$ 10.000.'),
})
const reportBars = [40, 52, 46, 61, 55, 68, 60, 77, 70, 87, 76, 96]

function moveMonth(offset: number) {
  month.value = new Date(month.value.getFullYear(), month.value.getMonth() + offset, 1)
}

function eventsForDay(day: number) {
  return campaignStore.campaigns.filter((campaign) => {
    if (campaign.status !== 'Agendada' || !campaign.schedule) return false
    const scheduleDate = new Date(campaign.schedule)
    return scheduleDate.getFullYear() === month.value.getFullYear()
      && scheduleDate.getMonth() === month.value.getMonth()
      && scheduleDate.getDate() === day
  })
}

function grantBonus() {
  const result = bonusSchema.safeParse({ customer: bonusCustomer.value, amount: bonusAmount.value })
  if (!result.success) {
    bonusError.value = result.error.issues[0]?.message ?? 'Revise os dados informados.'
    return
  }
  bonusTransactions.value.unshift({
    customer: result.data.customer,
    kind: 'Bônus concedido',
    date: 'Agora',
    amount: `+ ${result.data.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`,
    positive: true,
  })
  localStorage.setItem('bonix-bonus-transactions', JSON.stringify(bonusTransactions.value))
  bonusCustomer.value = ''
  bonusAmount.value = ''
  bonusError.value = ''
  showBonusForm.value = false
}

function openSetting(item: (typeof settings.value)[number]) {
  activeSetting.value = item.title
  settingValue.value = localStorage.getItem(`bonix-setting-${item.title}`) ?? item.detail
}

function saveSetting() {
  const setting = settings.value.find((item) => item.title === activeSetting.value)
  if (!setting || !settingValue.value.trim()) return
  setting.detail = settingValue.value.trim()
  localStorage.setItem(`bonix-setting-${setting.title}`, setting.detail)
  activeSetting.value = ''
}
</script>

<template>
  <section class="view-heading"><div><div class="eyebrow"><span class="eyebrow-dot" /> {{ configs ? 'SUA OPERAÇÃO, DO SEU JEITO' : scheduled ? 'NO TEMPO CERTO' : reports ? 'INTELIGÊNCIA PARA CRESCER' : 'VALOR QUE VOLTA' }}</div><h1>{{ section }}</h1><p>{{ configs ? 'Gerencie marcas, lojas, equipes e as regras da sua operação.' : scheduled ? 'Organize as próximas experiências para seus clientes.' : reports ? 'Entenda o impacto das campanhas e descubra novas oportunidades.' : 'Acompanhe saldos, concessões e toda a movimentação de bônus.' }}</p></div><button v-if="!configs && !scheduled && !reports" class="secondary-button"><Download :size="16" /> Exportar</button><button v-if="section === 'Bônus e cashback' && auth.hasPermission('cashback:manage')" class="primary-button" @click="showBonusForm = true"><Gift :size="16" /> Conceder bônus</button></section>

  <div class="feature-stat-grid"><article><span>{{ scheduled ? 'Próximos 7 dias' : reports ? 'Receita identificada' : configs ? 'Marcas ativas' : 'Saldo disponível' }}</span><strong>{{ scheduled ? '03' : reports ? 'R$ 284.650' : configs ? '01' : 'R$ 42.860,50' }}</strong><small>{{ scheduled ? 'campanhas programadas' : reports ? '↑ 12,8% este mês' : configs ? 'Vai de Bônus' : 'em bônus de clientes' }}</small></article><article><span>{{ scheduled ? 'Campanhas ativas' : reports ? 'Retorno sobre incentivo' : configs ? 'Lojas conectadas' : 'Concedido este mês' }}</span><strong>{{ scheduled ? '08' : reports ? '4,8×' : configs ? '12' : 'R$ 18.420,00' }}</strong><small>{{ scheduled ? 'em 12 lojas' : reports ? 'a cada R$ 1 investido' : configs ? 'em 3 cidades' : '↑ 8,2% vs. mês anterior' }}</small></article><article><span>{{ scheduled ? 'Próximo agendamento' : reports ? 'Conversão de resgates' : configs ? 'Usuários da equipe' : 'Resgates hoje' }}</span><strong>{{ scheduled ? '18 out' : reports ? '68,4%' : configs ? '08' : '86' }}</strong><small>{{ scheduled ? 'Festival de Primavera' : reports ? '↑ 4,2 p.p. no período' : configs ? '3 perfis de acesso' : 'R$ 3.280,00 utilizados' }}</small></article></div>

  <section v-if="scheduled" class="panel calendar-panel">
    <div class="panel-heading"><div><div class="section-overline">CALENDÁRIO PROMOCIONAL</div><h2>Campanhas agendadas</h2></div><div class="calendar-controls"><button aria-label="Mês anterior" @click="moveMonth(-1)"><ChevronLeft :size="16" /></button><strong>{{ monthLabel }}</strong><button aria-label="Próximo mês" @click="moveMonth(1)"><ChevronRight :size="16" /></button></div></div>
    <div class="calendar-grid calendar-weekdays"><span v-for="day in ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']" :key="day">{{ day }}</span></div>
    <div class="calendar-grid"><div v-for="(day, index) in calendarCells" :key="`${monthLabel}-${index}`" class="calendar-day" :class="{ 'calendar-day-empty': day === null, 'calendar-today': day === 15 && monthOffset === 0 }"><template v-if="day"><span>{{ day }}</span><div v-for="campaign in eventsForDay(day)" :key="campaign.id" class="calendar-event" :class="`event-${campaign.color}`">{{ campaign.name }}</div></template></div></div>
    <div class="calendar-legend"><span><i class="event-pink" /> Cashback</span><span><i class="event-blue" /> Pontos em dobro</span><span><i class="event-teal" /> Boas-vindas</span><RouterLink to="/campanhas" class="text-link">Gerenciar campanhas <ArrowRight :size="14" /></RouterLink></div>
  </section>

  <template v-else-if="configs">
    <section class="settings-grid"><article v-for="item in settings" :key="item.title" class="panel settings-card"><div class="settings-icon">{{ item.icon }}</div><div><h2>{{ item.title }}</h2><p>{{ item.detail }}</p></div><button :aria-label="`Editar ${item.title}`" @click="openSetting(item)"><ChevronRight :size="17" /></button></article></section>
    <div class="settings-notice"><Sparkles :size="15" /> Os dados são demonstrativos. As configurações ainda não são enviadas a uma API.</div>
    <div v-if="activeSetting" class="modal-backdrop" @click.self="activeSetting = ''"><form class="modal-card" @submit.prevent="saveSetting"><button class="modal-close" type="button" aria-label="Fechar" @click="activeSetting = ''"><X :size="18" /></button><div class="section-overline">CONFIGURAÇÃO DEMONSTRATIVA</div><h2>{{ activeSetting }}</h2><p>Atualize esta referência local. Ela não altera a operação real.</p><label for="setting-value">Descrição e parâmetros</label><input id="setting-value" v-model="settingValue" maxlength="120" /><div class="modal-actions"><button type="button" class="secondary-button" @click="activeSetting = ''">Cancelar</button><button type="submit" class="primary-button"><Settings2 :size="15" /> Salvar</button></div></form></div>
  </template>

  <template v-else-if="reports">
    <section class="dashboard-grid reports-grid"><article class="panel report-chart-panel"><div class="panel-heading"><div><div class="section-overline">RESULTADOS</div><h2>Retorno das campanhas</h2></div><button class="select-button">Últimos 12 meses <ChevronRight :size="14" /></button></div><div class="report-total">R$ 4,80 <span>retornados para cada R$ 1 investido</span></div><div class="report-bars"><div v-for="(bar, index) in reportBars" :key="index" class="report-bar-column"><span :style="{ height: `${bar}%` }" /><small>{{ ['Nov', 'Dez', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out'][index] }}</small></div></div></article><article class="panel"><div class="section-overline">DESTAQUES DO PERÍODO</div><h2 class="report-card-title">Seus clientes estão voltando</h2><div class="report-highlight"><span>Clientes que retornaram</span><strong>34,6% <small>↑ 2,1%</small></strong></div><div class="report-highlight"><span>Ticket médio identificado</span><strong>R$ 186,40 <small>↑ 8,4%</small></strong></div><div class="report-highlight"><span>Campanha com maior retorno</span><strong class="campaign-name-report">Cliente em Dobro</strong></div></article></section>
    <section class="panel report-segments"><div class="panel-heading"><div><div class="section-overline">ENGAJAMENTO</div><h2>Desempenho por segmento</h2></div><span class="report-period">Outubro 2026</span></div><div v-for="(item, index) in [{ name: 'Clientes Diamante', value: '82%', width: '82%' }, { name: 'Clientes Ouro', value: '68%', width: '68%' }, { name: 'Clientes Prata', value: '51%', width: '51%' }, { name: 'Novos clientes', value: '39%', width: '39%' }]" :key="item.name" class="segment-row"><span>{{ item.name }}</span><div class="segment-track"><i :style="{ width: item.width }" :class="`segment-${index}`" /></div><strong>{{ item.value }}</strong></div></section>
  </template>

  <template v-else>
    <section class="panel bonus-table-panel"><div class="panel-heading"><div><div class="section-overline">MOVIMENTAÇÕES RECENTES</div><h2>Últimas transações</h2></div><button class="select-button">Todas as movimentações <ChevronRight :size="14" /></button></div><div class="bonus-table"><div v-for="transaction in bonusTransactions" :key="`${transaction.customer}-${transaction.kind}-${transaction.date}`" class="bonus-row"><div class="bonus-icon" :class="{ 'bonus-out': !transaction.positive }"><ArrowUpRight v-if="transaction.positive" :size="17" /><ArrowDownLeft v-else :size="17" /></div><div class="bonus-customer"><strong>{{ transaction.customer }}</strong><span>{{ transaction.kind }}</span></div><time>{{ transaction.date }}</time><strong class="bonus-amount" :class="{ 'amount-negative': !transaction.positive }">{{ transaction.amount }}</strong></div></div></section>
    <section class="panel feature-panel feature-next-step"><div class="feature-panel-icon"><Gift :size="23" /></div><div class="section-overline">MAIS VALOR, A CADA VISITA</div><h2>Cada bônus é uma oportunidade de reconexão.</h2><p>Veja o histórico de movimentações e acompanhe como os incentivos geram novas visitas.</p><span class="feature-coming"><CircleDollarSign :size="14" /> Visão demonstrativa · sem movimentações reais</span></section>
  </template>
  <div v-if="showBonusForm" class="modal-backdrop" @click.self="showBonusForm = false"><form class="modal-card" @submit.prevent="grantBonus"><button class="modal-close" type="button" aria-label="Fechar" @click="showBonusForm = false"><X :size="18" /></button><div class="section-overline">RECONHEÇA QUEM ESCOLHE VOCÊ</div><h2>Conceder bônus</h2><p>Esta concessão será registrada apenas nesta demonstração local.</p><label for="bonus-customer">Nome do cliente</label><input id="bonus-customer" v-model="bonusCustomer" maxlength="80" placeholder="Ex.: Ana Carolina Souza" /><label for="bonus-amount">Valor do bônus (R$)</label><input id="bonus-amount" v-model="bonusAmount" type="number" min="0.01" max="10000" step="0.01" placeholder="25,00" /><p v-if="bonusError" class="form-error">{{ bonusError }}</p><div class="modal-actions"><button type="button" class="secondary-button" @click="showBonusForm = false">Cancelar</button><button type="submit" class="primary-button"><Gift :size="15" /> Conceder bônus</button></div></form></div>
</template>
