import React, { createContext, useContext, useReducer } from "react";
import rootReducer from "../reducers";
import { 
    addToBasket, 
    clearBasket, 
    addQtyItem, 
    minusQtyItem, 
    removeFromBasket, 
    setBasketMsgOn, 
    setBasketMsgOff, 
    getBasketTotal,
    addToCheckout,
    removeFromCheckout,
    getCheckoutTotal,
    setCheckoutAll,
    unsetCheckoutAll
} from "../actions/basketActions";
import { fetchFromLocalStorage } from "../utils/helpers";

const initialState = {
    basket: fetchFromLocalStorage("basket"),
    itemsCount: 0,
    totalAmount: 0,
    checkoutCount: 0,
    checkoutTotal: 0,
    checkoutAll: false,
    basketMsgStatus: false
};

const BasketContext = createContext({});
export const BasketProvider = ({children}) => {
    const [state, dispatch] = useReducer(rootReducer.basket, initialState);

    return (
        <BasketContext.Provider value = {{
            ...state,
            dispatch,
            addToBasket, 
            clearBasket, 
            addQtyItem, 
            minusQtyItem, 
            removeFromBasket,
            setBasketMsgOn,
            setBasketMsgOff,
            getBasketTotal,
            addToCheckout,
            removeFromCheckout,
            getCheckoutTotal,
            setCheckoutAll,
            unsetCheckoutAll
        }}>
            {children}
        </BasketContext.Provider>
    )
}

export const useBasketContext = () => {
    return useContext(BasketContext);
}