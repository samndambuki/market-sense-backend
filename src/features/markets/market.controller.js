import prisma from "../../config/prisma.js";

export const getMarkets = async(req,res)=>{
    try{

        const markets = await prisma.market.findMany();

        res.json(markets);

    } catch(error){

        console.error("Error fetching markets:",error);

        res.status(500).json({
            message:"Failed to fetch markets"
        })
    }
}

export const getMarketById = async(req,res)=>{
    try {

        const id = Number(req.params.id);

        if(!Number.isInteger(id) || id<0){
            return res.status(400).json({
                message:"Invalid Market ID"
            })
        }

        const market = await prisma.market.findUnique({
            where:{id}
        })  


        if(!market){
            return res.status(404).json({
                message:"Market Not Found"
            })
        }

        res.json(market);

    }   catch(error){

        console.error("Error fetching market:",error);

        res.status(500).json({
            message:"Failed to fetch market"
        })
    }
}

export const createMarket = async(req,res)=>{
     try{

        const {name,category,region,growthRate,description,marketSize,riskLevel} = req.body;

        const market = await prisma.market.create({
           data:{
            name,
            category,
            region,
            growthRate:Number(growthRate),
           description,
           marketSize,
           riskLevel 
           } 
        })

        res.status(201).json(market);
     } catch(error){

        console.error("Error creating market:",error);

        res.status(500).json({
            message:"Failed to create market"
        })
     }
}