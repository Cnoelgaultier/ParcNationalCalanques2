import { StyleSheet } from 'react-native';

export const colors = {
    red: '#e51a2e',        // Calanques Red
    black: '#000000',      // Calanques Black
    lightGrey: '#bbbbbb',  // Calanques Light Grey
    grey: '#555555',       // Calanques Grey
    blue: '#4472c4',       // Calanques Blue
    lightGreen: '#a8d08d', // Calanques Light Green

    // Couleurs utiles pour l'interface
    white: '#ffffff',
    bgLight: '#fafafa',
    cardBackground: '#f5f7ff',
    borderColor: '#e0e0e0',
    errorBackground: '#fff0f0',
    warningBackground: '#fff8e1',
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

    // --- BOUTON PRINCIPAL (Actions fortes / Finales : Panier) ---
    primaryButton: {
        backgroundColor: colors.red,
        borderRadius: 14,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // J'ai retiré les margin "en dur" pour que tes View (avec gap) gèrent l'espacement
    },
    primaryButtonText: {
        color: colors.white,
        fontWeight: 'bold',
        fontSize: 16,
    },

    // --- BOUTON RÉSERVER (Action principale de la page Activités) ---
    reserveActivityButton: {
        backgroundColor: colors.blue,
        borderRadius: 14,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    reserveActivityButtonText: {
        color: colors.white,
        fontWeight: 'bold',
        fontSize: 16,
    },

    // --- BOUTON SECONDAIRE (Actions neutres : Fermer, Annuler, Retour) ---
    secondaryButton: {
        backgroundColor: colors.bgLight,
        borderWidth: 1,
        borderColor: colors.borderColor,
        borderRadius: 14,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: colors.grey,
        fontWeight: 'bold',
        fontSize: 15,
    },

    // --- GRANDES CARTES (ex: Page activities) ---
    card: {
        backgroundColor: colors.cardBackground,
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: colors.black,
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
        color: colors.black,
    },
    cardDesc: {
        fontSize: 14,
        color: colors.grey,
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
        shadowColor: colors.black,
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
        color: colors.blue,
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

    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderColor,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.black,
        marginBottom: 15,
    },


    // ==========================================
    // STYLES SPÉCIFIQUES : PAGE CREATE RÉSERVATION
    // ==========================================
    resInput: { borderWidth: 1, borderColor: colors.borderColor, borderRadius: 12, padding: 14, backgroundColor: colors.bgLight, fontSize: 15 },
    resSelectButton: { borderWidth: 1, borderColor: colors.borderColor, borderRadius: 12, padding: 14, backgroundColor: colors.bgLight },
    resSelectButtonContent: { flexDirection: 'row', alignItems: 'center' },
    resSelectButtonImage: { width: 44, height: 44, borderRadius: 8, marginRight: 12 },
    resSelectButtonTitle: { fontSize: 15, fontWeight: '600', color: colors.black },
    resSelectButtonSub: { fontSize: 12, color: colors.grey, marginTop: 2 },
    resSelectButtonPlaceholder: { flex: 1, fontSize: 15, color: colors.lightGrey },
    resCardInfo: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    resInfoBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#a8d08d20', borderWidth: 1, borderColor: colors.lightGreen, borderRadius: 12, padding: 14, marginTop: 16 },
    resInfoBoxError: { backgroundColor: colors.errorBackground, borderColor: colors.red },
    resInfoBoxWarning: { backgroundColor: colors.warningBackground, borderColor: '#f0a500' },
    resInfoText: { fontWeight: '600', fontSize: 13 },
    resProgressBar: { height: 6, backgroundColor: colors.borderColor, borderRadius: 3, marginTop: 6, overflow: 'hidden' },
    resProgressFill: { height: '100%', borderRadius: 3 },
    resCounter: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: 12, borderWidth: 1, borderColor: colors.borderColor, overflow: 'hidden' },
    resCounterBtn: { width: 50, height: 50, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white },
    resCounterBtnText: { fontSize: 22, fontWeight: 'bold', color: colors.blue },
    resCounterInput: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: 'bold', color: colors.black },
    resTotalBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.cardBackground, borderRadius: 14, padding: 16, marginTop: 16 },
    resTotalLabel: { fontSize: 15, color: colors.grey, fontWeight: '500' },
    resTotalAmount: { fontSize: 22, fontWeight: 'bold', color: colors.blue },
    resCartButtonDisabled: { opacity: 0.5 },

    // Modal spécifique à la sélection dans réservation
    resModalContainer: { backgroundColor: colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '80%', paddingBottom: 30 },
    resModalItem: { padding: 16, flexDirection: 'row', alignItems: 'center' },
    resModalItemSelected: { backgroundColor: '#eef2fb' },
    resModalItemImage: { width: 56, height: 56, borderRadius: 10, marginRight: 12 },
    resModalItemTitle: { fontSize: 15, fontWeight: '600', color: colors.black },
    resModalItemSub: { fontSize: 12, color: colors.grey, marginTop: 2, marginBottom: 8 },
    resModalItemRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
    resModalItemBadge: { fontSize: 12, fontWeight: '600', backgroundColor: '#f0f0f0', color: colors.grey, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
    resSeparator: { height: 1, backgroundColor: '#f0f0f0', marginHorizontal: 16 },

    // ==========================================
    // STYLES SPÉCIFIQUES : INDEX/ACTIVITÉS
    // ==========================================
    actHeader: { marginBottom: 20, marginTop: 10 },
    actListContainer: { gap: 16 },
    actModalImage: { width: '100%', height: 250 },
    actModalTitle: { fontSize: 24, fontWeight: 'bold', color: colors.black, marginBottom: 15 },
    actModalRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
    actBadge: { backgroundColor: colors.cardBackground, paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
    actModalDescription: { fontSize: 15, color: colors.grey, lineHeight: 22 },

    // --- FILTRES (Page Activités) ---
    actFilterToggle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.cardBackground, padding: 15, borderRadius: 12, marginBottom: 15 },
    actFilterToggleText: { fontWeight: 'bold', color: colors.blue },
    actFilterContainer: { backgroundColor: colors.bgLight, padding: 15, borderRadius: 12, marginBottom: 15, borderWidth: 1, borderColor: colors.borderColor },
    actFilterLabel: { fontSize: 13, fontWeight: 'bold', color: colors.grey, marginBottom: 8, marginTop: 10 },
    actFilterInput: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.borderColor, borderRadius: 10, padding: 12, fontSize: 14 },
    actFilterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    actFilterChip: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.borderColor, paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
    actFilterChipSelected: { backgroundColor: colors.blue, borderColor: colors.blue },
    actFilterChipText: { color: colors.grey, fontWeight: '600', fontSize: 13 },
    actFilterChipTextSelected: { color: colors.white, fontWeight: '600', fontSize: 13 },

    // --- TYPES D'ACTIVITÉS ---
    actTypesScroll: { flexGrow: 0, marginBottom: 15 },
    actTypesContainer: { paddingHorizontal: 20, gap: 10, paddingBottom: 5 },
});


