import { createContext } from "react";
import { useReducer } from "react";

export const Store = createContext();

const initialState = {
    userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')): null,
    
    cart: {
        cartItems: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')):[],
    },
};

function reducer(state, action) {
        switch(action.type) {
            case 'CART_ADD_ITEM':
                return {...state, cart: 
                    { ...state.cart, cartItems: [...state.cart.cartItems, action.payload],
                    },
                };
                case 'CART_REMOVE_ITEM': {
                    const cartItems = state.cart.cartItems.filter((item) => item._id !== action.payload._id);
                
                return {...state, cart: {...state.cart, cartItems } };
            }
            case 'CART_CLEAR':
                return { ...state, cart: { ...state.cart, cartItems: [] } };
            case 'USER_SIGNIN':
                return { ...state, userInfo: action.payload }
            case 'USER_SIGNOUT':
                return {...state, userInfo: null };
            case 'UPDATE_CART_ITEM':
                const updatedItems = state.cart.cartItems.map((item) => {
                if (item._id === action.payload._id) {
                    return { ...item, quantity: action.payload.quantity };
                }
                return item;
                });
                return { ...state, cart: { ...state.cart, cartItems: updatedItems } };
            default:
                return state;
        }
}

export function StoreProvider(props) {
    const [ state, dispatch ] = useReducer(reducer, initialState);
    const value = { state, dispatch };
    return <Store.Provider value={value}>{props.children}</Store.Provider>
}