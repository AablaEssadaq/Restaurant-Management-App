
import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ProgressSteps } from './progress-steps'
import { useNavigate } from 'react-router-dom'
import { useToast } from "@/hooks/use-toast"
import axios from 'axios';


const apiUrl = import.meta.env.VITE_URL_BASE;

const formSchema = z.object({
  // Personal Information
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  phoneNumber: z.string().min(8, "Le numéro de téléphone doit contenir au moins 8 chiffres"),
  country: z.string().min(2, "Veuillez sélectionner un pays"),
  city: z.string().min(2, "La ville doit contenir au moins 2 caractères"),
  avatar: z.any().optional(),
  
  // Restaurant Information
  restaurantName: z.string().min(2, "Le nom du restaurant doit contenir au moins 2 caractères"),
  logo: z.any().optional(),
  restaurantCountry: z.string().min(2, "Veuillez sélectionner un pays"),
  restaurantCity: z.string().min(2, "La ville doit contenir au moins 2 caractères"),
  restaurantStreet: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
  
  // Credentials
  email: z.string().email("Veuillez entrer une adresse email valide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  confirmPassword: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
})

const steps = [
  { title: 'Informations personnelles', description: 'Vos coordonnées' },
  { title: 'Informations du restaurant', description: 'Détails du restaurant' },
  { title: 'Identifiants de connexion', description: 'Créer votre compte' }
]

export function MultiStepForm() {

  const [step, setStep] = useState(0)

  const [avatarFile, setAvatarFile] = useState(null);
  const [logoFile, setLogoFile] = useState(null);


  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const { toast } = useToast()
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lastName: '',
      firstName: '',
      phoneNumber: '',
      country: '',
      city: '',
      restaurantName: '',
      logo: '',
      restaurantCountry: '',
      restaurantCity: '',
      restaurantStreet: '',
      avatar:'',
      email: '',
      password: '',
      confirmPassword: ''
    }
  })


  const onSubmit = async (data) => {
    const formData = new FormData();
  
    // Ajouter les autres champs
    Object.keys(data).forEach((key) => {
      if (key !== "avatar" && key !== "logo") { // Exclure les fichiers
        formData.append(key, data[key]);
      }
    });
  
    // Ajouter les fichiers au FormData
    if (avatarFile) formData.append("avatar", avatarFile);
    if (logoFile) formData.append("logo", logoFile);
  
    try {
      const response = await axios.post(`${apiUrl}/api/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Formulaire soumis avec succès:", response.data);
      navigate("/postRegister");
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error.response?.data || error.message);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.response?.data?.message || "Une erreur s'est produite.",
      });
    }
  };
  

  const fieldsPerStep = [
    ["firstName", "lastName", "phoneNumber", "country", "city"], // Step 0
    ["restaurantName", "restaurantCity", "restaurantCountry", "restaurantStreet"], // Step 1
    ["email", "password", "confirmPassword"] // Step 2
  ];

  function getCurrentStepFields(step) {
    return fieldsPerStep[step] || []; // Return fields for the current step or an empty array if the step is out of bounds
  }

  const handleNextStep = async () => {
    
    const currentStepFields = getCurrentStepFields(step);
    console.log(currentStepFields);
    const isStepValid = await form.trigger(currentStepFields)
    
    if (isStepValid) {
      if (step < steps.length - 1) {
        setStep(step + 1)
      } else {
        await form.handleSubmit(onSubmit)()
      }
    }
  }

  return (
    <>
    <Card className="relative w-full max-w-2xl mx-auto my-5">
      <CardHeader className="space-y-2 border-b border-border/50 pb-8 pt-6 text-center">
        <CardTitle className="text-2xl font-bold text-[#8B1F41] my-2">Créer votre compte</CardTitle>
        <ProgressSteps currentStep={step} steps={steps} />
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {step === 0 && (
              <>
              <div className='grid grid-cols-2 gap-4'>
              <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prénom</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pays</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="france">France</SelectItem>
                            <SelectItem value="belgique">Belgique</SelectItem>
                            <SelectItem value="suisse">Suisse</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ville</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone</FormLabel>
                      <FormControl>
                        <Input {...field} type="tel" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                </div>
                
              </>
            )}

            {step === 1 && (
              <>
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name="restaurantName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom du restaurant</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              <FormField
               control={form.control}
               name="logo"
               render={() => (
              <FormItem>
              <FormLabel>Logo du restaurant</FormLabel>
             <FormControl>
             <Input
               type="file"
               accept="image/*"
               onChange={(e) => setLogoFile(e.target.files[0])} // Mise à jour du state
             />
            </FormControl>
            <FormMessage />
            </FormItem>
             )}
            />
                  <FormField
                    control={form.control}
                    name="restaurantCountry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pays</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="france">France</SelectItem>
                            <SelectItem value="belgique">Belgique</SelectItem>
                            <SelectItem value="suisse">Suisse</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="restaurantCity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ville</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                <FormField
                  control={form.control}
                  name="restaurantStreet"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresse</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                </div>
              </>
            )}

            {step === 2 && (
              <>
              <div className='grid grid-cols-1 gap-4'>
              <FormField
               control={form.control}
               name="avatar"
               render={() => (
              <FormItem className="w-1/2">
              <FormLabel>Avatar de l'utilisateur</FormLabel>
              <FormControl>
              <Input
               type="file"
               accept="image/*"
               onChange={(e) => setAvatarFile(e.target.files[0])} // Mise à jour du state
              />
             </FormControl>
             <FormMessage />
             </FormItem>
              )}
            />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                  <div className="relative">
                  <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="pr-10"
                  {...field}
                  />
                  <Button
                  type="button"
                  variant="ghost"
                  siz
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
                <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel> Confirmer le mot de passe</FormLabel>
                  <FormControl>
                  <div className="relative">
                  <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  className="pr-10"
                  {...field}
                  />
                  <Button
                  type="button"
                  variant="ghost"
                  siz
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                  {showConfirmPassword ? <i className="fa-regular fa-eye-slash fa-lg"></i> : <i className="fa-regular fa-eye fa-lg"></i> }
                 </Button>
                  </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
                </div>
              </>
            )}

            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(step - 1)}
                disabled={step === 0}
              >
                Précédent
              </Button>
              <Button 
                type="button" 
                className="bg-[#F5A623] hover:bg-[#F5A623]/90"
                onClick={handleNextStep}
              >
                {step === steps.length - 1 ? 'Valider' : 'Suivant'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
    
    </>
   
  )
}

export default MultiStepForm;