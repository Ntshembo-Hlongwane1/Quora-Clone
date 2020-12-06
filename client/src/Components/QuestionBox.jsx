import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import "../StyleSheet/QuestionBox.css";
import axios from "axios";
const QuestionBox = ({ profile, auth_status }) => {
  const [question, setQuestion] = useState("");

  const AskQuestion = async () => {
    const form_data = new FormData();
    form_data.append("question", question);

    const url = "http://localhost:5000/api/ask-question";

    try {
      const response = await axios.post(url, form_data, {
        withCredentials: true,
      });

      alert(response.data.msg);
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  return (
    <div className="QuestionBox">
      <div className="QuestionBox__user">
        <Avatar src={profile} alt="User Profile" />
        <h4 className="user__username">Junior</h4>
      </div>
      <div className="QuestionBox__inputField">
        <input
          type="text"
          placeholder="What is your question"
          className="QuestionBox__inputField"
          onChange={(e) => setQuestion(e.target.value)}
          value={question}
        />
        <button
          disabled={auth_status === true ? false : true}
          className="QuestionBox__btn"
          onClick={AskQuestion}
        >
          Ask Question
        </button>
      </div>
    </div>
  );
};

export default QuestionBox;
