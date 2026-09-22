import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Post = {
  id: number;
  title: string;
  body: string;
};

const API_URL = 'https://jsonplaceholder.typicode.com/posts/1';
const CACHE_KEY = '@post_cache';

export default function App() {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [origem, setOrigem] = useState('');
  const [erro, setErro] = useState('');

  async function carregarDados() {
    setLoading(true);
    setErro('');

    try {
      // 1. Tenta buscar os dados da API
      const response = await axios.get<Post>(API_URL);

      const dados = response.data;

      setPost(dados);
      setOrigem('Dados carregados da API');

      // 2. Salva uma cópia dos dados no cache
      await AsyncStorage.setItem(
        CACHE_KEY,
        JSON.stringify(dados)
      );
    } catch (error) {
      // 3. Se a API falhar, tenta recuperar o cache
      try {
        const dadosCache = await AsyncStorage.getItem(CACHE_KEY);

        if (dadosCache !== null) {
          const dadosConvertidos: Post = JSON.parse(dadosCache);

          setPost(dadosConvertidos);
          setOrigem('Dados carregados do cache');
        } else {
          setPost(null);
          setErro('Não foi possível carregar os dados e não existe cache salvo.');
        }
      } catch {
        setPost(null);
        setErro('Erro ao acessar o cache.');
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>API + Cache</Text>

      <Text style={styles.subtitulo}>
        React Native • Axios • AsyncStorage
      </Text>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <>
          {post && (
            <View style={styles.card}>
              <Text style={styles.postTitulo}>
                {post.title}
              </Text>

              <Text style={styles.postBody}>
                {post.body}
              </Text>
            </View>
          )}

          {origem !== '' && (
            <Text style={styles.origem}>
              {origem}
            </Text>
          )}

          {erro !== '' && (
            <Text style={styles.erro}>
              {erro}
            </Text>
          )}

          <TouchableOpacity
            style={styles.botao}
            onPress={carregarDados}
          >
            <Text style={styles.botaoTexto}>
              Atualizar dados
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    justifyContent: 'center',
    padding: 24,
  },

  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },

  subtitulo: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },

  card: {
    backgroundColor: '#ffffff',
    padding: 22,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#dddddd',
  },

  postTitulo: {
    fontSize: 21,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  postBody: {
    fontSize: 17,
    lineHeight: 25,
  },

  origem: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    fontWeight: '600',
  },

  erro: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },

  botao: {
    backgroundColor: '#2563eb',
    padding: 15,
    borderRadius: 10,
    marginTop: 25,
  },

  botaoTexto: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});