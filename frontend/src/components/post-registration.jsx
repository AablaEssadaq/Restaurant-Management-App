import '@fortawesome/fontawesome-free/css/all.css';
import confirmedImg from '../assets/undraw_confirmed_f581.svg';
import { useEffect } from 'react';

export function PostRegistrationPage()  {

   useEffect(() => {
          document.body.className = "h-screen flex justify-center items-center bg-beige text-foreground"; // Ajoute une classe au body en l'accèdant via le DOM, pas directement
          return () => {
            document.body.className = ""; // Nettoie la classe en quittant la page
          };
        }, []);

    return (
        <>
        <div className="flex justify-center items-center gap-24">
          <div className="flex flex-col items-center gap-3">
            <div className='flex gap-3 justify-center items-center'>
            <i class="fa-regular fa-circle-check text-yellow text-2xl"></i>
            <h2 className="text-burgundy text-xl">Votre compte a été crée avec succès !</h2>
            </div>
            <h4 className="text-burgundy text-xl">Connectez-vous pour commencer</h4>
            <div className="flex gap-6 mt-6">
                <button className="bg-yellow hover:bg-orange text-beige px-3 py-1.5 rounded-md"> Se connecter</button>
                <button className="bg-burgundy hover:bg-burgundy-hover text-beige px-3 py-1.5 rounded-md">Page d'acceuil</button>
            </div>
          </div>
          <div className=' w-1/2 flex justify-end items-center'>
            <img src={confirmedImg} alt="Confirmed registration svg" className='w-1/2 h-1/2' />
          </div>
        </div>
        </>
    )
}

export default PostRegistrationPage;