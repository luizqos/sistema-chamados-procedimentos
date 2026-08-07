import { WithPermission } from '../../src/components/WithPermission';

export default function GestaoUsuariosPage() {
  return (
    <WithPermission role="ADMIN">
      <div className="p-8 space-y-6">
        <h1 className="text-2xl font-bold text-white">Gestão de Usuários e Perfis</h1>
        {/* Formulários e tabelas restritos ao perfil ADMIN */}
      </div>
    </WithPermission>
  );
}