import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from "@/hooks/use-toast";
import api from "@/config/api";

const OwnerProfile = () => {
  const ownerSchema = z.object({
    lastName: z.string().min(2, "Le nom est trop court"),
    firstName: z.string().min(2, "Le prénom est trop court"),
    phoneNumber: z.string().regex(/^0[567][0-9]{8}$/, "Numéro invalide"),
    email: z.string().email("Email invalide"),
    country: z.string().min(2, "Sélectionnez un pays"),
    city: z.string().min(1, "Sélectionnez une ville"),
    avatar: z.any().optional(),
  });

  const restaurantSchema = z.object({
    restaurantName: z.string().min(2, "Le nom du restaurant doit contenir au moins 2 caractères"),
    logo: z.any().optional(),
    restaurantCountry: z.string().min(2, "Veuillez sélectionner un pays"),
    restaurantCity: z.string().min(2, "La ville doit contenir au moins 2 caractères"),
    restaurantStreet: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
  });

  const owner = useSelector(state => state.auth?.user) || {};
  const restaurant = useSelector(state => state.auth?.restaurant) || {};

  const [isEditMode, setIsEditMode] = useState(false);
  const [ownerEditFormData, setOwnerEditFormData] = useState({
    lastName: owner?.lastName || "",
    firstName: owner?.firstName || "",
    phoneNumber: owner?.phoneNumber || "",
    email: owner?.email || "",
    country: owner?.address?.country || "",
    city: owner?.address?.city || "",
    avatar: owner?.avatar || "",
  });
  const [restaurantEditFormData, setRestaurantEditFormData] = useState({
    restaurantName: restaurant?.name || "",
    restaurantCountry: restaurant?.address?.country || "",
    restaurantCity: restaurant?.address?.city || "",
    restaurantStreet: restaurant?.address?.street || "",
    logo: restaurant?.logo || "",
  });


  const [open, setOpen] = useState(false);
  const [restaurantOpen, setRestaurantOpen] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [logoFile, setLogoFile] = useState(null);

  const ownerForm = useForm({
    resolver: zodResolver(ownerSchema),
    defaultValues: ownerEditFormData
  });

  const restaurantForm = useForm({
    resolver: zodResolver(restaurantSchema),
    defaultValues: restaurantEditFormData
  });

  const handleEditInputChange = (event) => {
    const { name, value } = event.target;
    
    setOwnerEditFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleRestaurantEditInputChange = (event) => {
    const { name, value } = event.target;
    
    setRestaurantEditFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };


  const handleOwnerSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(ownerEditFormData).forEach((key) => {
      if (key !== "avatar") {
        formData.append(key, ownerEditFormData[key]);
      }
    });

    if (avatarFile) formData.append("avatar", avatarFile);

    formData.forEach((value, key) => {
      console.log(key, value);
    });

    api.post(`/api/auth/owner/update/${owner._id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then(response => {
        console.log("Profil modifié avec succès!", response.data);
        toast({
          title: "Succès",
          description: "Profil modifié avec succès! Les modifications seront appliquées dès la prochaine connexion. Veuillez utiliser votre nouveau email lors de la connexion.",
          className: "border-green-500 bg-green-100 text-green-900",
        })
        setOpen(false);
        ownerForm.reset(ownerEditFormData);
      })
      .catch((error) => {
        console.error("Erreur lors de l'envoi:", error.response?.data || error.message);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: error.response?.data?.message || "Une erreur s'est produite.",
        });
      });
    

  };

  const handleRestaurantSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(restaurantEditFormData).forEach((key) => {
      if (key !== "logo") {
        formData.append(key, restaurantEditFormData[key]);
      }
    });

    if (logoFile) formData.append("logo", logoFile);

    formData.forEach((value, key) => {
      console.log(key, value);
    });

    api.post(`/api/auth/restaurant/update/${restaurant._id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then(response => {
        console.log("Restaurant modifié avec succès!", response.data);
        toast({
          title: "Succès",
          description: "Restaurant modifié avec succès! Les modifications seront appliquées dès la prochaine connexion.",
          className: "border-green-500 bg-green-100 text-green-900",
        })
        setRestaurantOpen(false);
        restaurantForm.reset(restaurantEditFormData);
      })
      .catch((error) => {
        console.error("Erreur lors de l'envoi:", error.response?.data || error.message);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: error.response?.data?.message || "Une erreur s'est produite.",
        });
      });
  };

  return (
    <>
    <div className='px-8 pt-2 pb-2 h-full'>

    <Tabs defaultValue="owner" className="w-full h-2/3">
    <TabsList>
      <TabsTrigger value="owner">Données personnelles</TabsTrigger>
      <TabsTrigger value="restaurant">Données du restaurant</TabsTrigger>
    </TabsList>
    <TabsContent className="h-full" value="owner">
    <Card className='h-full flex justify-center items-center'>
        <div className='h-full w-1/3 border-r flex flex-col gap-4 items-center pt-14'>
        <img src={owner.avatar} alt='image' className='border border-b-slate-500 rounded-full w-[100px] h-[100px]'/>
        <h6 className='text-lg'>{owner.firstName + ' ' + owner.lastName}</h6>
        </div>
        <div className='h-full w-2/3 '>
        <div className='pl-6 py-6 flex flex-col gap-3'>
            <h6 className='text-lg'>Numéro de téléphone : {owner.phoneNumber}</h6>
            <h6 className='text-lg'>Email : {owner.email}</h6>
            <h6 className='text-lg'>Pays : {owner.address.country}</h6>
            <h6 className='text-lg'>Ville : {owner.address.city}</h6>
            <div className="mt-4">
            <Dialog open={open} onOpenChange={setOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-yellow hover:bg-yellow-hover">
                          Modifier
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Modifier les données </DialogTitle>
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
                                <Input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => setAvatarFile(e.target.files[0])} // Mise à jour du state
                                />
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
        </div>
    </Card>
    </TabsContent>
    <TabsContent className="h-full" value="restaurant">
    <Card className='h-full flex justify-center items-center'>
        <div className='h-full w-1/3 border-r flex flex-col gap-4 items-center pt-14'>
        <img src={restaurant.logo} alt='image' className='border border-b-slate-500 rounded-full w-[100px] h-[100px]'/>
        <h6 className='text-lg'>{restaurant.name}</h6>
        </div>
        <div className='h-full w-2/3 '>
        <div className='h-full w-2/3 '>
        <div className='pl-6 py-6 flex flex-col gap-3'>
            <h6 className='text-lg'>Pays : {restaurant.address.country}</h6>
            <h6 className='text-lg'>Ville : {restaurant.address.city}</h6>
            <h6 className='text-lg'>Adresse : {restaurant.address.street}</h6>
            <div className="mt-4">
            <Dialog open={restaurantOpen} onOpenChange={setRestaurantOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-yellow hover:bg-yellow-hover">
                          Modifier
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Modifier les données </DialogTitle>
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
                                <Input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => setLogoFile(e.target.files[0])} // Mise à jour du state
                                />
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
        </div>
        </div>
    </Card>
    </TabsContent>
    </Tabs>
    </div>
    </>
  );
};

export default OwnerProfile;
