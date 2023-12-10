import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer py-4 p-2">
      <p>© 2023 Mortgage Calculator App</p>
      <div className="contact-info">
        <p>Email: adityaparalikar@mail.weber.edu</p>
        <p>Phone: +1 (801) 807-8728</p>
      </div>
      <div className="disclaimer">
        <p>
          Thank you for using my mortgage calculator. I hope to collaborate with
          you and see you in the future for more updates and features.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
