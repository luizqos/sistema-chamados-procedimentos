# Changelog

Todas as alterações notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado no [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/), e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [v0.1.0-beta] - 2026-08-18

### 🚀 Adicionado (Added)
* **Sistema de Auditoria:** 
  * Criação da página de Auditoria (`AuditoriaPage`) para rastreabilidade do sistema.
  * Adição de tabelas e modais de detalhes (`TabelaAuditoria`, `ModalDetalhesAuditoria`) para comparar "Dados Antigos" e "Dados Novos" em formato JSON.
  * Integração com o `auditoriaService`.
* **Compartilhamento de Procedimentos:** 
  * Novo modal e lógica para compartilhar procedimentos específicos com outros usuários da base.
  * Implementação de controle de níveis de acesso granulares (`VISUALIZAR` e `EDITAR`).
* **Edição de Procedimentos:** 
  * Suporte para edição e atualização de procedimentos existentes.
  * Regra de negócio que garante que apenas o criador, administradores ou usuários com permissão explícita possam alterar o conteúdo.
* **Novos Utilitários Base:** 
  * `clipboard.js`: Padronização da cópia de scripts para a área de transferência.
  * `errorHandler.js`: Interceptação e formatação amigável de erros da API.
  * `permissions.js`: Centralização de constantes de perfis (`ROLES`, `PERMISSION_LEVELS`) e funções de validação de acesso.

### 🔄 Modificado (Changed)
* **Arquitetura de Componentes:** 
  * Refatoração massiva de UI para extrair blocos de código gigantes de dentro das *Views* (Páginas) para componentes reutilizáveis.
  * Criação de modais independentes (`ModalNovoUsuario`, `ModalEditarUsuario`, `ModalNovaRegraSso`, `ModalCompartilhamento`).
  * Criação de tabelas independentes (`TabelaUsuarios`, `TabelaRegrasSso`).
  * Aprimoramento do componente `Badge` com injeção de classes dinâmicas e proteções de layout (`truncate`, `shrink-0`).
* **Camada de Serviços (Service Layer):**
  * Limpeza drástica nos componentes React: remoção de chamadas diretas com `axios/api`.
  * Todas as requisições HTTP foram delegadas para arquivos `.js` dedicados (`authService`, `usuarioService`, `ssoRegrasService`, `procedimentoPermissaoService`).
* **Contexto de Autenticação (`AuthContext.jsx`):** Delegação da recuperação do usuário atual (`/api/auth/me`) e verificação de permissões para os novos utilitários e serviços.

### 🐛 Corrigido (Fixed)
* **SSR e Hydration no Next.js:** Ajuste de estrutura e uso da diretiva `'use client'` garantindo que componentes que dependem do `window` ou de interações do usuário não quebrem a renderização do servidor.
* **Crash de Compilação (This page couldn't load):** Resolução de erros de sintaxe (chaves e aspas não fechadas) que derrubavam a interface durante o desenvolvimento.
* **Rotas e Redirecionamentos:** Ajustes no interceptor do Axios para evitar falhas silenciosas ao expirar o token de autenticação.