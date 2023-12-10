import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Amortization from "./components/Amortization";
import Header from "./components/Header";
import Footer from "./components/Footer";

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
  const [amortizationSchedule, setAmortizationSchedule] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMortgageDetails({ ...mortgageDetails, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    if (!mortgageDetails.loan_amount || isNaN(mortgageDetails.loan_amount)) {
      newErrors.loan_amount = "Please enter a valid loan amount.";
      valid = false;
    }

    if (
      (mortgageDetails.down_payment !== "" &&
        isNaN(mortgageDetails.down_payment)) ||
      mortgageDetails.down_payment < 0
    ) {
      newErrors.down_payment = "Please enter a valid down payment.";
      valid = false;
    }

    if (
      !mortgageDetails.interest_rate ||
      isNaN(mortgageDetails.interest_rate)
    ) {
      newErrors.interest_rate = "Please enter a valid interest rate.";
      valid = false;
    }

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
        const remainingAmount =
          data.mortgage.total_amount - data.mortgage.monthly_payment;
        setResult(`Monthly Payment: $${data.mortgage.monthly_payment}\n`);
        setDjangoData(data.mortgage);
        if (data.mortgage.amortization_schedule) {
          setAmortizationSchedule(data.mortgage.amortization_schedule);
        }

        setFormSubmitted(true);
      } else {
        setResult(
          "No mortgage details available. Please check your input and try again."
        );
      }
    } catch (error) {
      console.error("Error:", error);
      setResult("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="App">
        <h2>Mortgage Payment Calculator</h2>
        <br />
        <form onSubmit={handleSubmit}>
          <table>
            <tbody>
              <tr>
                <td>
                  <label>Loan Amount:</label>
                </td>
                <td>
                  <input
                    type="number"
                    name="loan_amount"
                    value={mortgageDetails.loan_amount}
                    onChange={handleChange}
                    placeholder="$"
                  />
                  <p className="error">{errors.loan_amount}</p>
                </td>
              </tr>
              <tr>
                <td>
                  <label>Down Payment:</label>
                </td>
                <td>
                  <input
                    type="number"
                    name="down_payment"
                    value={mortgageDetails.down_payment}
                    onChange={handleChange}
                    placeholder="$"
                  />
                  <p className="error">{errors.down_payment}</p>
                </td>
              </tr>
              <tr>
                <td>
                  <label>Interest Rate:</label>
                </td>
                <td>
                  <input
                    type="number"
                    name="interest_rate"
                    value={mortgageDetails.interest_rate}
                    onChange={handleChange}
                    placeholder="%"
                  />
                  <p className="error">{errors.interest_rate}</p>
                </td>
              </tr>
              <tr>
                <td>
                  <label>Loan Term (in years):</label>
                </td>
                <td>
                  <input
                    type="number"
                    name="loan_term"
                    value={mortgageDetails.loan_term}
                    onChange={handleChange}
                  />
                  <p className="error">{errors.loan_term}</p>
                </td>
              </tr>
              <tr>
                <td colSpan={2} className="submitButton">
                  <button type="submit">Calculate</button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
        {loading && <p>Loading...</p>}
        {result && (
          <div className="result">
            <p className="monthly-payment">{result}</p>
            {djangoData && djangoData.mortgage && (
              <p>Monthly Payment: ${djangoData.mortgage.monthly_payment}</p>
            )}
          </div>
        )}
        {formSubmitted && amortizationSchedule.length > 0 && (
          <Amortization amortizationSchedule={amortizationSchedule} />
        )}
      </div>
      <Footer />
    </div>
  );
}

export default App;
