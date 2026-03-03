import { createContext, useState, useReducer } from 'react';
import { DUMMY_PRODUCTS } from '../dummy-products.js';

export const CartContext = createContext({
    items: [],
    addItemToCart: (item) => { },
    updateItemQuantity: (itemId, quantity) => { },
}
);
/**
 * REDUCER FUNCTION: Contains all state update logic
 * ================================================
 * Receives current state and action, returns new state
 * All complex logic is centralized here (easier to test & debug)
 */
function shoppingCartReducer(state, action) {
    if (action.type === 'ADD_ITEM') {
        const updatedItems = [...state.items];
        const existingCartItemIndex = updatedItems.findIndex(
            (cartItem) => cartItem.id === action.payload.id
        );
        const existingCartItem = updatedItems[existingCartItemIndex];

        if (existingCartItem) {
            const updatedItem = {
                ...existingCartItem,
                quantity: existingCartItem.quantity + 1,
            };
            updatedItems[existingCartItemIndex] = updatedItem;
        } else {
            const product = DUMMY_PRODUCTS.find(
                (product) => product.id === action.payload.id
            );
            updatedItems.push({
                id: action.payload.id,
                name: product.title,
                price: product.price,
                quantity: 1,
            });
        }

        return {
            items: updatedItems,
        };
    }

    if (action.type === 'UPDATE_ITEM') {
        const updatedItems = [...state.items];
        const updatedItemIndex = updatedItems.findIndex(
            (item) => item.id === action.payload.id
        );

        const updatedItem = {
            ...updatedItems[updatedItemIndex],
        };

        updatedItem.quantity += action.payload.amount;

        if (updatedItem.quantity <= 0) {
            updatedItems.splice(updatedItemIndex, 1);
        } else {
            updatedItems[updatedItemIndex] = updatedItem;
        }

        return {
            items: updatedItems,
        };
    }

    return state;
}


export function CartContextProvider({ children }) {

    const [shoppingCartState, shoppingCartDispatch] = useReducer(shoppingCartReducer, {
        items: [],
    });
    // const [shoppingCart, setShoppingCart] = useState({
    //     items: [],
    // });
    //keep and explain this part too(for ai)



    /**
     * Handler function for adding items to cart
     * NEW: Uses dispatch to send action to reducer
     * OLD: Would use setState directly (commented below)
     */
    function handleAddItemToCart(id) {
        shoppingCartDispatch({ type: 'ADD_ITEM', payload: { id } });

        // ===== OLD APPROACH USING setState (for learning) =====
        // setShoppingCart((prevShoppingCart) => {
        //     const updatedItems = [...prevShoppingCart.items];
        //
        //     const existingCartItemIndex = updatedItems.findIndex(
        //         (cartItem) => cartItem.id === id
        //     );
        //     const existingCartItem = updatedItems[existingCartItemIndex];
        //
        //     if (existingCartItem) {
        //         const updatedItem = {
        //             ...existingCartItem,
        //             quantity: existingCartItem.quantity + 1,
        //         };
        //         updatedItems[existingCartItemIndex] = updatedItem;
        //     } else {
        //         const product = DUMMY_PRODUCTS.find((product) => product.id === id);
        //         updatedItems.push({
        //             id: id,
        //             name: product.title,
        //             price: product.price,
        //             quantity: 1,
        //         });
        //     }
        //
        //     return {
        //         items: updatedItems,
        //     };
        // });
    }

    /**
     * Handler function for updating cart item quantity
     * NEW: Uses dispatch to send action to reducer
     * OLD: Would use setState directly (commented below)
     */
    function handleUpdateCartItemQuantity(productId, amount) {
        shoppingCartDispatch({
            type: 'UPDATE_ITEM',
            payload: { id: productId, amount: amount }
        });

        // ===== OLD APPROACH USING setState (for learning) =====
        // setShoppingCart((prevShoppingCart) => {
        //     const updatedItems = [...prevShoppingCart.items];
        //     const updatedItemIndex = updatedItems.findIndex(
        //         (item) => item.id === productId
        //     );
        //
        //     const updatedItem = {
        //         ...updatedItems[updatedItemIndex],
        //     };
        //
        //     updatedItem.quantity += amount;
        //
        //     if (updatedItem.quantity <= 0) {
        //         updatedItems.splice(updatedItemIndex, 1);
        //     } else {
        //         updatedItems[updatedItemIndex] = updatedItem;
        //     }
        //
        //     return {
        //         items: updatedItems,
        //     };
        // });
    }
    /**
     * Create context value object with state and handlers
     * This is what gets passed to all consuming components via useContext
     */
    const ctxValue = {
        items: shoppingCartState.items,
        // items: shoppingCart.items,  // OLD: Would get from useState
        addItemToCart: handleAddItemToCart,
        updateItemQuantity: handleUpdateCartItemQuantity,
    };

    return (
        <CartContext.Provider value={ctxValue}>
            {children}
        </CartContext.Provider>
    );
}
