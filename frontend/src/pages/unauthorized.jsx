import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import accessDenied from '../assets/undraw_access-denied_yellow_krem.svg'
import { Button } from '@/components/ui/button';

const Unauthorized = () => {

   const navigate = useNavigate();

   useEffect(() => {
          document.body.className = "h-screen flex justify-center items-center bg-beige text-foreground"; // Ajoute une classe au body en l'accèdant via le DOM, pas directement
          return () => {
            document.body.className = ""; // Nettoie la classe en quittant la page
          };
        }, []);

  const toLogin = () => {
      navigate('/login');
  }

  return (
    <>

<div className='flex flex-col items-center justify-between gap-4'>
 <img src={accessDenied} alt="Expired session svg" className='w-1/3 h-1/3 mb-4'/>
 <h1 className='text-3xl text-burgundy font-medium mt-4'>Accès Interdit !</h1>
 <p className=' text-xl text-burgundy'>Connectez vous pour accèder à ce contenu</p>
 <Button className='bg-orange hover:bg-orange-hover' onClick={toLogin}>Se connecter</Button>
</div>
    </>
  )
}

export default Unauthorized;