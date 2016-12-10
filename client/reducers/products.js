'use strict';
import {ActionTypes} from '../actions/product-action';

const products = (state = [], action) => {
    switch (action.type) {
        case ActionTypes.GET_PRODUCTS_PENDING:
            return state;
        case ActionTypes.GET_PRODUCTS_FULFILLED:
            return [...action.payload.data.products];
        case ActionTypes.GET_PRODUCTS_REJECTED:
            return state;
        default:
            return state;
    }
};

export default products;
