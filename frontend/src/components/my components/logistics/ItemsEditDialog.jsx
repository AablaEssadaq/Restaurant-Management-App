import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import api from "@/config/api"
import { toast } from "@/hooks/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from 'react'
import { useForm } from "react-hook-form"
import { useSelector } from 'react-redux'
import { z } from 'zod'

const ItemsEditDialog = ({ item, fetchItems }) => {
  const restaurant = useSelector((state) => state.auth.restaurant)
  const [open, setOpen] = useState(false)

  // ✅ Define Zod schema for validation
  const equipementSchema = z.object({
        name: z.string().min(2, "Le nom est trop court"),
        categoryId: z.string().min(1, "L'ID de la catégorie est requis"), // Validate categoryId
        subcategory: z.string().min(2, "Le nom de la sous-catégorie est trop court"),
        quantity: z.number().int().min(0, "La quantité ne peut pas être négative"),
        damaged: z.number().int().min(0, "Le nombre d'équipements endommagés ne peut pas être négatif"),
        brand: z.string().min(1, "La marque est trop courte").optional().default(""),
  });

  const form = useForm({
    resolver: zodResolver(equipementSchema),
    defaultValues: {
      name: item?.name || "",
      categoryId: item?.categoryId || "",
      subcategory: item?.subcategory || "",
      quantity: item?.quantity || 0,
      damaged: item?.damaged || 0,
      brand: item?.brand || "",
    },
  })

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      form.reset({
        name: item?.name || "",
        categoryId: item?.categoryId || "",
        subcategory: item?.subcategory || "",
        quantity: item?.quantity || 0,
        damaged: item?.damaged || 0,
        brand: item?.brand || "",
      })
    }
  }, [open, item, form])


  const onSubmit = async (data) => {

     api.put(`/api/logistics/items/update/${item._id}`, {
        ...data,
        restaurantId: restaurant._id
      })
      .then(response => {
        if (response.status === 200) {
          toast({
            title: "Equipement modifiée",
            description: "L'équipement a été modifié avec succès",
            className: "border-green-500 bg-green-100 text-green-900",
          })
          fetchItems();
          setOpen(false)
        }
      })
      .catch((error)=> {
        console.error("Error submitting form:", error)
        toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la modification de l'équipement'",
        variant: "destructive",
      })
      });
  }


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-yellow hover:bg-yellow-hover" size="sm">
          Modifier
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier l'équipement</DialogTitle>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4 py-4">
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                <FormItem>
                <FormLabel>Equipement</FormLabel>
                <FormControl>
                <Input {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
                )}/>
        
                <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                    <FormItem>
                       <FormLabel>Marque</FormLabel>
                       <FormControl>
                        <Input {...field} />
                       </FormControl>
                       <FormMessage />
                    </FormItem>
                          )}/>
        
                <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                    <FormItem>
                       <FormLabel>Quantité</FormLabel>
                       <FormControl>
                        <Input {...field} type="number"  onChange={(e) => field.onChange(Number(e.target.value))} />
                        </FormControl>
                       <FormMessage />
                    </FormItem>
                )}/>
        
                <FormField
                    control={form.control}
                    name="damaged"
                    render={({ field }) => (
                     <FormItem>
                       <FormLabel>En panne</FormLabel>
                        <FormControl>
                         <Input {...field} type="number" onChange={(e) => field.onChange(Number(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}/>
                    <div>{/* An empty div to fix the footer alignment */}</div>
                    <DialogFooter>
                    <Button className="bg-orange hover:bg-orange-hover" type="submit">
                    Enregistrer
                    </Button>
                   </DialogFooter>
                    </form>
                </Form>
      </DialogContent>
    </Dialog>
  )
}

export default ItemsEditDialog