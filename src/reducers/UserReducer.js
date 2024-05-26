const initialState = {
    user: null,
    error: null,
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'USERLOGIN':
            return {
                ...state,
                user: 'customer',
                error: null,
            };
        case 'DOORMANLOGIN':
            return {
                ...state,
                user: 'doorman',
                error: null,
            };
        case 'VENDORLOGIN':
            return {
                ...state,
                user: 'vendor',
                error: null,
            };
        case 'ERROR':
            return {
                ...state,
                error: action.payload,
            };
        default:
            return state;
    }
}

export default userReducer;