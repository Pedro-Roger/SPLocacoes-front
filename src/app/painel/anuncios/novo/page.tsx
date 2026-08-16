import EquipmentForm from '@/components/EquipmentForm';

export default function NovoAnuncioPage() {
  return (
    <main className="container">
      <h1 className="page-title">Novo Anúncio</h1>
      <p className="page-subtitle">Mesmos campos exibidos no catálogo público</p>
      <EquipmentForm />
    </main>
  );
}
