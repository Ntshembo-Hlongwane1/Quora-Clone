import React, { useEffect, useState } from "react";
import "./App.css";
import Header from "./Components/Header";
import QuestionBox from "./Components/QuestionBox";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SignUp from "./Components/SignUp";
import SignIn from "./Components/SignIn";
import axios from "axios";
import QuestionList from "./Components/QuestionList";
const App = () => {
  const [auth_status, setAuthStatus] = useState(false);
  const [profile, setImage] = useState(null);

  useEffect(() => {
    const url = "http://localhost:5000/api/isUserLoggedIn";
    axios
      .get(url, { withCredentials: true })
      .then((response) => {
        console.log(response);
        setAuthStatus(response.data.auth_status);
        setImage(response.data.profileImage);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <Router className="App">
      <Header profile={profile} />
      <Switch>
        <Route path="/user-signup">
          <SignUp />
        </Route>
        <Route path="/user-signin">
          <SignIn />
        </Route>
        <Route path="/">
          <QuestionBox auth_status={auth_status} profile={profile} />
          <QuestionList />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
