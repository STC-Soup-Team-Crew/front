import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
    formContainer: {
        marginTop: 40,
        width: '100%',
        maxWidth: 420,
        alignSelf: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#0F172A', // Slate 900
    },
    subtitle: {
        fontSize: 15,
        color: '#64748B', // Slate 500
        marginTop: 10,
        lineHeight: 22,
    },
    form: {
        width: '100%',
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 15,
        fontWeight: '600',
        color: '#334155', // Slate 700
        marginBottom: 8,
    },
    input: {
        height: 48,
        borderWidth: 1,
        borderColor: '#E2E8F0', // Slate 200
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        backgroundColor: '#F8FAFC', // Slate 50
        color: '#1E293B', // Slate 800
    },
    button: {
        backgroundColor: '#41541A',
        borderRadius: 12,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 28,
        shadowColor: '#41541A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonText: {
        color: '#fbff70',
        fontSize: 16,
        fontWeight: '600',
    },
    googleButton: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 0,
        borderWidth: 1.5,
        borderColor: '#dadce0',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    googleButtonText: {
        color: '#3c4043',
        fontSize: 16,
        fontWeight: '600',
    },
    appleButton: {
        backgroundColor: '#000000',
        borderRadius: 12,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 3,
    },
    appleButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    oauthDivider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 8,
    },
    oauthDividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E2E8F0',
    },
    oauthDividerText: {
        marginHorizontal: 12,
        fontSize: 13,
        color: '#94a3b8',
        fontWeight: '500',
    },
    textButton: {
        marginTop: 20,
        alignItems: 'center',
        padding: 8,
    },
    textButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#41541A',
    },
})