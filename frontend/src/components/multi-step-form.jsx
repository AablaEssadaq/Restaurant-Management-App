
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


const formSchema = z.object({
  // Personal Information
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  telephone: z.string().min(8, "Le numéro de téléphone doit contenir au moins 8 chiffres"),
  pays: z.string().min(2, "Veuillez sélectionner un pays"),
  ville: z.string().min(2, "La ville doit contenir au moins 2 caractères"),
  
  // Restaurant Information
  nomRestaurant: z.string().min(2, "Le nom du restaurant doit contenir au moins 2 caractères"),
  logo: z.string(),
  restaurantPays: z.string().min(2, "Veuillez sélectionner un pays"),
  restaurantVille: z.string().min(2, "La ville doit contenir au moins 2 caractères"),
  adresse: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
  
  // Credentials
  email: z.string().email("Veuillez entrer une adresse email valide"),
  motDePasse: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  confirmerMotDePasse: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères")
}).refine((data) => data.motDePasse === data.confirmerMotDePasse, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmerMotDePasse"],
})

const steps = [
  { title: 'Informations personnelles', description: 'Vos coordonnées' },
  { title: 'Informations du restaurant', description: 'Détails du restaurant' },
  { title: 'Identifiants de connexion', description: 'Créer votre compte' }
]

export function MultiStepForm() {

  const [step, setStep] = useState(0)

   const [showPassword, setShowPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: '',
      prenom: '',
      telephone: '',
      pays: '',
      ville: '',
      nomRestaurant: '',
      logo: '',
      restaurantPays: '',
      restaurantVille: '',
      adresse: '',
      email: '',
      motDePasse: '',
      confirmerMotDePasse: ''
    }
  })

  const onSubmit = async (data) => {
    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      console.log('Form submitted:', data)
      // Handle final form submission here
      
      navigate('/postRegister');
    }
  }

  const handleNextStep = async () => {
    const fields = Object.keys(form.getValues())
    const currentStepFields = fields.slice(step * 5, (step + 1) * 5)
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
                  name="nom"
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
                  name="prenom"
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
                    name="pays"
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
                    name="ville"
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
                  name="telephone"
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
                  name="nomRestaurant"
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
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logo du restaurant</FormLabel>
                      <FormControl>
                        <Input {...field} type="file" accept="image/*" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                  <FormField
                    control={form.control}
                    name="restaurantPays"
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
                    name="restaurantVille"
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
                  name="adresse"
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
                name="motDePasse"
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
                  {showPassword ? <i class="fa-regular fa-eye-slash fa-lg"></i> : <i class="fa-regular fa-eye fa-lg"></i> }
                 </Button>
                  </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
                <FormField
                control={form.control}
                name="confirmerMotDePasse"
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
                  {showConfirmPassword ? <i class="fa-regular fa-eye-slash fa-lg"></i> : <i class="fa-regular fa-eye fa-lg"></i> }
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
  )
}

export default MultiStepForm;