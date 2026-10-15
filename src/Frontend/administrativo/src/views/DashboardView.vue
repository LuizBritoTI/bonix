<script setup lang="ts">
import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, CalendarDays, ChevronDown,
  CircleDollarSign, Gift, ShoppingBag, Sparkles, Users,
} from '@lucide/vue'
import { getDashboardMetrics } from '../services/mockApi'

const { data: metrics, isLoading } = useQuery({ queryKey: ['dashboard-metrics'], queryFn: getDashboardMetrics })
const chart = [25, 32, 29, 45, 38, 50, 44, 56, 48, 64, 53, 69, 58, 77, 65, 82, 72, 89, 78, 95, 84, 100, 89, 96]
const activities = [
  { icon: Users, title: 'Novo cliente cadastrado', detail: 'Ana Carolina Souza · Loja Jardins', time: 'há 8 min', color: 'purple' },
  { icon: CircleDollarSign, title: 'Cashback resgatado', detail: 'R$ 42,50 · Pedro Henrique Lima', time: 'há 24 min', color: 'green' },
  { icon: ShoppingBag, title: 'Compra identificada', detail: 'R$ 368,90 · Unidade Pinheiros', time: 'há 51 min', color: 'blue' },
]
const max = computed(() => Math.max(...chart))
</script>

<template>
  <section class="welcome-row">
    <div><div class="eyebrow"><span class="eyebrow-dot" /> QUINTA-FEIRA, 15 DE OUTUBRO</div><h1>Bom dia, Marina <span>✦</span></h1><p>Veja como está a relação com seus clientes hoje.</p></div>
    <button class="date-button"><CalendarDays :size="16" /> Últimos 30 dias <ChevronDown :size="15" /></button>
  </section>

  <section class="metric-grid" aria-label="Indicadores">
    <article v-for="(metric, index) in metrics" :key="metric.label" class="metric-card">
      <div class="metric-card-top"><span>{{ metric.label }}</span><div class="metric-icon" :class="`metric-icon-${index}`"><component :is="[ShoppingBag, CircleDollarSign, Users, Sparkles][index]" :size="17" /></div></div>
      <div v-if="isLoading" class="metric-skeleton" />
      <template v-else><div class="metric-value">{{ metric.value }}</div><div class="metric-change"><span class="change-positive"><ArrowUpRight v-if="metric.trend === 'up'" :size="14" /><ArrowDownRight v-else :size="14" /> {{ metric.change }}</span><span>vs. mês anterior</span></div></template>
    </article>
  </section>

  <section class="dashboard-grid">
    <article class="panel chart-panel">
      <div class="panel-heading"><div><div class="section-overline">PERFORMANCE</div><h2>Vendas identificadas</h2></div><button class="select-button">Este mês <ChevronDown :size="14" /></button></div>
      <div class="chart-summary"><strong>R$ 284.650</strong><span class="change-positive"><ArrowUpRight :size="15" /> 12,8%</span><span class="chart-summary-copy">em relação ao mês passado</span></div>
      <div class="chart" aria-label="Gráfico de vendas crescentes">
        <div class="chart-gridlines"><span>R$ 20 mil</span><span>R$ 15 mil</span><span>R$ 10 mil</span><span>R$ 5 mil</span></div>
        <div class="chart-bars"><div v-for="(bar, index) in chart" :key="index" class="chart-bar-wrap"><div class="chart-bar" :class="{ 'chart-bar-highlight': index === chart.length - 2 }" :style="{ height: `${(bar / max) * 100}%` }" /></div></div>
      </div>
      <div class="chart-labels"><span>01 out</span><span>05 out</span><span>10 out</span><span>15 out</span><span>20 out</span><span>25 out</span><span>30 out</span></div>
    </article>
    <article class="panel campaign-panel">
      <div class="panel-heading"><div><div class="section-overline">EM DESTAQUE</div><h2>Campanhas ativas</h2></div><RouterLink to="/campanhas" class="text-link">Ver todas <ArrowRight :size="14" /></RouterLink></div>
      <div class="campaign-highlight"><div class="campaign-art"><Gift :size="22" /></div><div class="campaign-highlight-copy"><span class="status-pill status-active"><i /> Ativa</span><strong>Festival de Primavera</strong><span>Cashback de 15% em compras</span></div><button class="more-button" aria-label="Mais opções">···</button></div>
      <div class="campaign-stats"><div><span>Participantes</span><strong>1.284 <small>clientes</small></strong></div><div><span>Cashback gerado</span><strong>R$ 8.420</strong></div></div>
      <div class="campaign-progress-title"><span>Meta mensal</span><strong>72%</strong></div><div class="progress-track"><span /></div>
      <div class="campaign-mini-list"><div><span class="mini-color blue" /> Cliente em Dobro <span class="mini-status">Ativa</span></div><div><span class="mini-color teal" /> Boas-vindas Bonix <span class="mini-status scheduled">Agendada</span></div></div>
    </article>
  </section>

  <section class="panel activity-panel">
    <div class="panel-heading"><div><div class="section-overline">ACOMPANHAMENTO</div><h2>Atividade recente</h2></div><button class="text-link">Ver atividades <ArrowRight :size="14" /></button></div>
    <div class="activity-list"><div v-for="activity in activities" :key="activity.title" class="activity-row"><div class="activity-icon" :class="`activity-${activity.color}`"><component :is="activity.icon" :size="17" /></div><div class="activity-copy"><strong>{{ activity.title }}</strong><span>{{ activity.detail }}</span></div><time>{{ activity.time }}</time></div></div>
  </section>
</template>
