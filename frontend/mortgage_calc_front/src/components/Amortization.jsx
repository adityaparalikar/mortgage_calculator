import React from "react";
import "./Amortization.css";
import ReactPaginate from "react-paginate";
import { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Amortization = ({ amortizationSchedule }) => {
  const itemsPerPage = 20;
  const [currentPage, setCurrentPage] = useState(0);
  const [activeTab, setActiveTab] = useState("table");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = amortizationSchedule.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const pageCount = Math.ceil(amortizationSchedule.length / itemsPerPage);
  const years = amortizationSchedule.map(
    (payment) => Math.floor(payment.payment_number / 12) + 1
  );

  return (
    <div>
      <h2>Amortization Schedule</h2>
      <div className="tab-buttons">
        <button
          onClick={() => handleTabClick("table")}
          className={activeTab === "table" ? "active" : ""}
        >
          Table
        </button>
        <button
          onClick={() => handleTabClick("graph")}
          className={activeTab === "graph" ? "active" : ""}
        >
          Graph
        </button>
      </div>
      {activeTab === "table" && (
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
            {currentItems.map((payment) => (
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
      )}
      {activeTab === "table" && pageCount > 1 && (
        <ReactPaginate
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName="pagination"
          activeClassName="active"
        />
      )}
      {activeTab === "graph" && (
        <div>
          <Line
            data={{
              labels: years,
              datasets: [
                {
                  label: "Total Principal Paid",
                  borderColor: "#4caf50",
                  data: amortizationSchedule.map(
                    (payment) => payment.total_principal
                  ),
                },
                {
                  label: "Total Interest Paid",
                  borderColor: "blue",
                  data: amortizationSchedule.map(
                    (payment) => payment.total_interest
                  ),
                },
                {
                  label: "Remaining Loan Balance",
                  borderColor: "orange",
                  data: amortizationSchedule.map(
                    (payment) => payment.remaining_amount
                  ),
                },
              ],
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Amortization;
