import React from "react";
import "./Amortization.css";

const Amortization = ({ amortizationSchedule }) => {
  return (
    <div>
      <h2>Amortization Schedule</h2>
      <table>
        <thead>
          <tr>
            <th>Payment #</th>
            <th>Principal</th>
            <th>Interest</th>
            <th>Total Payment</th>
            <th>Remaining Amount</th>
          </tr>
        </thead>
        <tbody>
          {amortizationSchedule.map((payment) => (
            <tr key={payment.payment_number}>
              <td>{payment.payment_number}</td>
              <td>${payment.principal}</td>
              <td>${payment.interest}</td>
              <td>${payment.total_payment}</td>
              <td>${payment.remaining_amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Amortization;
