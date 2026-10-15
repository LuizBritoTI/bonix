<script setup lang="ts">
import { computed, ref } from 'vue'
import { CalendarDays, Plus, Search, Pause, Play, X, Megaphone, Pencil, Sparkles } from '@lucide/vue'
import { useCampaignStore } from '../stores/campaigns'
import { useAuthStore } from '../stores/auth'
import { z } from 'zod'

const campaigns = useCampaignStore()
const auth = useAuthStore()
const search = ref('')
const showForm = ref(false)
const name = ref('')
const mechanic = ref('Cashback 10%')
const audience = ref('Todos os clientes')
const rule = ref('Compras a partir de R$ 50')
const trigger = ref('Compra identificada')
const schedule = ref('')
const editingId = ref<string | null>(null)
const formError = ref('')
const step = ref(0)
const steps = ['Informações', 'Público-alvo', 'Mecânica', 'Regras e gatilhos', 'Agendamento', 'Revisão']
const filter = ref('Todas')
const campaignNameSchema = z.object({
  name: z.string().trim().min(3, 'O nome deve ter pelo menos 3 caracteres.').max(60, 'O nome deve ter até 60 caracteres.'),
})
const filtered = computed(() => campaigns.campaigns.filter((campaign) =>
  (filter.value === 'Todas' || campaign.status === filter.value)
  && campaign.name.toLocaleLowerCase('pt-BR').includes(search.value.toLocaleLowerCase('pt-BR'))))

function draft() {
  return { name: name.value.trim(), mechanic: mechanic.value, audience: audience.value, rule: rule.value, trigger: trigger.value, schedule: schedule.value }
}

function advanceStep() {
  if (step.value === 0) {
    const result = campaignNameSchema.safeParse({ name: name.value })
    if (!result.success) {
      formError.value = result.error.issues[0]?.message ?? 'Informe um nome válido.'
      return
    }
  }
  formError.value = ''
  step.value = Math.min(step.value + 1, steps.length - 1)
}

function saveCampaign() {
  const result = campaignNameSchema.safeParse({ name: name.value })
  if (!result.success) {
    formError.value = result.error.issues[0]?.message ?? 'Revise os campos da campanha.'
    return
  }
  const data = { ...draft(), name: result.data.name }
  if (editingId.value) campaigns.update(editingId.value, data)
  else campaigns.add(data)
  name.value = ''
  audience.value = 'Todos os clientes'
  mechanic.value = 'Cashback 10%'
  rule.value = 'Compras a partir de R$ 50'
  trigger.value = 'Compra identificada'
  schedule.value = ''
  formError.value = ''
  editingId.value = null
  step.value = 0
  showForm.value = false
}

function editCampaign(campaign: (typeof campaigns.campaigns)[number]) {
  editingId.value = campaign.id
  name.value = campaign.name
  mechanic.value = campaign.mechanic
  audience.value = campaign.audience
  rule.value = campaign.rule
  trigger.value = campaign.trigger
  schedule.value = campaign.schedule
  formError.value = ''
  step.value = 0
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  editingId.value = null
  formError.value = ''
  step.value = 0
}
</script>

