import { actionType } from "../constants";
import { storeInLocalStorage } from "../utils/helpers";

const basketReducer = (state, action) => {
    switch(action.type){
        case actionType.ADD_TO_BASKET:
            const existItem = state.basket.find(item => item.id === action.payload.id);

            if(existItem){
                let tempBasket = state.basket.map((item) => {
                    if(item.id === action.payload.id){
                        item.quantity += action.payload.quantity;
                        item.totalPrice = (item.quantity * item.price).toFixed(2);
                    }
                    return item;
                });

                storeInLocalStorage(tempBasket, "basket");
                return {...state, basket: tempBasket };
            } else {
                let tempBasket = [...state.basket, action.payload];
                storeInLocalStorage(tempBasket, "basket");
                return {
                    ...state, 
                    basket: tempBasket 
                }
            }
        case actionType.CLEAR_BASKET:
            storeInLocalStorage([], "basket");
            return {...state, basket: [] }

        case actionType.ADD_QTY_ITEM:
            const tempBasketInc = state.basket.map(item => {
                if(item.id === action.payload){
                    let tempQty = item.quantity + 1;
                    if(tempQty >= item.stock) tempQty = item.stock;
                    let tempTotalPrice = (tempQty * item.discountedPrice).toFixed(2);
                    return { 
                        ...item, 
                        quantity: tempQty, 
                        totalPrice: tempTotalPrice 
                    }
                } else {
                    return item;
                }
            });

            storeInLocalStorage(tempBasketInc, "basket");
            return {
                ...state, 
                basket: tempBasketInc 
            }

        case actionType.MINUS_QTY_ITEM:
            const tempBasketDec = state.basket.map(item => {
                if(item.id === action.payload){
                    let tempQty = item.quantity - 1;
                    if(tempQty < 1) tempQty = 1;
                    let tempTotalPrice = (tempQty * item.discountedPrice).toFixed(2);
                    return {
                        ...item,
                        quantity: tempQty,
                        totalPrice: tempTotalPrice
                    }
                } else {
                    return item;
                }
            });

            storeInLocalStorage(tempBasketDec, "basket");
            return {
                ...state, 
                basket: tempBasketDec 
            }
        case actionType.REMOVE_FROM_BASKET:
            const tempBasket = state.basket.filter(item => item.id !== action.payload);
            state.basket = tempBasket;
            storeInLocalStorage(state.basket, "basket");
            return {
                ...state, 
                basket: tempBasket 
            }
        case actionType.SET_BASKET_MSG_ON:
            return { 
                ...state, 
                basketMsgStatus: action.payload 
            }
        case actionType.SET_BASKET_MSG_OFF:
            return { 
                ...state, 
                basketMsgStatus: action.payload 
            }
        case actionType.GET_BASKET_TOTAL:
            return {
                ...state,
                totalAmount: state.basket.reduce((basketTotal, basketItem) => {
                    return basketTotal += Number(basketItem.totalPrice)
                }, 0).toFixed(2),
                itemsCount: state.basket.length
            }
        case actionType.ADD_CHECKOUT_ITEM: 
            const checkoutSetBasket = state.basket.map(item => {
                if(item.id === action.payload){
                    return {
                        ...item,
                        checkoutStatus: true
                    }
                }
                return item;
            });

            const uncheckedCount = checkoutSetBasket.filter(item => item.checkoutStatus === false).length;

            storeInLocalStorage(checkoutSetBasket, "basket");
            return {
                ...state,
                basket: checkoutSetBasket,
                checkoutAll: uncheckedCount === 0 ? true : false
            }

        case actionType.REMOVE_CHECKOUT_ITEM:
            const checkoutUnsetBasket = state.basket.map(item => {
                if(item.id === action.payload){
                    return {
                        ...item,
                        checkoutStatus: false
                    }
                }
                return item;
            });

            storeInLocalStorage(checkoutUnsetBasket, "basket");
            return {
                ...state,
                basket: checkoutUnsetBasket,
                checkoutAll: false
            }

        case actionType.GET_CHECKOUT_TOTAL: 
             return {
                ...state,
                checkoutTotal: state.basket.reduce((checkoutTotal, basketItem) => {
                    return checkoutTotal += basketItem.checkoutStatus ? Number(basketItem.totalPrice) : 0
                }, 0).toFixed(2),
                checkoutCount: state.basket.filter(basketItem => basketItem.checkoutStatus === true).length
             }

        case actionType.SET_CHECKOUT_ALL: 
             const setAllBasket = state.basket.map(item => {
                return {
                    ...item,
                    checkoutStatus: true
                }
             });

             storeInLocalStorage(setAllBasket, "basket");
             return {
                ...state,
                checkoutAll: true, 
                basket: setAllBasket,
             }

        case actionType.UNSET_CHECKOUT_ALL: 
             const unsetAllBasket = state.basket.map(item => {
                return {
                    ...item,
                    checkoutStatus: false
                }
             });

             storeInLocalStorage(unsetAllBasket, "basket");
             return {
                ...state,
                checkoutAll: false,
                basket: unsetAllBasket,
             }

        default: 
            return state;
    }
}

export default basketReducer;