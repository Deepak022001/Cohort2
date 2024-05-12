import express from 'express';

const app = express();

const PORT = 3000;
app.use(express.json());

const otpStore: Record<string, string> = {};
// 1st end point
app.post('/generate-otp', (req, res) => {
  const email = req.body.email;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }
  const otp = Math.floor(10000 + Math.random() * 900000).toString();
  otpStore[email] = otp;
  console.log(`OTP for ${email}:${otp}`);
  res.status(200).json({ message: 'OTP generated and logged' });
});

// end point to reset password
app.post('/reset-password', (req, res) => {
  const { email, otp, newpassword } = req.body;
  if (!email || !otp || !newpassword) {
    return res
      .status(400)
      .json({ message: 'Email,Otp,and new password are requried' });
  }
  if (otpStore[email] === otp) {
    console.log(`Password for ${email} has been sent to :${newpassword}`);
    delete otpStore[email];
    res.status(200).json({ message: 'Password has been reset successfully' });
  } else {
    res.status(401).json({ message: 'Invalid otp' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://loclahost:${PORT}`);
});
