<script setup lang="ts">
import { computed, ref } from 'vue'
import { Download, Search, SlidersHorizontal, Users } from '@lucide/vue'
import { mockCustomers } from '../services/mockApi'

const search = ref('')
const filteredCustomers = computed(() => mockCustomers.filter((customer) =>
  `${customer.name} ${customer.email}`.toLocaleLowerCase('pt-BR').includes(search.value.toLocaleLowerCase('pt-BR'))))
</script>

<template>
  <section class="view-heading"><div><div class="eyebrow"><span class="eyebrow-dot" /> CADA RELAÇÃO CONTA</div><h1>Clientes</h1><p>Conheça quem escolhe sua marca e celebre cada volta.</p></div><button class="secondary-button"><Download :size="16" /> Exportar</button></section>
  <section class="customer-summary"><div><span>Base total</span><strong>12.840</strong><small>clientes identificados</small></div><div><span>Clientes ativos</span><strong>8.426</strong><small class="summary-up">↑ 6,4% este mês</small></div><div><span>Identificados hoje</span><strong>128</strong><small>+18 vs. ontem</small></div><div class="customer-summary-decoration"><Users :size="34" /></div></section>
  <section class="panel customer-table-panel"><div class="customer-toolbar"><div class="search-field"><Search :size="16" /><input v-model="search" placeholder="Buscar por nome ou e-mail..." aria-label="Buscar clientes" /></div><button class="secondary-button"><SlidersHorizontal :size="16" /> Filtros</button></div>
    <div class="table-scroll"><table><thead><tr><th>CLIENTE</th><th>SEGMENTO</th><th>PONTOS</th><th>COMPRAS</th><th>ÚLTIMA VISITA</th></tr></thead><tbody><tr v-for="(customer, index) in filteredCustomers" :key="customer.id"><td><div class="customer-cell"><div class="customer-avatar" :class="`avatar-${customer.color}`">{{ customer.initials }}</div><div><strong>{{ customer.name }}</strong><span>{{ customer.email }}</span></div></div></td><td><span class="tier-pill" :class="`tier-${customer.tier.toLowerCase()}`">{{ customer.tier }}</span></td><td>{{ customer.points.toLocaleString('pt-BR') }} pts</td><td>{{ customer.spent }}</td><td>{{ ['Hoje, 10:24', 'Hoje, 09:12', 'Ontem, 16:45', 'Ontem, 14:08', '12 out, 11:32'][index] }}</td></tr></tbody></table></div>
    <div v-if="filteredCustomers.length === 0" class="empty-state compact-empty"><strong>Nenhum cliente encontrado</strong><span>Tente buscar por outro nome ou e-mail.</span></div>
    <div class="table-footer">Mostrando {{ filteredCustomers.length }} de 12.840 clientes <button>Ver todos os clientes →</button></div>
  </section>
</template>
