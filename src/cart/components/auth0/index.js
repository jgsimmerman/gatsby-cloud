import React from 'react';
//import Auth0Lock from 'auth0-lock'
import Auth0Lock from 'sweetleaf-lock';
import { Subscribe } from 'statable';

import settingsState from '../../state/settings';
import customerState from '../../state/customer';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
    this.show = this.show.bind(this);
  }

  componentDidMount() {
    if (settingsState.state.auth0ClientID && settingsState.state.auth0Domain) {
      this.lock = new Auth0Lock(
        settingsState.state.auth0ClientID,
        settingsState.state.auth0Domain,
        {
          autoclose: true,
          closeable: true,
          theme: {
            logo: ``,
            ...settingsState.state.auth0Theme,
          },
          languageDictionary: {
            title: `Log In`,
            emailPlaceholder: `something@youremail.com`,
          },
          ...settingsState.state.auth0Options,
        }
      );

      this.lock.on(`authenticated`, authResult => {
        // Use the token in authResult to getUserInfo() and save it to localStorage
        this.lock.getUserInfo(authResult.accessToken, (error, profile) => {
          if (error) {
            return;
          }
          localStorage.setItem(`accessToken`, authResult.accessToken); // eslint-disable-line no-undef
          localStorage.setItem(`profile`, JSON.stringify(profile)); // eslint-disable-line no-undef
          customerState.setState({ customer: profile });
        });
      });

      this.lock.checkSession({}, (err, authResult) => {
        if (err) {
          return;
        }
        this.lock.getUserInfo(authResult.accessToken, (error, profile) => {
          if (error) {
            return;
          }
          localStorage.setItem(`accessToken`, authResult.accessToken); // eslint-disable-line no-undef
          localStorage.setItem(`profile`, JSON.stringify(profile)); // eslint-disable-line no-undef
          customerState.setState({ customer: profile });
        });
      });
    }
  }

  show() {
    var options = {
      additionalSignUpFields: [
        {
          name: `address`,
          placeholder: `enter your address`,
          // The following properties are optional
          icon: `https://example.com/assests/address_icon.png`,
          prefill: `street 123`,
          validator: function(address) {
            return {
              valid: address.length >= 10,
              hint: `Must have 10 or more chars`, // optional
            };
          },
        },
        {
          name: `full_name`,
          placeholder: `Enter your full name`,
        },
      ],
    };
    this.lock.show(options);
  }

  logout() {
    this.lock.logout({
      returnTo: settingsState.state.auth0Logout,
    });
    localStorage.removeItem(`profile`); // eslint-disable-line no-undef
    customerState.reset();
  }

  render() {
    return (
      <Subscribe to={customerState}>
        {({ customer }) => (
          <div>
            {this.lock && !customer && (
              <button
                className="zygoteBtn zygoteBtnSmall zygoteSecondaryBtn"
                onClick={() => this.lock.show()}
              >
                Log in
              </button>
            )}
            {this.lock && customer && (
              <div>
                <div>
                  Welcome <span onClick={this.show}>{customer.nickname}</span>!
                </div>
                <button
                  className="zygoteBtn zygoteBtnSmall zygotePrimaryBtn"
                  onClick={() => this.logout()}
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        )}
      </Subscribe>
    );
  }
}

export class LoginPopup extends React.Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
    this.show = this.show.bind(this);
  }

  componentDidMount() {
    if (settingsState.state.auth0ClientID && settingsState.state.auth0Domain) {
      this.lock = new Auth0Lock(
        settingsState.state.auth0ClientID,
        settingsState.state.auth0Domain,
        {
          autoclose: true,
          closeable: true,
          theme: {
            logo: ``,
            ...settingsState.state.auth0Theme,
          },
          languageDictionary: {
            title: `Log In`,
            emailPlaceholder: `something@youremail.com`,
          },
          ...settingsState.state.auth0Options,
        }
      );

      this.lock.on(`authenticated`, authResult => {
        // Use the token in authResult to getUserInfo() and save it to localStorage
        this.lock.getUserInfo(authResult.accessToken, (error, profile) => {
          if (error) {
            return;
          }
          localStorage.setItem(`accessToken`, authResult.accessToken); // eslint-disable-line no-undef
          localStorage.setItem(`profile`, JSON.stringify(profile)); // eslint-disable-line no-undef
          customerState.setState({ customer: profile });
        });
      });

      this.lock.checkSession({}, (err, authResult) => {
        if (err) {
          return;
        }
        this.lock.getUserInfo(authResult.accessToken, (error, profile) => {
          if (error) {
            return;
          }
          localStorage.setItem(`accessToken`, authResult.accessToken); // eslint-disable-line no-undef
          localStorage.setItem(`profile`, JSON.stringify(profile)); // eslint-disable-line no-undef
          customerState.setState({ customer: profile });
        });
      });
    }
  }

  show() {
    var options = {
      additionalSignUpFields: [
        {
          name: `address`,
          placeholder: `enter your address`,
          // The following properties are optional
          icon: `https://example.com/assests/address_icon.png`,
          prefill: `street 123`,
          validator: function(address) {
            return {
              valid: address.length >= 10,
              hint: `Must have 10 or more chars`, // optional
            };
          },
        },
        {
          name: `full_name`,
          placeholder: `Enter your full name`,
        },
      ],
    };
    this.lock.show(options);
  }

  logout() {
    this.lock.logout({
      returnTo: settingsState.state.auth0Logout,
    });
    localStorage.removeItem(`profile`); // eslint-disable-line no-undef
    customerState.reset();
  }

  render() {
    return (
      <Subscribe to={customerState}>
        {({ customer }) => (
          <div>
            {this.lock && !customer && this.lock.show()}
            {this.lock && customer && (
              <div>
                <div>
                  Welcome <span onClick={this.show}>{customer.nickname}</span>!
                </div>
                <button
                  className="zygoteBtn zygoteBtnSmall zygotePrimaryBtn"
                  onClick={() => this.logout()}
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        )}
      </Subscribe>
    );
  }
}

/*
//////////////////////////////////
					HOOKS
/////////////////////////////////

*/

// import React, { useState, useEffect } from 'react'
// import Auth0Lock from 'auth0-lock'
// import { Subscribe } from 'statable'

// import settingsState from '../../state/settings'
// import customerState from '../../state/customer'

// const Login = (props) => {

//    //useEffect(() =>{
// 		if (settingsState.state.auth0ClientID && settingsState.state.auth0Domain) {
// 			const lock = new Auth0Lock(
// 				settingsState.state.auth0ClientID,
// 				settingsState.state.auth0Domain,
// 				{
// 					autoclose: true,
// 					closeable: true,
// 					theme: {
// 						logo: ``,
// 						...settingsState.state.auth0Theme,
// 					},
// 					languageDictionary: {
// 						title: `Log In`,
// 						emailPlaceholder: `something@youremail.com`,
// 					},
// 					...settingsState.state.auth0Options,
// 				}
// 			)

// 			lock.on(`authenticated`, (authResult) => {
// 				// Use the token in authResult to getUserInfo() and save it to localStorage
// 				lock.getUserInfo(authResult.accessToken, (error, profile) => {
// 					if (error) {
// 						return
// 					}
// 					localStorage.setItem(`accessToken`, authResult.accessToken) // eslint-disable-line no-undef
// 					localStorage.setItem(`profile`, JSON.stringify(profile)) // eslint-disable-line no-undef
// 					customerState.setState({ customer: profile })
// 				})
// 			})

// 			lock.checkSession({}, (err, authResult) => {
// 				if (err) {
// 					return
// 				}
// 				lock.getUserInfo(authResult.accessToken, (error, profile) => {
// 					if (error) {
// 						return
// 					}
// 					localStorage.setItem(`accessToken`, authResult.accessToken) // eslint-disable-line no-undef
// 					localStorage.setItem(`profile`, JSON.stringify(profile)) // eslint-disable-line no-undef
// 					customerState.setState({ customer: profile })
// 				})
// 			})
// 		//}
//   //	});

// 	const show = (props) => {
// 		var options = {
// 			additionalSignUpFields: [{
// 				name: `address`,
// 				placeholder: `enter your address`,
// 				// The following properties are optional
// 				icon: `https://example.com/assests/address_icon.png`,
// 				prefill: `street 123`,
// 				validator: function(address) {
// 					return {
// 						valid: address.length >= 10,
// 						hint: `Must have 10 or more chars`, // optional
// 					}
// 				},
// 			},
// 			{
// 				name: `full_name`,
// 				placeholder: `Enter your full name`,
// 			}],
// 		}
// 		lock.show(options)
// 	}

// 	const logout = () => {
// 		lock.logout({
// 			returnTo: settingsState.state.auth0Logout,
// 		})
// 		localStorage.removeItem(`profile`) // eslint-disable-line no-undef
// 		customerState.reset()
// 	}

// 		return (
// 			<Subscribe to={customerState}>
// 				{({ customer }) => (
// 					<div>
// 						{lock && !customer && <button className="zygoteBtn zygoteBtnSmall zygoteSecondaryBtn" onClick={() => show()}>Log in</button>}
// 						{lock && customer &&
// 							<div>
// 								<div>Welcome <span onClick={show}>{customer.nickname}</span>!</div>
// 								<button className="zygoteBtn zygoteBtnSmall zygotePrimaryBtn" onClick={() => logout()}>Log out</button>
// 							</div>
// 						}
// 					</div>
// 				)}
// 			</Subscribe>
// 		)
// 	}
// }

// export default Login
