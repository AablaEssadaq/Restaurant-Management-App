import api from '@/config/api';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../ui/card';

const Logistics = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  function handleClick(category){
    navigate('/logistics/subcategories', { state: { selectedCategory: category } })
  }

  const fetchCategories = useCallback(async () => {
    try {
      const response = await api.get("/api/logistics/");
      console.log("API Response:", response.data); // Vérifier la structure complète

      if (!response.data || !Array.isArray(response.data.categories)) {
        console.error("Invalid response format!", response.data);
        return;
      }
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Erreur de récupération des catégories:", error);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <div className='flex justify-center gap-8 px-10 py-4'>
      {categories.map((category, index) => (
        <Card key={index} onClick={() => handleClick(category)} className="w-[130px] h-[130px] flex text-center flex-col justify-center items-center cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out">
          <CardContent className='py-2'>
            <h6 className='text-lg'>{category.name}</h6> 
            <img src={category.image} alt={category.name} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default Logistics;
