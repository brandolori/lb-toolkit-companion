import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import React from "react"
import Config from "./Config"
import Home from "./Home"

const Stack = createNativeStackNavigator()

const App = () => {
    return <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen
                name="Home"
                component={Home}
                options={{
                    title: "✂️ lb-toolkit clipboard",
                    headerStyle: {
                        backgroundColor: '#1a1b1e',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                        fontSize: 32
                    },
                }}
            />
            <Stack.Screen
                name="Config"
                component={Config}
                options={{
                    title: "🔧 configuration",
                    headerStyle: {
                        backgroundColor: '#1a1b1e',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                        fontSize: 32
                    },
                }}
            />
        </Stack.Navigator>
    </NavigationContainer>
}

export default App