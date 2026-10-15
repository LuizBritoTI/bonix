<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight, Eye, EyeOff, Sparkles } from '@lucide/vue'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const showPassword = ref(false)
const email = ref('marina@auroravarejo.com.br')
const password = ref('bonix2025')

function login(role: 'admin' | 'marketing' = 'admin') {
  if (!email.value.includes('@') || password.value.length < 6) return
  auth.login(role)
  router.push('/')
}
</script>

<template>
  <main class="login-page">
    <div class="login-decoration login-decoration-one" /><div class="login-decoration login-decoration-two" />
    <section class="login-panel">
      <div class="login-brand"><div class="brand-mark"><Sparkles :size="19" /></div><strong>bonix</strong></div>
      <div class="login-kicker"><span /> PLATAFORMA DE FIDELIZAÇÃO</div>
      <h1>Relacionamentos que<br />valem <span>mais.</span></h1>
      <p class="login-intro">Acesse seu espaço para criar experiências que fazem seus clientes voltarem.</p>
      <form class="login-form" @submit.prevent="login()">
        <label for="email">E-mail corporativo</label>
        <input id="email" v-model="email" type="email" autocomplete="username" required />
        <label for="password">Senha</label>
        <div class="password-input"><input id="password" v-model="password" :type="showPassword ? 'text' : 'password'" autocomplete="current-password" minlength="6" required /><button type="button" aria-label="Mostrar senha" @click="showPassword = !showPassword"><Eye v-if="!showPassword" :size="17" /><EyeOff v-else :size="17" /></button></div>
        <div class="login-options"><label class="remember"><input type="checkbox" checked /> Lembrar de mim</label><a href="#" @click.prevent>Esqueceu a senha?</a></div>
        <button class="primary-button login-button" type="submit">Entrar na plataforma <ArrowRight :size="17" /></button>
      </form>
      <div class="demo-divider"><span /> acesso demonstrativo <span /></div>
      <div class="demo-actions"><button @click="login('admin')">Entrar como admin</button><button @click="login('marketing')">Entrar como marketing</button></div>
      <div class="login-brand-footer">VAI DE BÔNUS <span>·</span> UMA MARCA BONIX</div>
    </section>
    <aside class="login-aside">
      <div class="login-orb orb-one" /><div class="login-orb orb-two" />
      <div class="login-quote">
        <div class="quote-mark">“</div>
        <p>Fidelizar é transformar cada compra em um motivo para voltar.</p>
        <div class="quote-author"><div class="quote-avatar">VB</div><div><strong>Vai de Bônus</strong><span>Mais valor em cada relação</span></div></div>
      </div>
      <span class="login-aside-caption">MAIS CONEXÃO. MAIS RESULTADO.</span>
    </aside>
  </main>
</template>