<template>
  <section class="view-heading"><div><div class="eyebrow"><span class="eyebrow-dot" /> RELACIONAMENTO EM MOVIMENTO</div><h1>Campanhas</h1><p>Crie experiências que transformam compras em relações duradouras.</p></div><button v-if="auth.hasPermission('campaigns:manage')" class="primary-button" @click="closeForm(); showForm = true"><Plus :size="17" /> Nova campanha</button></section>
  <div class="campaign-toolbar"><div class="search-field"><Search :size="16" /><input v-model="search" placeholder="Buscar campanhas..." aria-label="Buscar campanhas" /></div><div class="filter-pills"><button v-for="item in ['Todas', 'Ativa', 'Agendada', 'Rascunho', 'Encerrada']" :key="item" :class="{ selected: filter === item }" @click="filter = item">{{ item }}</button></div></div>
  <section class="campaign-list">
    <article v-for="campaign in filtered" :key="campaign.id" class="campaign-row">
      <div class="campaign-list-art" :class="`art-${campaign.color}`"><Megaphone :size="20" /></div>
      <div class="campaign-list-main"><strong>{{ campaign.name }}</strong><span>{{ campaign.mechanic }} <i /> {{ campaign.audience }}</span></div>
      <div class="campaign-list-count"><strong>{{ campaign.redemption }}</strong><span>resgates</span></div>
      <span class="status-pill" :class="campaign.status === 'Ativa' ? 'status-active' : campaign.status === 'Agendada' ? 'status-scheduled' : 'status-draft'"><i /> {{ campaign.status }}</span>
      <div class="campaign-actions"><button v-if="auth.hasPermission('campaigns:manage')" title="Editar" aria-label="Editar campanha" @click="editCampaign(campaign)"><Pencil :size="15" /></button><button v-if="auth.hasPermission('campaigns:manage')" title="Duplicar" aria-label="Duplicar campanha" @click="campaigns.duplicate(campaign.id)"><Copy :size="16" /></button><button v-if="auth.hasPermission('campaigns:manage')" :title="campaign.status === 'Ativa' ? 'Desativar' : 'Ativar'" :aria-label="campaign.status === 'Ativa' ? 'Desativar' : 'Ativar'" @click="campaigns.toggle(campaign.id)"><Pause v-if="campaign.status === 'Ativa'" :size="16" /><Play v-else :size="16" /></button></div>
    </article>
    <div v-if="filtered.length === 0" class="empty-state"><Megaphone :size="24" /><strong>Nenhuma campanha encontrada</strong><span>Tente ajustar a busca ou o filtro selecionado.</span></div>
  </section>

  <div v-if="showForm" class="modal-backdrop" @click.self="closeForm">
    <form class="modal-card wizard-card" @submit.prevent="step === steps.length - 1 ? saveCampaign() : advanceStep()">
      <button class="modal-close" type="button" aria-label="Fechar" @click="closeForm"><X :size="18" /></button>
      <div class="section-overline">{{ editingId ? 'AJUSTE SUA EXPERIÊNCIA' : 'ASSISTENTE DE CAMPANHAS' }}</div>
      <h2>{{ editingId ? 'Editar campanha' : 'Vamos criar uma campanha' }}</h2>
      <div class="wizard-steps"><div v-for="(item, index) in steps" :key="item" class="wizard-step" :class="{ 'wizard-step-current': index === step, 'wizard-step-done': index < step }"><i>{{ index < step ? '✓' : index + 1 }}</i><span>{{ item }}</span></div></div>
      <div v-if="step === 0" class="wizard-content"><p>Comece com um nome que conte a história da sua campanha.</p><label for="campaign-name">Nome da campanha</label><input id="campaign-name" v-model="name" maxlength="60" placeholder="Ex.: Semana do Cliente" /></div>
      <div v-else-if="step === 1" class="wizard-content"><p>Escolha quem vai receber essa experiência.</p><label for="campaign-audience">Público-alvo</label><select id="campaign-audience" v-model="audience"><option>Todos os clientes</option><option>Clientes Diamante</option><option>Clientes Ouro</option><option>Clientes inativos</option><option>Novos clientes</option><option>Clientes VIP</option></select></div>
      <div v-else-if="step === 2" class="wizard-content"><p>Defina o incentivo que vai fazer a diferença.</p><label for="campaign-mechanic">Mecânica promocional</label><select id="campaign-mechanic" v-model="mechanic"><option>Cashback 10%</option><option>Cashback 15%</option><option>Cashback 20%</option><option>Pontos em dobro</option><option>Bônus de R$ 20</option></select><div class="wizard-note"><Sparkles :size="15" /> Incentivos claros ajudam seus clientes a escolher voltar.</div></div>
      <div v-else-if="step === 3" class="wizard-content"><p>Combine regras e gatilhos para manter a campanha relevante.</p><label for="campaign-rule">Regra de participação</label><select id="campaign-rule" v-model="rule"><option>Compras a partir de R$ 50</option><option>Compras a partir de R$ 100</option><option>Sem valor mínimo</option><option>Primeira compra</option></select><label for="campaign-trigger">Gatilho</label><select id="campaign-trigger" v-model="trigger"><option>Compra identificada</option><option>Cadastro de cliente</option><option>Aniversário do cliente</option><option>Cliente sem comprar há 30 dias</option></select></div>
      <div v-else-if="step === 4" class="wizard-content"><p>Publique agora ou escolha quando a campanha deve começar.</p><label for="campaign-schedule">Início programado (opcional)</label><input id="campaign-schedule" v-model="schedule" type="datetime-local" /><div class="wizard-note"><CalendarDays :size="15" /> Sem agendamento, a campanha ficará como rascunho.</div></div>
      <div v-else class="wizard-content review-content"><p>Revise os detalhes antes de salvar.</p><div><span>Campanha</span><strong>{{ name }}</strong></div><div><span>Público-alvo</span><strong>{{ audience }}</strong></div><div><span>Mecânica</span><strong>{{ mechanic }}</strong></div><div><span>Regra e gatilho</span><strong>{{ rule }} · {{ trigger }}</strong></div><div><span>Agendamento</span><strong>{{ schedule ? new Date(schedule).toLocaleString('pt-BR') : 'Sem agendamento' }}</strong></div></div>
      <p v-if="formError" class="form-error">{{ formError }}</p>
      <div class="modal-actions"><button v-if="step > 0" type="button" class="secondary-button" @click="step--; formError = ''">Voltar</button><button v-else type="button" class="secondary-button" @click="closeForm">Cancelar</button><button class="primary-button" type="submit"><Plus v-if="step === steps.length - 1" :size="16" /> {{ step === steps.length - 1 ? (editingId ? 'Salvar alterações' : 'Criar campanha') : 'Continuar' }}</button></div>
    </form>
  </div>
</template>
