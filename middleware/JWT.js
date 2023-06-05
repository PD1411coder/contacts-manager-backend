const jwt = require("jsonwebtoken");
const JWT_SECRET = "iamagoodb$oy"
const User = require("../models/User");

const fetchuser = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];

        jwt.verify(token, JWT_SECRET, async (err, payload) => {
            if(err){
                console.log(err)
                return res.status(401).json({
                    error: "Unauthorized"
                });
            }

            try {
                console.log(payload);
                const user = await User.findOne({_id: payload._id}).select("-password");
                req.user = user;
                next();
            } catch (err) {
                console.log(err);
              
            }
            
            }
        );
    } else {
        return res.status(403).json({
            error: "Forbidden"
        });
    }
}
module.exports = fetchuser;
