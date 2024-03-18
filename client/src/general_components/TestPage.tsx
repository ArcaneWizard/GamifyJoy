import {useNavigate} from "react-router-dom";

const TestPage = () => {
  const navigate = useNavigate();

  const ReturnToHomePage = () => {
    navigate("/");
  };

  return (
    <div>
      <h2>Another</h2>
      <button className="btn btn-dark" onClick={() => ReturnToHomePage()}>
        Hello
      </button>
    </div>
  );
};

export default TestPage;
