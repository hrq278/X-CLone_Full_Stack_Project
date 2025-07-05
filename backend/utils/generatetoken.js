import jwt from "jsonwebtoken"

export const generateTokenAndSetCookie = (userId, res)=>{
    const token = jwt.sign({ userId }, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_SECRET_EXPIRY
    })

    res.cookie("jwt",token,{
        maxAge: 15*24*60*60*1000,
        httpOnly:true,
        sameSite:"None",
        secure:process.env.NODE_ENV !=="development"
    })
 }
//  res.cookie("jwt", token, {
//   maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
//   httpOnly: true,
//   sameSite: "None",               // ✅ allow cross-origin cookies
//   secure: process.env.NODE_ENV !== "development" // ✅ HTTPS only in production
// });
