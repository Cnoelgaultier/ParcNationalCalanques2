import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─────────────────────────────────────────────
// 1. TYPES — calqués sur votre modèle Activite
// ─────────────────────────────────────────────
export interface CartItem {
    cartKey: string;
    activite_id: number;
    nom: string;
    description: string;
    image_url: string;
    tarif: number;
    duree: string;
    date: string;
    dateAffichee: string;
    heure: string;
    nb_participants: number;
}

interface CartState {
    items: CartItem[];
    loading: boolean;
}

type CartAction =
    | { type: 'LOAD_CART'; payload: CartItem[] }
    | { type: 'ADD_ITEM'; payload: CartItem }
    | { type: 'REMOVE_ITEM'; payload: string }
    | { type: 'UPDATE_PARTICIPANTS'; payload: { cartKey: string; nb_participants: number } }
    | { type: 'CLEAR_CART' };

interface ConfirmResult {
    success: boolean;
    errors: { cartKey: string; message: string }[];
}

interface CartContextType {
    items: CartItem[];
    loading: boolean;
    totalPrix: number;
    totalArticles: number;
    isInCart: (cartKey: string) => boolean;
    addToCart: (item: CartItem) => void;
    removeFromCart: (cartKey: string) => void;
    updateParticipants: (cartKey: string, nb_participants: number) => void;
    clearCart: () => void;
    confirmCart: (token: string, apiUrl: string) => Promise<ConfirmResult>;
}

// ─────────────────────────────────────────────
// 2. CONSTANTE DE STOCKAGE
// ─────────────────────────────────────────────
const CART_STORAGE_KEY = '@cart_items';

// ─────────────────────────────────────────────
// 3. REDUCER
// ─────────────────────────────────────────────
const cartReducer = (state: CartState, action: CartAction): CartState => {
    switch (action.type) {
        case 'LOAD_CART':
            return { ...state, items: action.payload, loading: false };

        case 'ADD_ITEM': {
            const exists = state.items.find(item => item.cartKey === action.payload.cartKey);
            if (exists) return state;
            return { ...state, items: [...state.items, action.payload] };
        }

        case 'REMOVE_ITEM':
            return {
                ...state,
                items: state.items.filter(item => item.cartKey !== action.payload),
            };

        case 'UPDATE_PARTICIPANTS':
            return {
                ...state,
                items: state.items.map(item =>
                    item.cartKey === action.payload.cartKey
                        ? { ...item, nb_participants: action.payload.nb_participants }
                        : item
                ),
            };

        case 'CLEAR_CART':
            return { ...state, items: [] };

        default:
            return state;
    }
};

// ─────────────────────────────────────────────
// 4. CONTEXT
// ─────────────────────────────────────────────
const CartContext = createContext<CartContextType | null>(null);

// ─────────────────────────────────────────────
// 5. PROVIDER
// ─────────────────────────────────────────────
export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(cartReducer, {
        items: [],
        loading: true,
    });

    useEffect(() => {
        const loadCart = async (): Promise<void> => {
            try {
                const stored = await AsyncStorage.getItem(CART_STORAGE_KEY);
                const items: CartItem[] = stored ? JSON.parse(stored) : [];
                dispatch({ type: 'LOAD_CART', payload: items });
            } catch (error) {
                console.error('Erreur chargement panier:', error);
                dispatch({ type: 'LOAD_CART', payload: [] });
            }
        };
        loadCart();
    }, []);

    useEffect(() => {
        if (!state.loading) {
            AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items)).catch(
                error => console.error('Erreur sauvegarde panier:', error)
            );
        }
    }, [state.items, state.loading]);

    const addToCart = (item: CartItem): void => {
        dispatch({ type: 'ADD_ITEM', payload: item });
    };

    const removeFromCart = (cartKey: string): void => {
        dispatch({ type: 'REMOVE_ITEM', payload: cartKey });
    };

    const updateParticipants = (cartKey: string, nb_participants: number): void => {
        if (nb_participants < 1) {
            removeFromCart(cartKey);
            return;
        }
        dispatch({ type: 'UPDATE_PARTICIPANTS', payload: { cartKey, nb_participants } });
    };

    const clearCart = (): void => {
        dispatch({ type: 'CLEAR_CART' });
    };

    const confirmCart = async (token: string, apiUrl: string): Promise<ConfirmResult> => {
        const results: ConfirmResult = { success: true, errors: [] };

        for (const item of state.items) {
            try {
                const response = await fetch(`${apiUrl}/reservations`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        activite_id: item.activite_id,
                        date: item.date,
                        heure: item.heure,
                        nb_participants: item.nb_participants,
                    }),
                });

                if (!response.ok) {
                    const errData = await response.json().catch(() => ({}));
                    results.errors.push({
                        cartKey: item.cartKey,
                        message: errData.message ?? 'Erreur inconnue',
                    });
                    results.success = false;
                }
            } catch (error) {
                results.errors.push({
                    cartKey: item.cartKey,
                    message: error instanceof Error ? error.message : 'Erreur inconnue',
                });
                results.success = false;
            }
        }

        if (results.success) clearCart();
        return results;
    };

    const totalPrix = state.items.reduce(
        (sum, item) => sum + item.tarif * item.nb_participants,
        0
    );
    const totalArticles = state.items.length;
    const isInCart = (cartKey: string): boolean =>
        state.items.some(item => item.cartKey === cartKey);

    return (
        <CartContext.Provider
            value={{
        items: state.items,
            loading: state.loading,
            totalPrix,
            totalArticles,
            isInCart,
            addToCart,
            removeFromCart,
            updateParticipants,
            clearCart,
            confirmCart,
    }}
>
    {children}
    </CartContext.Provider>
);
};

// ─────────────────────────────────────────────
// 6. HOOK
// ─────────────────────────────────────────────
export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart doit être utilisé à l'intérieur d'un <CartProvider>");
    }
    return context;
};