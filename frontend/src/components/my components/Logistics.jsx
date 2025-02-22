import api from '@/config/api';
import React, { useCallback, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from 'recharts';

const Logistics = () => {

  const [categories,setCategories] = useState([])

     // Move fetchSuppliers to useCallback to prevent recreation
     const fetchCategories = useCallback(async () => {
      await api.get("/api/logistics/")
     .then((response) => {
      setCategories(response.data.categories);
    //  dispatch(setSuppliers({ suppliers: response.data.suppliers }));
    console.log(response.data.categories)  
     })
      .catch((error)=>{
        console.error("Erreur de récupération des catégories:", error);
      })
      
    }, []); // Dependencies for useCallback
  
    useEffect(() => {
        fetchCategories()    
    }, [, fetchCategories])


  return (
    <>
    <div className='flex justify-center gap-8 border px-10 py-4'>
    {categories.map((category,index) => { return (
    <Card key={index} className="w-[130px] h-[130px] flex flex-col justify-center items-center cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out">
     <CardContent>
      <h6 className='text-lg'>{category.name} </h6> 
      <img src={category.image}/>
     </CardContent>
    </Card>)
    } )}
    </div>
    </>
  )
}

export default Logistics