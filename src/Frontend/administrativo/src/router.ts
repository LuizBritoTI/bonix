import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from './stores/auth'
import DashboardView from './views/DashboardView.vue'
import CampaignsView from './views/CampaignsView.vue'
import CustomersView from './views/CustomersView.vue'
import LoginView from './views/LoginView.vue'
import FeatureView from './views/FeatureView.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', name: 'login', component: LoginView, meta: { title: 'Entrar', public: true } },
    { path: '/', component: DashboardView, meta: { title: 'Visão geral', permission: 'dashboard:read' } },
    { path: '/campanhas', component: CampaignsView, meta: { title: 'Campanhas', permission: 'campaigns:read' } },
    { path: '/agendamentos', component: FeatureView, meta: { title: 'Agendamentos', section: 'Agendamentos', permission: 'campaigns:read' } },
    { path: '/clientes', component: CustomersView, meta: { title: 'Clientes', permission: 'customers:read' } },
    { path: '/bonus', component: FeatureView, meta: { title: 'Bônus e cashback', section: 'Bônus e cashback', permission: 'cashback:read' } },
    { path: '/relatorios', component: FeatureView, meta: { title: 'Relatórios', section: 'Relatórios', permission: 'reports:read' } },
    { path: '/configuracoes', component: FeatureView, meta: { title: 'Configurações', section: 'Configurações', permission: 'settings:manage' } },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (!to.meta.public && !auth.isAuthenticated) return '/login'
  if (typeof to.meta.permission === 'string' && !auth.hasPermission(to.meta.permission)) return '/'
})
