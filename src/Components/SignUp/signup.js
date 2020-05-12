import React, { Component } from "react";
import { Link } from "react-router-dom";
import Title from '../Basic-Components/title';
import TextBox from '../Basic-Components/textbox';
import Button from '../Basic-Components/button';
import Popup from '../Basic-Components/popup';
import logo from '../../assets/images/login.jpg';

class SignUp extends Component{
    state = {
        name:'',
        email: '',
        password: '',
        errorMsg: null,
        popup: false,
        loading:true,
        waiting:false
    }

    onChangeHandler = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    onClosePopup = () => {
        this.setState({
            popup: false
        })
    }

    onClickHandler = async()=>{
        let name = this.state.name;
        let email = this.state.email;
        let password = this.state.password;
        if(name && email && password){
          //call the register api
          this.setState({
              waiting:true
          })
          let url = 'https://us-central1-userauthentication-96039.cloudfunctions.net/register';
          let registerUser = await fetch(url, {
              method: 'post',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                   "name":name,
                  "email": email,
                  "password": password
              })
          })
          let result = await registerUser.json();
          if(result.status === 200){
              this.setState({
                  loading:false,
                  popup:true,
                  errorMsg:"Registered Successfully"
              })
          }else{
              this.setState({
                  popup:true,
                  loading:false,
                  errorMsg:result.message || 'Registration Unsuccessfull'
              })
          }
        }else{
            if (!email) {
                this.setState({
                    popup: true,
                    loading:false,
                    errorMsg: "Email is Missing."
                })
            } else if(!password){
                this.setState({
                    popup: true,
                    loading:false,
                    errorMsg: "Password is Missing"
                })
            }else{
                this.setState({
                    popup: true,
                    loading:false,
                    errorMsg: "Name is Missing"
                })
            }
        }
    }
    render(){
        let popup = null;
        if (this.state.popup && this.state.errorMsg) {
            popup = <Popup message={this.state.errorMsg} onClosePopup={this.onClosePopup} />
        }
        let loadingData= null;
        if(this.state.waiting && this.state.loading){
            loadingData = <div style = {{"margin-left":"10px"}}><center><h3>... LOADING, PLEASE WAIT</h3></center></div>
        }
        return(
            <div>
               <Title name={"User Signup"}/>
               {loadingData}
                <div className="form">
                    <img className="formImg" src={logo} alt="Login User" />
                    <TextBox name={"name"} onChangeHandler={this.onChangeHandler} />
                    <TextBox name={"email"} onChangeHandler={this.onChangeHandler} />
                    <TextBox name={"password"} type={"password"} onChangeHandler={this.onChangeHandler} />
                    <Button name={"Log In"} onClickHandler={this.onClickHandler} />
                    <p className="signupLink">Do you want to login ? <Link to="./">Login</Link></p>
                 {popup}
                </div>
            </div>
        )
    }
}

export default SignUp;