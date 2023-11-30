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
  const [errors, setErrors] = useState({});
  const [djangoData, setDjangoData] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMortgageDetails({ ...mortgageDetails, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    // Validate loan_amount
    if (!mortgageDetails.loan_amount || isNaN(mortgageDetails.loan_amount)) {
      newErrors.loan_amount = "Please enter a valid loan amount.";
      valid = false;
    }

    // Validate down_payment
    if (
      (mortgageDetails.down_payment !== "" &&
        isNaN(mortgageDetails.down_payment)) ||
      mortgageDetails.down_payment < 0
    ) {
      newErrors.down_payment = "Please enter a valid down payment.";
      valid = false;
    }

    // Validate interest_rate
    if (
      !mortgageDetails.interest_rate ||
      isNaN(mortgageDetails.interest_rate)
    ) {
      newErrors.interest_rate = "Please enter a valid interest rate.";
      valid = false;
    }

    // Validate loan_term
    if (!mortgageDetails.loan_term || isNaN(mortgageDetails.loan_term)) {
      newErrors.loan_term = "Please enter a valid loan term.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setResult("Please fill out all required fields with valid values.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mortgageDetails),
      });

      if (!response.ok) {
        throw new Error(
          "Failed to submit mortgage details. Please try again later."
        );
      }

      const data = await response.json();

      setMortgageDetails({
        loan_amount: "",
        down_payment: "",
        interest_rate: "",
        loan_term: "",
      });

      setErrors({});

      if (data && data.mortgage) {
        setResult(`Monthly Payment: $${data.mortgage.monthly_payment}\n`);
        setDjangoData(data.mortgage);
      } else {
        setResult(
          "No mortgage details available. Please check your input and try again."
        );
      }
    } catch (error) {
      console.error("Error:", error);
      setResult("An unexpected error occurred. Please try again later.");
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
          <p className="error">{errors.loan_amount}</p>
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
          <p className="error">{errors.down_payment}</p>
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
          <p className="error">{errors.interest_rate}</p>
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
          <p className="error">{errors.loan_term}</p>
        </label>
        <br />
        <button type="submit">Calculate</button>
      </form>
      {result && (
        <div>
          <p>{result}</p>
          {djangoData && djangoData.mortgage ? (
            <p>Monthly Payment: ${djangoData.mortgage.monthly_payment}</p>
          ) : (
            <p>Thanks for Visiting The Mortgage Calculator!</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
