const nodemailer = require("nodemailer");

const sendEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });

  await transporter.sendMail({
    from: "PoliceData",
    to: email,
    subject: "Email verification OTP",
    html: `<table width="100%" border="0" cellspacing="0" cellpadding="0">
<tr>
<td align="center" valign="middle" style="padding:20px 0;">

    <table width="420" border="0" cellspacing="0" cellpadding="0"
    style="
        background:#ffffff;
        padding:40px;
        border-radius:12px;
        text-align:center;
        border:1px solid #e4e6eb;
        box-shadow:0 8px 20px rgba(0,0,0,0.05);
    ">


        <tr>
            <td align="center">

                <h2 style="margin-bottom:15px;color:#222;font-weight:600">
                    OTP Verification
                </h2>

                <p style="color:#555;font-size:15px;margin-bottom:25px">
                    Here is your One Time Password
                </p>

                <div style="font-size:30px;font-weight:bold;letter-spacing:6px;padding:15px 25px;background:#f1f3f5;border-radius:8px;color:#111;border:1px solid #dcdcdc;display:inline-block;margin-bottom:20px">
                    ${otp}
                </div>

                <p style="font-size:14px;color:#777">
                    This OTP is valid for 5 minutes.
                </p>

                <p style="font-size:13px;color:#999">
                    Do not share this code with anyone.
                </p>

            </td>
        </tr>
    </table>

</td>
</tr>
</table>

`,
  });
};

module.exports = sendEmail;
