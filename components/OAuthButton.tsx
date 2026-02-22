import { styles } from '@/constants/AuthStyles'
import { useSSO } from '@clerk/clerk-expo'
import { OAuthStrategy } from '@clerk/types'
import * as AuthSession from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'
import { AntDesign } from '@expo/vector-icons'
import React, { useCallback, useEffect } from 'react'
import { Platform, Text, TouchableOpacity, View } from 'react-native'

export const useWarmUpBrowser = () => {
    useEffect(() => {
        if (Platform.OS === 'web') return
        void WebBrowser.warmUpAsync()
        return () => {
            void WebBrowser.coolDownAsync()
        }
    }, [])
}
WebBrowser.maybeCompleteAuthSession()

interface Props {
    strategy: OAuthStrategy
    children: React.ReactNode
}

export default function OAuthButton({ strategy, children }: Props) {
    useWarmUpBrowser()
    const { startSSOFlow } = useSSO()

    const onPress = useCallback(async () => {
        try {
            const { createdSessionId, setActive } = await startSSOFlow({
                strategy,
                redirectUrl: AuthSession.makeRedirectUri(),
            })

            if (createdSessionId) {
                setActive!({ session: createdSessionId })
            } else {
                throw new Error('Failed to create session')
            }
        } catch (err) {
            console.error(JSON.stringify(err, null, 2))
        }
    }, [startSSOFlow, strategy])

    const isGoogle = strategy === 'oauth_google'
    const isApple = strategy === 'oauth_apple'

    const buttonStyle = isGoogle
        ? styles.googleButton
        : isApple
        ? styles.appleButton
        : styles.button

    const textStyle = isGoogle
        ? styles.googleButtonText
        : isApple
        ? styles.appleButtonText
        : styles.buttonText

    return (
        <TouchableOpacity onPress={onPress} style={buttonStyle}>
            {isGoogle ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <AntDesign name="google" size={20} color="#4285F4" />
                    <Text style={textStyle}>{children}</Text>
                </View>
            ) : (
                <Text style={textStyle}>{children}</Text>
            )}
        </TouchableOpacity>
    )
}