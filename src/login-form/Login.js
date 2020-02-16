import React from 'react';
import './Login.css';
import intro from './img/intro.png';
import { connect } from 'react-redux';
import axios from 'axios';
import hashing from './custom_hashing';

const getUserListData = ()=>
	axios.get('getData')
		.then((res)=>res.data)
		.catch((err)=>{
			console.log(err);
	});;

const addNewUser = (username, password)=>
	axios.post('addUser', {username, password})
	.then((resp)=>resp.data);;

class Login extends React.Component {
	constructor(props){
		super(props);

		this.state = {
			repassword: '',
			userListData: null,
		};

		this.checkAccessType = this.checkAccessType.bind(this);
		this.submitHandler = this.submitHandler.bind(this);
	}

	UNSAFE_componentWillMount(){
		if(!this.state.userListData){
			getUserListData().then((res)=>this.setState({userListData: res}));
		}
	}

	submitHandler(evt){
		evt.preventDefault();
		let newNode = document.createElement('span');
		let parentTag = evt.target.parentNode;
		parentTag.querySelector('span') ? parentTag.removeChild(parentTag.querySelector('span')) : console.log('');
		if(this.props.switch_type){
			if(this.props.username.length === 0){
			  newNode.appendChild(document.createTextNode('username cannot be empty!'));
				parentTag.insertBefore(newNode, parentTag.querySelector('[name=username]').nextSibling);
			} else if(this.props.password.length === 0){
			  newNode.appendChild(document.createTextNode('password cannot be empty!'));
				parentTag.insertBefore(newNode, parentTag.querySelector('[name=password]').nextSibling);
			} else{ 
				let accIdx = [...this.state.userListData].map((account)=>account.username).indexOf(this.props.username);
				if(accIdx < 0){
				  newNode.appendChild(document.createTextNode('user not exist!'));
					parentTag.insertBefore(newNode, parentTag.querySelector('[name=username]').nextSibling);
				} else if(!hashing.compare(this.props.password, this.state.userListData[accIdx].password)){
				  newNode.appendChild(document.createTextNode('password is incorrect!'));
					parentTag.insertBefore(newNode, parentTag.querySelector('[name=password]').nextSibling);
				} else {
					alert('have fun!');
				}
			}
		} else {
			if(this.props.username.length === 0){
			  newNode.appendChild(document.createTextNode('username cannot be empty!'));
				parentTag.insertBefore(newNode, parentTag.querySelector('[name=username]').nextSibling);
			} else if(this.props.password.length === 0){
			  newNode.appendChild(document.createTextNode('password cannot be empty!'));
				parentTag.insertBefore(newNode, parentTag.querySelector('[name=password]').nextSibling);
			} else if(this.props.password.localeCompare(this.state.repassword)){
			  newNode.appendChild(document.createTextNode('password and re-type password dont match!'));
				parentTag.insertBefore(newNode, parentTag.querySelector('[name=repassword]').nextSibling);
			} else if(!/^([A-Za-z_]+[A-Za-z_0-9]{5,30})$/.test(this.props.username)){
			  newNode.appendChild(document.createTextNode('username must be alphabet, _, or numeric and first character cant be numeric, also in range 6-30!'));
				parentTag.insertBefore(newNode, parentTag.querySelector('[name=username]').nextSibling);
			} else if(!/^([A-Za-z_]+[a-z_0-9]{5,30})$/.test(this.props.password)){
			  newNode.appendChild(document.createTextNode('password must be alphabet, _, or numeric and first character cant be numeric, also in range 6-30!'));
				parentTag.insertBefore(newNode, parentTag.querySelector('[name=password]').nextSibling);
			} else if([...this.state.userListData].map((account)=>account.username).indexOf(this.props.username) >= 0){
			  newNode.appendChild(document.createTextNode('user existed!'));
				parentTag.insertBefore(newNode, parentTag.querySelector('[name=username]').nextSibling);
			} else {
				addNewUser(this.props.username, hashing.hash(this.props.password, {salt: this.props.username, rounds: 20})).then((resp)=>{
					console.log(resp);
				});
				getUserListData().then((res)=>this.setState({userListData: res}));
			}
		}
	}

	checkAccessType(){
		if(this.props.switch_type){
			return (
				<div className='login-form'>
					<form>
						<h2>Sign in</h2>
						<input name='username' type='text' value={this.props.username} placeholder='username' onChange={(evt)=>this.props.onChangeUsername(evt.target.value)}/>
						<input name='password' type='password' value={this.props.password} placeholder='password' onChange={(evt)=>this.props.onChangePassword(evt.target.value)}/>
						<input onClick={(evt)=>this.submitHandler(evt)} type='submit' value='Sign in'/>
					</form>
					<div className='switch-type'>
						<span>No Account Yet?</span>
						<button onClick={()=>this.props.switchAction()}>Register</button>
					</div>
				</div>
			);
		} else {
			return (
				<div className='login-form'>
					<form>
						<h2>Sign up</h2>
						<input name='username' type='text' value={this.props.username} placeholder='username' onChange={(evt)=>this.props.onChangeUsername(evt.target.value)}/>
						<input name='password' type='password' value={this.props.password} placeholder='password' onChange={(evt)=>this.props.onChangePassword(evt.target.value)}/>
						<input name='repassword' type='password' value={this.state.repassword} placeholder='re-type password' onChange={(evt)=>this.setState({repassword: evt.target.value})}/>
						<input onClick={(evt)=>this.submitHandler(evt)} type='submit' value='Sign up'/>
					</form>
					<div className='switch-type'>
						<span>Already Have Account?</span>
						<button onClick={()=>this.props.switchAction()}>Sign In</button>
					</div>
				</div>
			);
		}
	}

	render() {
		// console.log(this.state.userListData);
		return (
			<div className='login-container run-rotate-scale-out-animation'>
				<div className='login-intro'>
					<img className='login-intro-items run-slider' alt='intro' src={intro}/>
					<span className='login-intro-items run-slider'>Welcome To Test</span>
				</div>
				{this.checkAccessType()}
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps)=>{
	return {
		username: state.login.username,
		password: state.login.password,
		remember: state.login.remember,
		switch_type: state.switch_type
	};
};

const mapDispatchToProps = (dispatch, ownProps)=>{
	return {
		switchAction: ()=>{
			dispatch({type: 'SWITCH-TYPE'});
		},
		onChangeUsername: (usernameInput)=>{
			dispatch({type: 'ON-CHANGE-USERNAME', username: usernameInput})
		},
		onChangePassword: (passwordInput)=>{
			dispatch({type: 'ON-CHANGE-PASSWORD', password: passwordInput})
		},
		onChangeRemember: ()=>{
			dispatch({type: 'ON-CHANGE-PASSWORD'})
		},
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);