import NewsForm from '@/components/NewsForm';

export default function NovaNoticiaPage() {
  return (
    <main className="container">
      <h1 className="page-title">Nova Notícia</h1>
      <p className="page-subtitle">Publicada agora, salva como rascunho ou agendada</p>
      <NewsForm />
    </main>
  );
}
