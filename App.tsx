import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import axios from 'axios';

type Post = {
  id: number;
  title: string;
  body: string;
};

export default function App() {
  const [post, setPost] = useState<Post | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function buscarPost() {
      try {
        const resposta = await axios.get<Post>(
          'https://jsonplaceholder.typicode.com/posts/1'
        );

        setPost(resposta.data);
      } catch (error) {
        setErro('Não foi possível carregar os dados.');
      } finally {
        setCarregando(false);
      }
    }

    buscarPost();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Teste de API</Text>

      {carregando && <ActivityIndicator size="large" />}

      {erro !== '' && <Text style={styles.erro}>{erro}</Text>}

      {post && (
        <View style={styles.card}>
          <Text style={styles.postTitulo}>{post.title}</Text>
          <Text>{post.body}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },

  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },

  card: {
    padding: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
  },

  postTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  erro: {
    textAlign: 'center',
  },
});