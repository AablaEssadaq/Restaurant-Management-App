import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../../ui/card';

const SubCategories = () => {
  const location = useLocation();
  const { selectedCategory } = location.state || {};
  const navigate = useNavigate();

  function handleClick(name){
    navigate('/logistics/equipements', { state: { category: selectedCategory, subcategoryName: name } })
  }
  
  if (!selectedCategory) {
    return <div>No category selected</div>;
  }

  return (
      <div className="flex justify-center gap-8 px-10 py-4">
        {Array.isArray(selectedCategory.subcategories) && selectedCategory.subcategories.map((subcategory, index) => (
          <Card key={index} onClick={() => handleClick(subcategory.name)} className="w-[130px] h-[130px] flex flex-col text-center justify-center items-center cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out">
            <CardContent className='py-2'>
              <h6 className="text-lg">{subcategory.name}</h6>
              {subcategory.image && <img src={subcategory.image} alt={subcategory.name} />}
            </CardContent>
          </Card>
        ))}
      </div>
  );
};

export default SubCategories;