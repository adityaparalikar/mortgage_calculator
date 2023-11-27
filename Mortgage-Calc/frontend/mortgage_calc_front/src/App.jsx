import { useState } from "react";
import "./App.css";

function App() {
  const [mortgageDetails, setMortgageDetails] = useState({
    loan_amount: "",
    down_payment: "",
    interest_rate: "",
    loan_term: "",
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMortgageDetails({ ...mortgageDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/api/mortgage/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mortgageDetails),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response:", data);
      setResult(data.message);
    } catch (error) {
      console.error("Error:", error);
      setResult("Error submitting mortgage details.");
    }
  };

  return (
    <div className="App">
      <h1>Mortgage Payment Calculator</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Loan Amount:
          <input
            type="number"
            name="loan_amount"
            value={mortgageDetails.loan_amount}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Down Payment:
          <input
            type="number"
            name="down_payment"
            value={mortgageDetails.down_payment}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Interest Rate:
          <input
            type="number"
            name="interest_rate"
            value={mortgageDetails.interest_rate}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Loan Term (in years):
          <input
            type="number"
            name="loan_term"
            value={mortgageDetails.loan_term}
            onChange={handleChange}
          />
        </label>
        <br />
        <button type="submit">Calculate</button>
      </form>
      {result && (
        <div>
          <p>{result}</p>
          {response.mortgage ? (
            <p>Monthly Payment: ${response.mortgage.monthly_payment}</p>
          ) : (
            <p>No mortgage details available</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
