import { StyleSheet } from 'react-native';

export const colors = {
    red: '#e51a2e',
    black: '#000000',
    lightGrey: '#bbbbbb',
    grey: '#555555',
    blue: '#4472c4',
    lightGreen: '#a8d08d',
    white: '#ffffff',
    bgLight: '#fafafa',
    cardBackground: '#f5f7ff',
    borderColor: '#e0e0e0',
    errorBackground: '#fff0f0',
};

export const globalStyles = StyleSheet.create({
    // --- LAYOUT DE BASE ---
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    centerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },

    // --- EN-TÊTES (Issus de index.ts) ---
    headerBlue: {
        backgroundColor: colors.blue, // [cite: 21]
        borderRadius: 20,
        padding: 24,
        marginBottom: 20,
    },
    headerBlueTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.white,
        lineHeight: 34,
    },
    headerBlueSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 6,
    },

    // --- TYPOGRAPHIE ---
    pageTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.black, // [cite: 17]
        marginBottom: 20,
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.black, // [cite: 17]
        marginBottom: 12,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.grey, // [cite: 20]
        marginBottom: 8,
        marginTop: 16,
    },
    footer: {
        textAlign: 'center',
        fontSize: 11,
        color: colors.lightGrey, // [cite: 18]
        marginTop: 24,
    },

    // --- BOUTON PRINCIPAL (Sert pour Réserver, Panier, et Fermer Modal) ---
    primaryButton: {
        backgroundColor: colors.red, //
        borderRadius: 16,
        padding: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    primaryButtonText: {
        color: colors.white,
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 10, // Utile s'il y a une icône à côté
    },

    // --- GRANDES CARTES (ex: Page activities) ---
    card: {
        backgroundColor: colors.cardBackground,
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: colors.black, // [cite: 17]
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginBottom: 16,
    },
    cardImage: {
        width: '100%',
        height: 180,
    },
    cardBody: {
        padding: 16,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.black, // [cite: 17]
    },
    cardDesc: {
        fontSize: 14,
        color: colors.grey, // [cite: 20]
        marginVertical: 8,
    },
    cardRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    // --- PETITES CARTES LIGNE (ex: index.ts) ---
    rowCard: {
        backgroundColor: colors.white,
        borderRadius: 14,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 1,
        shadowColor: colors.black, // [cite: 17]
        shadowOpacity: 0.04,
        shadowRadius: 6,
    },
    rowCardIcon: {
        width: 50,
        height: 50,
        borderRadius: 12,
        backgroundColor: colors.cardBackground,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },

    // --- ÉLÉMENTS TEXTUELS SPÉCIFIQUES ---
    infoTextBlue: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.blue, // [cite: 21]
    },
    priceTextRed: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.red, //
    },

    // --- MESSAGES D'ERREUR ---
    errorBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.errorBackground,
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
    },
    errorText: {
        color: colors.red, //
        marginLeft: 8,
        fontWeight: 'bold',
        textAlign: 'center',
    },

    // --- MODALS (Fenêtres) ---
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        height: '85%',
        overflow: 'hidden',
    },
    modalBody: {
        padding: 24,
    },
});