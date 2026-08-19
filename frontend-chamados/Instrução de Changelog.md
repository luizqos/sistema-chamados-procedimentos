# 📌 Controle de Versão e Release

Este projeto utiliza versionamento semântico (SemVer) automatizado através do próprio ecossistema do Node/NPM. A versão exibida no rodapé da interface da aplicação reflete sempre a versão real, sincronizada com o arquivo `package.json`.

## ⚙️ Como funciona?

O Next.js está configurado no arquivo `next.config.js` para ler automaticamente a propriedade `"version"` do `package.json` e injetá-la globalmente como a variável de ambiente `NEXT_PUBLIC_APP_VERSION` durante o build.

**NUNCA altere a versão do `package.json` manualmente.**

---

## 🚀 Comandos de Atualização

Para gerar uma nova versão do sistema, certifique-se de que sua *branch* está limpa (sem arquivos pendentes de commit) e utilize um dos comandos abaixo no terminal. 

O NPM irá, automaticamente:
1. Atualizar o `package.json`.
2. Criar um *commit* de versão.
3. Criar uma *Tag* no Git.

### 1. Correção de Bugs (Patch)
Utilize quando fizer correções de falhas, ajustes na interface ou pequenos ajustes de infraestrutura que não adicionam telas/funcionalidades novas.
*(Exemplo: `0.1.0` ➔ `0.1.1`)*
```bash
npm version patch