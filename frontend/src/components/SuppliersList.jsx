import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "./ui/input";
import { Plus, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TableComponent from "./TableComponent";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useUser } from "@/context/UserContext";
import axios from "axios";
import { toast } from "@/hooks/use-toast";




const apiUrl = import.meta.env.VITE_URL_BASE;


// ✅ Define Zod schema for validation
const supplierSchema = z.object({
  lastName: z.string().min(2, "Le nom est trop court"),
  firstName: z.string().min(2, "Le prénom est trop court"),
  phoneNumber: z.string().regex(/^0[567][0-9]{8}$/, "Numéro invalide"),
  email: z.string().email("Email invalide"),
  country: z.string().min(4, "Sélectionnez un pays"),
  city: z.string().min(1, "Sélectionnez une ville"),
  street: z.string().min(5, "Adresse trop courte"),
  category: z.string().min(1, "Sélectionnez une catégorie"),
  paymentMethod: z.string().min(1, "Sélectionnez un mode de paiement"),
  rib: z.string().optional(),
});

const columns = [
  { label: "Nom", key: "lastName" },
  { label: "Prénom", key: "firstName" },
  { label: "Catégorie", key: "category" },
  { label: "Téléphone", key: "phoneNumber" },
  { label: "Email", key: "email" },
];

const SuppliersList = () => {

  const  { user } = useUser()
  const [suppliersData, setSuppliersData] = useState([]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.post(`${apiUrl}/api/suppliers/list`, {owner_id: user._id});
        setSuppliersData(response.data.suppliers);
        console.log(suppliersData)
      } catch (error) {
        console.error("Erreur de récupération des fournisseurs:", error);
      }
    };
  
    if (user._id) {
      fetchSuppliers();
    }
  }, [suppliersData]);

  const form = useForm({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      lastName: "",
      firstName: "",
      phoneNumber: "",
      email: "",
      country:"",
      city: "",
      street: "",
      category: "",
      paymentMethod: "",
      rib: "",
    },
  });

  // ✅ Handle form submission
  const onSubmit = async(values) => {

    console.log("Form sent:", {...values, owner_id: user._id})

    try {
      const response = await axios.post(`${apiUrl}/api/suppliers/list/add`, {
        ...values,
        owner_id: user._id, // ✅ Ajout correct de l'owner
      });
      console.log("Fournisseur ajouté avec succès:", response.data);
      toast({
            title: "Succès",
            description: "Fournisseur ajouté.",
            className: "border-green-500 bg-green-100 text-green-900",
          });
      form.reset();
    }
     catch (error) {
      console.error("Erreur lors de l'envoi:", error.response?.data || error.message);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.response?.data?.message || "Une erreur s'est produite.",
      });
    }
    
  };

  return (
    <div className="px-8 pt-2 pb-2">
      <div className="flex justify-between items-center">
        <div className="flex gap-1">
          <Input className="h-8 bg-white" placeholder="Recherche" />
          <button>
            <Search />
          </button>
        </div>
        

        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-800">
              <span>
                <Plus />
              </span>
              Nouveau fournisseur
            </Button>
          </DialogTrigger>
          <DialogContent className="md:max-w-[600px] max-h-[550px] overflow-auto">
            <DialogHeader>
              <DialogTitle>Nouveau fournisseur</DialogTitle>
            </DialogHeader>

            {/* ✅ Form starts here */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4 py-4">
                {/* Nom */}
                <FormField control={form.control} name="lastName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Prénom */}
                <FormField control={form.control} name="firstName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Téléphone */}
                <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numéro de téléphone</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Email */}
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                  {/* Pays */}
                  <FormField control={form.control} name="country" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pays</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger><SelectValue placeholder="Sélectionnez un pays" /></SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="Marrakech">Maroc</SelectItem>
                          <SelectItem value="Agadir">Espagne</SelectItem>
                          <SelectItem value="Casablanca">France</SelectItem>
                          <SelectItem value="Tanger">Algerie</SelectItem>
                          <SelectItem value="Rabat">Corée</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Ville */}
                <FormField control={form.control} name="city" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ville</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger><SelectValue placeholder="Sélectionnez une ville" /></SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="Marrakech">Marrakech</SelectItem>
                          <SelectItem value="Agadir">Agadir</SelectItem>
                          <SelectItem value="Casablanca">Casablanca</SelectItem>
                          <SelectItem value="Tanger">Tanger</SelectItem>
                          <SelectItem value="Rabat">Rabat</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Adresse */}
                <FormField control={form.control} name="street" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Catégorie */}
                <FormField control={form.control} name="category" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catégorie</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger><SelectValue placeholder="Sélectionnez une catégorie" /></SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="Nourriture">Nourriture</SelectItem>
                          <SelectItem value="Electroménager">Electroménager</SelectItem>
                          <SelectItem value="Immobilier">Immobilier</SelectItem>
                          <SelectItem value="Hygiène">Hygiène</SelectItem>
                          <SelectItem value="Equipement">Équipement</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                {/* Mode de paiement */}
                <FormField control={form.control} name="paymentMethod" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mode de paiement</FormLabel>
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger><SelectValue placeholder="Sélectionnez un mode" /></SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="Cash">Cash</SelectItem>
                          <SelectItem value="Virement">Virement</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              { /* RIB */}
              <FormField control={form.control} name="rib" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rib</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <div>
                {/* An empty div to fix the footer alignment */}
                </div>
                 <DialogFooter>
                  <Button className="bg-orange hover:bg-orange-hover" type="submit">Enregistrer</Button>
                </DialogFooter>
              </form>
            </Form>
           
          </DialogContent>
        </Dialog>
      </div>
      <br/>
    
    <TableComponent columns={columns} data={suppliersData}/>
   

<div className='flex justify-center items-center'>
<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious href="#" />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
    <PaginationItem>
      <PaginationNext href="#" />
    </PaginationItem>
  </PaginationContent>
</Pagination>
</div>
    </div>
  );
};

export default SuppliersList;
