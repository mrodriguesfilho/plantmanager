import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, FlatList, Alert } from 'react-native';
// eslint-disable-next-line import/no-duplicates
import { formatDistance } from 'date-fns';
/*eslint-disable-line*/
// eslint-disable-next-line import/no-duplicates
import { pt } from 'date-fns/locale';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header } from '../components/Header';
import colors from '../styles/colors';
import waterdrop from '../assets/waterdrop.png';
import { loadPlant, PlantProps, StoragePlantProps } from '../libs/storage';
import fonts from '../styles/fonts';
import { PlantCardSecondary } from '../components/PlantCardSecondary';
import { Load } from '../components/Load';

export function MyPlants() {
    const [myPlants, setMyPlants] = useState<PlantProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [nextWatered, setNextWatered] = useState<string>();

    function handleRemove(plant: PlantProps) {
        Alert.alert('Remover', `Deseja remover a ${plant.name}?`, [
            {
                text: 'Não',
                style: 'cancel',
            },

            {
                text: 'Sim',
                onPress: async () => {
                    try {
                        const data = await AsyncStorage.getItem(
                            '@plantmanager:plants',
                        );
                        const plants = data
                            ? (JSON.parse(data) as StoragePlantProps)
                            : {};

                        delete plants[plant.id];

                        await AsyncStorage.setItem(
                            '@plantmanager:plants',
                            JSON.stringify(plants),
                        );

                        setMyPlants((oldData) =>
                            oldData.filter((item) => item.id !== plant.id),
                        );
                    } catch (error) {
                        Alert.alert('Não foi possível remover!');
                    }
                },
            },
        ]);
    }

    useEffect(() => {
        async function loadStorageDate() {
            const plantsStoraged = await loadPlant();

            const nextTime = formatDistance(
                new Date(plantsStoraged[0].dateTimeNotification).getTime(),
                new Date().getTime(),
                { locale: pt },
            );

            setNextWatered(
                `Não esqueça de regar a ${plantsStoraged[0].name} à ${nextTime}.`,
            );

            setMyPlants(plantsStoraged);
            setLoading(false);
        }

        loadStorageDate();
    }, []);

    if (loading) return <Load />;

    return (
        <View style={styles.container}>
            <Header />

            <View style={styles.spotlight}>
                <Image source={waterdrop} style={styles.spotlightImage} />
                <Text style={styles.spotlightText}>{nextWatered}</Text>
            </View>

            <View style={styles.plants}>
                <Text style={styles.plantsTitle}>Próximas Regadas:</Text>

                <FlatList
                    data={myPlants}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item }) => (
                        <PlantCardSecondary
                            data={item}
                            handleRemove={() => {
                                handleRemove(item);
                            }}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    // contentContainerStyle={{ flex: 1 }} # Não deixa dar scroll nas próximas regadas
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
        paddingTop: 50,
        backgroundColor: colors.background,
    },

    spotlight: {
        backgroundColor: colors.blue_light,
        paddingHorizontal: 20,
        borderRadius: 20,
        height: 110,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    spotlightImage: {
        width: 60,
        height: 60,
    },

    spotlightText: {
        flex: 1,
        color: colors.blue,
        paddingHorizontal: 10,
    },

    plants: {
        flex: 1,
        width: '100%',
    },

    plantsTitle: {
        fontSize: 24,
        fontFamily: fonts.heading,
        color: colors.heading,
        marginVertical: 20,
    },
});
