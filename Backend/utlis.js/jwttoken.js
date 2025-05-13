import ms from "ms";

export const generateToken = (user, message, statusCode, res) => {
  const token = user.generateJsonWebToken();

  const expiresIn = process.env.JWT_SECRET_KEY_EXPIRES || "1d"; //

  const expirationTime = new Date(Date.now() + ms(expiresIn));

  res
    .status(statusCode)
    .cookie("token", token, {
      expires: expirationTime,
      httpOnly: true,
    })
    .json({
      success: true,
      message,
      token,
      user,
    });
};
