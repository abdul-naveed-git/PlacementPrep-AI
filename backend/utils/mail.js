const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: `"Placement Prep AI" <${process.env.EMAIL}>`,
    to: email,
    subject: "Verify Your Email - Placement Prep AI",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px">
        <h2>Welcome to Placement Prep AI 🚀</h2>

        <p>Thank you for signing up.</p>

        <p>Please use the following verification code to complete your registration:</p>

        <div style="
          background:#f3f4f6;
          padding:20px;
          text-align:center;
          font-size:32px;
          font-weight:bold;
          letter-spacing:8px;
          border-radius:10px;
        ">
          ${otp}
        </div>

        <p style="margin-top:20px;">
          This code will expire in <b>10 minutes</b>.
        </p>

        <p>
          If you did not request this code, you can safely ignore this email.
        </p>

        <hr>

        <p style="color:#666;font-size:14px">
          Placement Prep AI <br>
          Practice DSA • Prepare Interviews • Crack Placements
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

const sendWelcomeEmail = async (email) => {
  const mailOptions = {
    from: `"Placement Prep AI" <${process.env.EMAIL}>`,
    to: email,
    subject: "Welcome to Placement Prep AI 🎉",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px">

        <h1>🎉 Welcome to Placement Prep AI!</h1>

        <p>Your account has been successfully created.</p>

        <p>
          You can now:
        </p>

        <ul>
          <li>✅ Track your DSA progress</li>
          <li>✅ Get personalized roadmaps</li>
          <li>✅ Analyze your skill gaps</li>
          <li>✅ Practice interview questions</li>
          <li>✅ Prepare for top companies</li>
        </ul>

        <p>
          We are excited to be part of your placement journey.
        </p>

        <p>
          Start preparing and keep coding! 🚀
        </p>

        <hr>

        <p style="color:#666;font-size:14px">
          Placement Prep AI Team
        </p>

      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendOTPEmail,
  sendWelcomeEmail,
};
