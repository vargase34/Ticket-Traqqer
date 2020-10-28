import React, { Component } from 'react';
import Login from './Login.js';
import SignUp from './SignUp.js';
import UserProfile from './UserProfile.js';
import './App.css';
import logo from './img/nyc_bg.jpg'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      //what needs to be done
      job: 'Home Page',
      loggedIn: false,
      count: 0,
      items: [],
      currentUser: '',
      currentPlate: '',
      fineAmount: 0,
    }

    let username = ''
    let plateno = ''
  }

  componentDidMount() {
    fetch('https://data.cityofnewyork.us/resource/nc67-uf89.json')
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            items: result
          })
        }
      )
  };

  goHome = () => {
    
    this.setState({
      job: 'Home Page'
    })
  }

  goProfile = () => {
    this.setState({
      job: 'User Profile'
    })
  }
  

  userLogin = (e) => {
    this.setState({
      job: 'User Login'
    })
  }

  login = async (e) => {
    e.preventDefault()
    let username = document.getElementById('loginUsername').value;
    let pass = document.getElementById('loginPassword').value;

    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        username: username,
        password: pass
      }),
    }).then((response) => {
      return response.json();
    })
    .then((myJson) => {
      let userInfo = JSON.parse(myJson.response)


      this.username = userInfo.username
      this.plateno = userInfo.plateno

    });

    this.setState({
      job: "User Profile",
      loggedIn: true
    })

  }

  userSignup = () => {
    this.setState({
      job: "User Signup"
    })
  }

  userLogout = () => {
    this.username = ''
    this.plateno = ''
    this.setState({
      job: "Home Page",
      loggedIn: false
    })
  }

  guest = () => {
    this.setState({
      job: 'Guest Page'
    })
  }

  checkResetUsername = () => {
    alert('button works')
  }

  usernameReset = () => {
    this.setState({
      job: 'Reset Username'
    })
  }
  passwordReset = () => {
    this.setState({
      job: 'Reset Password'
    })
  }

  checkSummonsNumberIndex = () => {
    let summonsNumber = document.getElementById('summonsNumber').value
    console.log(summonsNumber)
    let validNumber = false
    let index = 0
    for (let i = 0; i < this.state.items.length; i++) {
      if (this.state.items[i].summons_number == summonsNumber) {
        validNumber = true
        index = i
        break
      }
    }
    if (validNumber) {
      this.setState({
        count: index,
        job: 'Guest Page Search'
      })
    }
    else {
      alert('Invalid Summons Number, please try again.')
    }
  }

  // Check input to see if all inputs have been entered
  checkInput = (e) => {
    e.preventDefault()

    let username = document.getElementById('usernameField').value;
    let pass = document.getElementById('passwordField').value;
    let pass2 = document.getElementById('passwordField2').value;
    let platenum = document.getElementById('plateNumberField').value;

    this.username = username
    this.plateno = platenum

    let ticketCount = 0
    let ticketFine = 0
    if (username === '' || pass === '' || platenum === '') {
      alert("All fields must be filled")
      document.getElementById('passwordField').value = ''
      document.getElementById('passwordField2').value = ''
    }
    else if(pass != pass2){
      alert('Passwords do not match. Please try again')
      document.getElementById('passwordField').value = ''
      document.getElementById('passwordField2').value = ''
    }
    else {
      console.log(this.state.items[0].plate)
      console.log(this.state.items[1].plate)
      console.log(this.state.items[2].plate)
      console.log(this.state.items[3].plate)

      let validPlate = false
      for (let i = 0; i < this.state.items.length; i++) {
        if (this.state.items[i].plate === platenum) {
          validPlate = true
          ticketCount ++
          ticketFine = ticketFine + this.state.items[i].fine_amount
          console.log(ticketFine)
        }
      }
      if (validPlate) {
        const response = fetch('http://localhost:5000/addUser', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username: username,
            password: pass,
            plateno: platenum,
            fineAmount: ticketFine
          }),
        })
          .then((response) => {
            return response.json();
          })
          .then((myJson) => {
            console.log(myJson);
          });
          this.setState({
          job: 'User Profile',
          loggedIn: true
        })
      }
      else {
        alert('Invalid plate number, please try again.')
      }
    }

  }

  homeButtons = () => {
    if (this.state.loggedIn === false) {
      return (
        <div>
          <button onClick={this.userLogin}>Log In</button>
          <button onClick={this.guest}>Continue As Guest</button>
        </div>
      )
    }
  }



  navBar = () => {
    if (this.state.loggedIn === false) {
      return (
        <nav className="navbar">
          <ul>
            <li><a className='navlink leftlink' onClick={this.goHome}>TicketTraqqer</a></li>
          </ul>
          <ul>
            <li><a className='navlink' onClick={this.userLogin}>Log In</a></li>
            <li><a className='navlink' onClick={this.userSignup}>Sign Up</a></li>
          </ul>
        </nav>
      )
    }

    if (this.state.loggedIn === true) {
      return (
        <nav className="navbar">
          <ul>
            <li><a className='navlink leftlink' onClick={this.goHome}>TicketTraqqer</a></li>
          </ul>
          <ul>
            <li><a className='navlink' onClick={this.goProfile}>Account</a></li>
            <li><a className='navlink' onClick={this.userLogout}>Logout</a></li>
          </ul>
        </nav>
      )
    }
  }

  footer = () => {
    return (
      <div>
        {/* Phantom allows some space between page content and the footer */}
        <div className="phantom"/>
        <div className='footer'>
          <h1>Copyright &copy; 2020, TicketTraqqer, All Rights Reserved</h1>
          <h1>Project Created By Bryan Marchena, Emmanuel Vargas-Zapata, and Andrew Ohakam</h1>
        </div>
      </div>
    )
  }

  render() {
    let { job, count, currentUser, currentPlate, navBar, footer, homeButtons, fineAmount } = this.state
    navBar = this.navBar()
    footer = this.footer()
    homeButtons = this.homeButtons()

    if (job === 'Home Page') {
      return (
        <div className="App" >
          {navBar}
          <h1>Welcome to TicketTraqqer!</h1>
          <h3>Here at TicketTraqqer, we help users manage their parking and camera violation tickets with ease.<br /><br />
            These violations in New York City are public and we have made it simple for you to search for a specific ticket with just your summons number. You can even create an account to track your tickets and stay up to date on paying your fine.</h3>
            {homeButtons}
          {footer}
        </div>
      );
    }

    else if (job === 'Guest Page') {
      return (
        <div className="App" >
          {navBar}
          <h2>Enter Summons Number:</h2>
          <input type='text' id='summonsNumber'></input>
          <button onClick={this.checkSummonsNumberIndex}>Submit</button>
          {footer}
        </div>
      )
    }

    else if (job === 'Guest Page Search') {
      return (
        <div className="App" >
          {navBar}
          <h1>Summons Image</h1>
          <embed src={this.state.items[count].summons_image.url} width="600" height="500" type="application/pdf"></embed>
          <br />
          <button onClick={this.guest}>Another search</button>
          {footer}
        </div>
      )
    }

    else if (job === 'User Login') {
      return (
        <div className="userLogin">
          {navBar}
          <Login login={this.login} passwordReset={this.passwordReset} usernameReset={this.usernameReset} />
          {footer}
        </div>
      )
    }

    else if (job === "User Signup") {
      return (
        <div className="userLogin">{navBar}
          <SignUp checkInput={this.checkInput} />
          {footer}
        </div>

      )
    }

    else if (job === "Account Home") {
      return (
        <div className="App" >
          {navBar}
          <h1>Welcome {currentUser}</h1>
          <h2>Based on license plate {currentPlate}, you have {count} parking violation/s.</h2>
          <h2>In total, you were fined ${fineAmount}.</h2>
          <h1>Pay your fine <a href="https://secure24.ipayment.com/NYCPayments/nycbookmark.htm" target="_blank">here.</a></h1>
          {footer}
        </div>
      )
    }

    else if (job === "Change Password") {
      return (
        <div className="App" >
          {navBar}
          <h1>Change Password</h1>
          <label>Enter your username:</label>
          <input type='type' id='checkUsername'></input>
          <button onClick={this.checkUsername}>Submit</button>
          {footer}
        </div>
      )
    }

    else if (job === "Change Username") {
      return (
        <div className="App" >
          {navBar}
          <h1>Change Username</h1>
          <label>Enter your plate number:</label>
          <input type='type' id='checkPlates'></input>
          <br />
          <label>Enter your password:</label>
          <input type='type' id='checkPass'></input>
          <br />
          <button onClick={this.checkChangeUsername}>Submit</button>
          {footer}
        </div>
      )
    }

    else if(job==='User Profile'){
      return(
        <div className="App">
          {navBar}
          <UserProfile user={this.username} plate={this.plateno}/>
          {footer}
        </div>

      )
    }

    else if (job === 'Reset Password') {
      return (
        <div className='App'>
          {navBar}
          <label>Insert Username:</label>
          <br />
          <input type='text'></input>
          <br />
          <label>Insert License Plate:</label>
          <br />
          <input type='text'></input>
          <br />
          <button onClick={this.checkResetUsername}>Submit</button>
          {footer}
        </div>
      )
    }

  }

}
export default App;


//what is the app about?
//roles of each member
//share website wireframe img
//share any interesting code
