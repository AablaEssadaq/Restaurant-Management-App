"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import { z } from "zod"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { toast } from "@/hooks/use-toast"
import api from "@/config/api"
import { MapPin, Phone, Mail, Building, Edit } from "lucide-react"

const OwnerProfile = () => {
  const ownerSchema = z.object({
    lastName: z.string().min(2, "Le nom est trop court"),
    firstName: z.string().min(2, "Le prénom est trop court"),
    phoneNumber: z.string().regex(/^0[567][0-9]{8}$/, "Numéro invalide"),
    email: z.string().email("Email invalide"),
    country: z.string().min(2, "Sélectionnez un pays"),
    city: z.string().min(1, "Sélectionnez une ville"),
    avatar: z.any().optional(),
  })

  const restaurantSchema = z.object({
    restaurantName: z.string().min(2, "Le nom du restaurant doit contenir au moins 2 caractères"),
    logo: z.any().optional(),
    restaurantCountry: z.string().min(2, "Veuillez sélectionner un pays"),
    restaurantCity: z.string().min(2, "La ville doit contenir au moins 2 caractères"),
    restaurantStreet: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
  })

  const owner = useSelector((state) => state.auth?.user) || {}
  const restaurant = useSelector((state) => state.auth?.restaurant) || {}

  const [isEditMode, setIsEditMode] = useState(false)
  const [ownerEditFormData, setOwnerEditFormData] = useState({
    lastName: owner?.lastName || "",
    firstName: owner?.firstName || "",
    phoneNumber: owner?.phoneNumber || "",
    email: owner?.email || "",
    country: owner?.address?.country || "",
    city: owner?.address?.city || "",
    avatar: owner?.avatar || "",
  })
  const [restaurantEditFormData, setRestaurantEditFormData] = useState({
    restaurantName: restaurant?.name || "",
    restaurantCountry: restaurant?.address?.country || "",
    restaurantCity: restaurant?.address?.city || "",
    restaurantStreet: restaurant?.address?.street || "",
    logo: restaurant?.logo || "",
  })

  const [open, setOpen] = useState(false)
  const [restaurantOpen, setRestaurantOpen] = useState(false)
  const [avatarFile, setAvatarFile] = useState(null)
  const [logoFile, setLogoFile] = useState(null)

  const ownerForm = useForm({
    resolver: zodResolver(ownerSchema),
    defaultValues: ownerEditFormData,
  })

  const restaurantForm = useForm({
    resolver: zodResolver(restaurantSchema),
    defaultValues: restaurantEditFormData,
  })

  const handleEditInputChange = (event) => {
    const { name, value } = event.target

    setOwnerEditFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleRestaurantEditInputChange = (event) => {
    const { name, value } = event.target

    setRestaurantEditFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleOwnerSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    Object.keys(ownerEditFormData).forEach((key) => {
      if (key !== "avatar") {
        formData.append(key, ownerEditFormData[key])
      }
    })

    if (avatarFile) formData.append("avatar", avatarFile)

    formData.forEach((value, key) => {
      console.log(key, value)
    })

    api
      .post(`/api/auth/owner/update/${owner._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("Profil modifié avec succès!", response.data)
        toast({
          title: "Succès",
          description:
            "Profil modifié avec succès! Les modifications seront appliquées dès la prochaine connexion. Veuillez utiliser votre nouveau email lors de la connexion.",
          className: "border-green-500 bg-green-100 text-green-900",
        })
        setOpen(false)
        ownerForm.reset(ownerEditFormData)
      })
      .catch((error) => {
        console.error("Erreur lors de l'envoi:", error.response?.data || error.message)
        toast({
          variant: "destructive",
          title: "Erreur",
          description: error.response?.data?.message || "Une erreur s'est produite.",
        })
      })
  }

  const handleRestaurantSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    Object.keys(restaurantEditFormData).forEach((key) => {
      if (key !== "logo") {
        formData.append(key, restaurantEditFormData[key])
      }
    })

    if (logoFile) formData.append("logo", logoFile)

    formData.forEach((value, key) => {
      console.log(key, value)
    })

    api
      .post(`/api/auth/restaurant/update/${restaurant._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("Restaurant modifié avec succès!", response.data)
        toast({
          title: "Succès",
          description:
            "Restaurant modifié avec succès! Les modifications seront appliquées dès la prochaine connexion.",
          className: "border-green-500 bg-green-100 text-green-900",
        })
        setRestaurantOpen(false)
        restaurantForm.reset(restaurantEditFormData)
      })
      .catch((error) => {
        console.error("Erreur lors de l'envoi:", error.response?.data || error.message)
        toast({
          variant: "destructive",
          title: "Erreur",
          description: error.response?.data?.message || "Une erreur s'est produite.",
        })
      })
  }

  return (
    <div className="px-8 pt-2 pb-2 h-full">
      <Tabs defaultValue="owner" className="w-full h-2/3">
        <TabsList className="w-full mb-6 bg-muted/50">
          <TabsTrigger value="owner" className="flex-1 py-3 text-base">
            Données personnelles
          </TabsTrigger>
          <TabsTrigger value="restaurant" className="flex-1 py-3 text-base">
            Données du restaurant
          </TabsTrigger>
        </TabsList>

        <TabsContent className="h-full" value="owner">
          <Card className="h-full overflow-hidden shadow-md">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row h-full">
                {/* Left sidebar with avatar */}
                <div className="md:w-1/3 bg-gradient-to-b from-primary/10 to-primary/5 flex flex-col items-center justify-start pt-10 pb-6 border-r border-border/50">
                  <div className="relative mb-4 group">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-background shadow-lg">
                      <img
                        src={owner.avatar}
                        alt={`${owner.firstName} ${owner.lastName}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <h2 className="text-2xl font-semibold text-center mb-2">
                    {owner.firstName} {owner.lastName}
                  </h2>
                  <div className="px-4 w-full max-w-xs">
                    <Dialog open={open} onOpenChange={setOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full mt-4 gap-2">
                          <Edit className="h-4 w-4" />
                          Modifier le profil
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Modifier les données</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleOwnerSubmit}>
                          <div className="grid grid-cols-2 gap-4 my-3">
                            <div>
                              <Label htmlFor="lastName">Nom</Label>
                              <Input
                                id="lastName"
                                name="lastName"
                                value={ownerEditFormData.lastName || ""}
                                onChange={handleEditInputChange}
                              />
                            </div>
                            <div>
                              <Label htmlFor="firstName">Prénom</Label>
                              <Input
                                id="firstName"
                                name="firstName"
                                value={ownerEditFormData.firstName || ""}
                                onChange={handleEditInputChange}
                              />
                            </div>
                            <div>
                              <Label htmlFor="phoneNumber">Téléphone</Label>
                              <Input
                                id="phoneNumber"
                                name="phoneNumber"
                                value={ownerEditFormData.phoneNumber || ""}
                                onChange={handleEditInputChange}
                              />
                            </div>
                            <div>
                              <Label htmlFor="email">Email</Label>
                              <Input
                                id="email"
                                name="email"
                                value={ownerEditFormData.email || ""}
                                onChange={handleEditInputChange}
                              />
                            </div>
                            <div>
                              <Label htmlFor="country">Pays</Label>
                              <Input
                                id="country"
                                name="country"
                                value={ownerEditFormData.country || ""}
                                onChange={handleEditInputChange}
                              />
                            </div>
                            <div>
                              <Label htmlFor="city">Ville</Label>
                              <Input
                                id="city"
                                name="city"
                                value={ownerEditFormData.city || ""}
                                onChange={handleEditInputChange}
                              />
                            </div>
                            <div>
                              <Label htmlFor="avatar">Avatar</Label>
                              <Input type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files[0])} />
                            </div>
                          </div>
                          <div className="flex justify-center items-center mt-6">
                            <Button type="submit" className="bg-orange hover:bg-orange-hover">
                              Enregistrer
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                {/* Right content with info */}
                <div className="md:w-2/3 p-6">
                  <h3 className="text-xl font-medium mb-6 pb-2 border-b">Informations personnelles</h3>

                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Numéro de téléphone</p>
                        <p className="font-medium">{owner.phoneNumber || "Non renseigné"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Mail className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{owner.email || "Non renseigné"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Localisation</p>
                        <p className="font-medium">
                          {owner.address?.city && owner.address?.country
                            ? `${owner.address.city}, ${owner.address.country}`
                            : "Non renseigné"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent className="h-full" value="restaurant">
          <Card className="h-full overflow-hidden shadow-md">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row h-full">
                {/* Left sidebar with logo */}
                <div className="md:w-1/3 bg-gradient-to-b from-primary/10 to-primary/5 flex flex-col items-center justify-start pt-10 pb-6 border-r border-border/50">
                  <div className="relative mb-4">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-background shadow-lg">
                      <img
                        src={restaurant.logo}
                        alt={restaurant.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <h2 className="text-2xl font-semibold text-center mb-2">{restaurant.name}</h2>
                  <div className="px-4 w-full max-w-xs">
                    <Dialog open={restaurantOpen} onOpenChange={setRestaurantOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full mt-4 gap-2">
                          <Edit className="h-4 w-4" />
                          Modifier le restaurant
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Modifier les données</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleRestaurantSubmit}>
                          <div className="grid grid-cols-2 gap-4 my-3">
                            <div>
                              <Label htmlFor="restaurantName">Nom</Label>
                              <Input
                                id="restaurantName"
                                name="restaurantName"
                                value={restaurantEditFormData.restaurantName || ""}
                                onChange={handleRestaurantEditInputChange}
                              />
                            </div>
                            <div>
                              <Label htmlFor="restaurantCountry">Pays</Label>
                              <Input
                                id="restaurantCountry"
                                name="restaurantCountry"
                                value={restaurantEditFormData.restaurantCountry || ""}
                                onChange={handleRestaurantEditInputChange}
                              />
                            </div>
                            <div>
                              <Label htmlFor="restaurantCity">Ville</Label>
                              <Input
                                id="restaurantCity"
                                name="restaurantCity"
                                value={restaurantEditFormData.restaurantCity || ""}
                                onChange={handleRestaurantEditInputChange}
                              />
                            </div>
                            <div>
                              <Label htmlFor="restaurantStreet">Adresse</Label>
                              <Input
                                id="restaurantStreet"
                                name="restaurantStreet"
                                value={restaurantEditFormData.restaurantStreet || ""}
                                onChange={handleRestaurantEditInputChange}
                              />
                            </div>
                            <div>
                              <Label htmlFor="logo">Logo</Label>
                              <Input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files[0])} />
                            </div>
                          </div>
                          <div className="flex justify-center items-center mt-6">
                            <Button type="submit" className="bg-orange hover:bg-orange-hover">
                              Enregistrer
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                {/* Right content with info */}
                <div className="md:w-2/3 p-6">
                  <h3 className="text-xl font-medium mb-6 pb-2 border-b">Informations du restaurant</h3>

                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Building className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Nom du restaurant</p>
                        <p className="font-medium">{restaurant.name || "Non renseigné"}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Adresse</p>
                        <p className="font-medium">{restaurant.address?.street || "Non renseigné"}</p>
                        <p className="text-sm">
                          {restaurant.address?.city && restaurant.address?.country
                            ? `${restaurant.address.city}, ${restaurant.address.country}`
                            : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default OwnerProfile

