import React, { useEffect, useState } from 'react'

import loginImg from '../assets/undraw_login_wqkt.svg';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {Card, CardContent, CardFooter,} from "@/components/ui/card"
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast"
import axios from 'axios';

 



const apiUrl = import.meta.env.VITE_URL_BASE;


const formSchema = z.object({
    email: z.string().email("Veuillez entrer une adresse email valide"),
    password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
})

const LoginPage = () => {

    const navigate = useNavigate();

    const { toast } = useToast()

    useEffect(() => {
        document.body.className = "h-screen flex justify-center items-center bg-beige text-foreground"; // Ajoute une classe au body en l'accèdant via le DOM, pas directement
        return () => {
          document.body.className = ""; // Nettoie la classe en quittant la page
        };
      }, []);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
          email: "",
          password:"",
        },
      })

      const [showPassword, setShowPassword] = useState(false);


    const  onSubmit = async(values) =>  {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log('Form submitted successfully:', values);

        try {
          const response = await axios.post(`${apiUrl}/api/auth/login`, values);
          // Handle successful response
          if (response.data.accessToken) {
          // Navigate to the dashboard page 
          navigate('/dashboard');
         }
          
        } catch (error) {
          
          console.error('Error submitting form:', error.response?.data || error.message);
          
          toast({
            variant: "destructive",
            title: "Erreur",
            description: `${error.response?.data?.message ||
            "Une erreur s'est produite lors de la soumission du formulaire."}`,
          })

          {/* setAlertMessage(
            error.response?.data?.message ||
            "Une erreur s'est produite lors de la soumission du formulaire."
          ); */}
        }
      }


  return (
      <div className='flex justify-center items-center gap-4'>
      <div className='w-1/2 flex flex-col items-center gap-8'>

      <h1 className='text-burgundy text-3xl font-medium'>Connexion</h1>

      <Card className="w-[350px] py-3">
      <CardContent>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="example@gmail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mot de passe</FormLabel>
              <FormControl>
              <div className="relative">
             <Input
             id="password"
             type={showPassword ? "text" : "password"}
             placeholder="Enter your password"
             className="pr-10"
             {...field}
             />
             <Button
             type="button"
             variant="ghost"
             size="sm"
             className="absolute right-2 top-1/2 transform -translate-y-1/2"
             onClick={() => setShowPassword(!showPassword)}
              >
              {showPassword ? <i className="fa-regular fa-eye-slash fa-lg"></i> : <i className="fa-regular fa-eye fa-lg"></i> }
             </Button>
              </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-yellow w-full hover:bg-orange ">Se connecter</Button>
      </form>
    </Form>
      </CardContent>
      <CardFooter>
        <a href="#" className='text-burgundy underline hover:text-burgundy-hover'>Mot de passe oublié ?</a>
      </CardFooter>
      </Card>

      </div>
      <div className='w-1/2 flex justify-center items-start'>
        <img src={loginImg} alt="Login image" className=' w-[80%]' />
      </div>
    </div> 
  )
}

export default LoginPage;


