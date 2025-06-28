export function generateOtp() {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < 6; ++i) {
    const randomIdx = Math.floor(Math.random() * 10);
    otp += digits[randomIdx];
  }
  return otp;
}
