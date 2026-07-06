import jwt from "jsonwebtoken";

export default function(req,res,next){

    const auth=req.headers.authorization;

    if(!auth){

        return res.status(401).json({

            success:false

        });

    }

    const token=auth.split(" ")[1];

    try{

        req.user=jwt.verify(

            token,

            process.env.JWT_SECRET

        );

        next();

    }

    catch{

        return res.status(401).json({

            success:false

        });

    }

}