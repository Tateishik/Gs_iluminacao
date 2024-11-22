import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, ActivityIndicator, Alert } from 'react-native';
import { getLightStatus, setLightStatus } from '../services/api';

const DashboardScreen: React.FC = () => {
  const [lightIntensity, setLightIntensity] = useState(0);
  const [isLightOn, setIsLightOn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLightStatus();
  }, []);

  const fetchLightStatus = async () => {
    try {
      setIsLoading(true);
      const status = await getLightStatus();
      setLightIntensity(status.intensity);
      setIsLightOn(status.isOn);
    } catch (error) {
      console.error('Erro ao buscar status da luz:', error);
      Alert.alert('Erro', 'Não foi possível obter o status da iluminação.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLight = async () => {
    try {
      setIsLoading(true);
      const newStatus = await setLightStatus(!isLightOn);
      setIsLightOn(newStatus.isOn);
      setLightIntensity(newStatus.intensity);
    } catch (error) {
      console.error('Erro ao alterar status da luz:', error);
      Alert.alert('Erro', 'Não foi possível alterar o status da iluminação.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard de Iluminação</Text>
      <Text>Intensidade da Luz Natural: {lightIntensity}%</Text>
      <View style={styles.switchContainer}>
        <Text>Iluminação Pública: </Text>
        <Switch value={isLightOn} onValueChange={toggleLight} disabled={isLoading} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
});

export default DashboardScreen;

