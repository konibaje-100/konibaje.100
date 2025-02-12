import { v2 as cloudinary } from "cloudinary"
import productModel from "../models/productModel.js"
import essentialsModel from "../models/essentialsModel.js"

// function for add product
const addProduct = async (req,res) => {
    try {
        
        const { name, description, price, category, subCategory, sizes, bestseller } = req.body

        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]
        
        const images =[image1,image2,image3,image4].filter((item)=> item != undefined)

        let imagesUrl = await Promise.all(
            images.map(async (item)=>{
                let result = await cloudinary.uploader.upload(item.path,{resource_type:'image'});
                return result.secure_url
            })
        )

        const productData = {
            name,
            description,
            category,
            price: Number(price),
            subCategory,
            bestseller: bestseller === "true" ? true : false,
            sizes: JSON.parse(sizes),
            image: imagesUrl,
            date: Date.now()
        }

        console.log(productData);
        
        const product = new productModel(productData);
        await product.save()
        
        res.json({success:true,message:"Product Added"})
    } catch (error) {
        console.log(error)
        res.json({success:false,messsage:error.messsage})
    }

}
const addEssentials = async (req,res) => {
    try {
        
        const { name, description, price, category, subCategory, sizes, bestseller } = req.body

        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]
        
        const images =[image1,image2,image3,image4].filter((item)=> item != undefined)

        let imagesUrl = await Promise.all(
            images.map(async (item)=>{
                let result = await cloudinary.uploader.upload(item.path,{resource_type:'image'});
                return result.secure_url
            })
        )

        const productData = {
            name,
            description,
            category,
            price: Number(price),
            subCategory,
            bestseller: bestseller === "true" ? true : false,
            sizes: JSON.parse(sizes),
            image: imagesUrl,
            date: Date.now()
        }

        console.log(productData);
        
        const essentials = new essentialsModel(productData);
        await essentials.save()
        
        res.json({success:true,message:"Product Added"})
    } catch (error) {
        console.log(error)
        res.json({success:false,messsage:error.messsage})
    }

}


// function for list product
const listProducts = async (req,res) => {
    
    try {
        const products = await productModel.find({});
        const essentials = await essentialsModel.find({});
        res.json({success:true,products,essentials})
    } catch (error) {
        console.log(error)
        res.json({success:false,messsage:error.messsage})
    }

}
const listEssentials = async (req,res) => {
    
    try {
        const essentials = await essentialsModel.find({});
        res.json({success:true,essentials})
    } catch (error) {
        console.log(error)
        res.json({success:false,messsage:error.messsage})
    }

}


// function for removing product
const removeProduct = async (req,res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id)
        await essentialsModel.findByIdAndDelete(req.body.id)
        res.json({success:true,message:"Product Removed"})
    } catch (error) {
        console.log(error)
        res.json({success:false,messsage:error.messsage})
    }
}


// function for single product info
const singleProduct = async (req,res) => {
    try {
        
        const {productId} = req.body
        const product = await productModel.findById(productId)
        const essentials = await essentialsModel.findById(productId)
        res.json({success:true,product,essentials})
    } catch (error) {
        console.log(error)
        res.json({success:false,messsage:error.messsage})
    }   
}


export {listProducts,addProduct,removeProduct,singleProduct,addEssentials,listEssentials}