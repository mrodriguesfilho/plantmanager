import React from 'react';
import AppLoading from 'expo-app-loading';
import {
    useFonts,
    // eslint-disable-next-line camelcase
    Jost_400Regular,
    // eslint-disable-next-line camelcase
    Jost_600SemiBold,
} from '@expo-google-fonts/jost';

import Routes from './src/routes';

export default function App() {
    const [fontsLoaded] = useFonts({
        Jost_400Regular,
        Jost_600SemiBold,
    });

    if (!fontsLoaded) return <AppLoading />;

    return <Routes />;
}
