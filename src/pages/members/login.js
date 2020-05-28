import React from 'react';
import useMagicLink from 'use-magic-link';
import { MembersArea } from 'components';
import Skeleton from 'react-loading-skeleton';

const initialFormData = Object.freeze({
  email: '',
});

export default function Login() {
  const auth = useMagicLink('pk_test_8659A943739758FA');
  const [formData, updateFormData] = React.useState(initialFormData);

  const handleChange = e => {
    updateFormData({
      ...formData,

      // Trimming any whitespace
      [e.target.name]: e.target.value.trim(),
    });
  };

  function loginNow(e) {
    //const email = prompt('Enter your email');
    const email = formData.email;
    auth.login(email);
  }

  function getContent() {
    if (auth.loading || auth.loggingIn || auth.loggingOut) {
      return <p>{<Skeleton count={4} />}</p>;
    }

    if (auth.loggedIn) {
      return (
        <div>
          <MembersArea />
          <br />
          <button onClick={() => auth.logout()}>Logout</button>
        </div>
      );
    }

    return (
      <div>
        <label>
          Enter your email
          <input name="email" onChange={handleChange} />
        </label>
        <button onClick={loginNow}>Submit</button>
      </div>
    );
  }

  return (
    <div className="container">
      <main>
        <h1>Sweet Leaf Members Area</h1>
        <div className="content">{getContent()}</div>
      </main>

      <style jsx>{`
        .container {
          text-align: center;
          font-family: Arial;
        }
        .content {
        }
      `}</style>
    </div>
  );
}
