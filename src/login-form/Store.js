var redux = require('redux');
const initialLoginState = {
	username: '',
	password: '',
	remember: false,
};
const loginReducer = (state = initialLoginState, action) => {
	switch(action.type){
		case 'ON-CHANGE-USERNAME':
			return {...state, username: action.username};
		case 'ON-CHANGE-PASSWORD':
			return {...state, password: action.password};
		case 'ON-CHANGE-REMEMBER':
			return {...state, remember: !state.remember};
		default:
			return state;
	}
};
const initialTypeState = true;
const switchTypeReducer = (state = initialTypeState, action) => {
	switch(action.type){
		case 'SWITCH-TYPE':
			let container = document.getElementsByClassName('login-container')[0];
			let slider = document.getElementsByClassName('login-intro-items');
			container.classList.remove('run-rotate-scale-out-animation');
			[...slider].map((x)=>x.classList.remove('run-slider'));
		  void container.offsetHeight; /* trigger reflow */
			container.classList.add('run-rotate-scale-out-animation');
			[...slider].map((x)=>x.classList.add('run-slider'));
			return !state;
		default:
			return state;
	}
}
const allReducer = redux.combineReducers({
	login: loginReducer,
	switch_type: switchTypeReducer,
});
var loginStore = redux.createStore(allReducer);

export default loginStore;