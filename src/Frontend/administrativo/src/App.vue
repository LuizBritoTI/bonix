<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import {
  Bell, CalendarDays, ChartNoAxesCombined, ChevronDown, CircleHelp, LayoutDashboard,
  LogOut, Menu, Settings2, Sparkles,
  Store, Tag, Users, WalletCards, X,
} from '@lucide/vue'
import { useAuthStore } from './stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const menuOpen = ref(false)
const title = computed(() => String(route.meta.title ?? 'Visão geral'))

const navigation = [
  { label: 'Visão geral', to: '/', icon: LayoutDashboard, permission: 'dashboard:read' },
  { label: 'Campanhas', to: '/campanhas', icon: Tag, permission: 'campaigns:read' },
  { label: 'Agendamentos', to: '/agendamentos', icon: CalendarDays, permission: 'campaigns:read' },
  { label: 'Clientes', to: '/clientes', icon: Users, permission: 'customers:read' },
  { label: 'Bônus e cashback', to: '/bonus', icon: WalletCards, permission: 'cashback:read' },
  { label: 'Relatórios', to: '/relatorios', icon: ChartNoAxesCombined, permission: 'reports:read' },
  { label: 'Configurações', to: '/configuracoes', icon: Settings2, permission: 'settings:manage' },
]

function logout() {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <RouterView v-if="route.name === 'login'" />
  <div v-else class="app-shell">
    <button v-if="menuOpen" class="mobile-scrim" aria-label="Fechar menu" @click="menuOpen = false" />
    <aside class="sidebar" :class="{ 'sidebar-open': menuOpen }">
      <div class="brand">
        <div class="brand-mark"><Sparkles :size="19" /></div>
        <div><strong>bonix</strong><span>VAI DE BÔNUS</span></div>
        <button class="icon-button sidebar-close" aria-label="Fechar menu" @click="menuOpen = false"><X :size="18" /></button>
      </div>

      <div class="workspace">
        <div class="workspace-logo"><Store :size="17" /></div>
        <div class="workspace-copy"><strong>Grupo Aurora</strong><span>Plano enterprise</span></div>
        <ChevronDown :size="15" class="muted" />
      </div>

      <div class="nav-caption">MENU PRINCIPAL</div>
      <nav class="navigation">
        <RouterLink
          v-for="item in navigation.filter((entry) => auth.hasPermission(entry.permission))"
          :key="item.to"
          :to="item.to"
          class="nav-link"
          :class="{ active: route.path === item.to }"
          @click="menuOpen = false"
        >
          <component :is="item.icon" :size="18" />
          <span>{{ item.label }}</span>
          <span v-if="item.to === '/campanhas'" class="nav-count">8</span>
        </RouterLink>
      </nav>

      <div class="sidebar-spacer" />
      <div class="sidebar-tip">
        <div class="tip-icon"><Sparkles :size="17" /></div>
        <strong>Um novo ciclo começa aqui</strong>
        <p>Crie uma campanha e transforme cada compra em uma nova oportunidade.</p>
        <RouterLink to="/campanhas" class="tip-link">Criar campanha <span>→</span></RouterLink>
      </div>
      <div class="sidebar-footer">
        <button class="help-link"><CircleHelp :size="17" /> Central de ajuda</button>
        <button class="profile" @click="logout">
          <div class="avatar">MC</div>
          <div class="profile-copy"><strong>{{ auth.user?.name ?? 'Marina Costa' }}</strong><span>{{ auth.user?.role === 'marketing' ? 'Marketing' : 'Administradora' }}</span></div>
          <LogOut :size="16" class="muted" />
        </button>
      </div>
    </aside>

    <main class="main-content">
      <header class="topbar">
        <div class="topbar-heading">
          <button class="icon-button mobile-menu" aria-label="Abrir menu" @click="menuOpen = true"><Menu :size="20" /></button>
          <div class="breadcrumbs"><span>Bonix</span><span class="crumb-slash">/</span><strong>{{ title }}</strong></div>
        </div>
        <div class="topbar-actions">
          <div class="live-status"><span class="pulse-dot" /> Ambiente de demonstração</div>
          <button class="icon-button notification-button" aria-label="Notificações"><Bell :size="18" /><i /></button>
          <div class="top-avatar">MC</div>
        </div>
      </header>
      <div class="page-content">
        <RouterView />
      </div>
      <footer class="app-footer"><span>© 2025 Bonix Tecnologia</span><span>Feito para criar relações que duram <span class="heart">♥</span></span></footer>
    </main>
  </div>
</template>
