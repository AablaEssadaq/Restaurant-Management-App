import React from 'react'
import { Input } from './ui/input'
import { Plus, Search } from 'lucide-react'
import { Button } from './ui/button'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"


const SuppliersList = () => {

  const suppliers = [
    {
      nomComplet: "John Doe",
      catégorie: "Nourriture",
      téléphone: "0612345678",
      email:"johndoe@gmail.com"
    },
    {
      nomComplet: "John Doe",
      catégorie: "Nourriture",
      téléphone: "0612345678",
      email:"johndoe@gmail.com"
    },
    {
      nomComplet: "John Doe",
      catégorie: "Nourriture",
      téléphone: "0612345678",
      email:"johndoe@gmail.com"
    },
    {
      nomComplet: "John Doe",
      catégorie: "Nourriture",
      téléphone: "0612345678",
      email:"johndoe@gmail.com"
    },
    {
      nomComplet: "John Doe",
      catégorie: "Nourriture",
      téléphone: "0612345678",
      email:"johndoe@gmail.com"
    },
 
 
  ]

  return (
    <>
    <div className='px-8 pt-2 pb-2'>
      <div className='flex justify-between items-center'>
      <div className='flex gap-1'>
      <Input className="h-8 bg-white" placeholder="Recherche" />
      <button><Search/></button>
      </div>
      <Button className="bg-green-600 hover:bg-green-800"><span><Plus/></span>Nouveau fournisseur</Button>
      </div>
      <br/>
    
      <div className="overflow-auto pb-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='text-black'>Nom Complet</TableHead>
              <TableHead className='text-black'>Catégorie</TableHead>
              <TableHead className='text-black'>Téléphone</TableHead>
              <TableHead className='text-black'>Email</TableHead>
              <TableHead className="text-black text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.map((supplier, index) => (
              <TableRow key={index}>
                <TableCell>{supplier.nomComplet}</TableCell>
                <TableCell>{supplier.catégorie}</TableCell>
                <TableCell>{supplier.téléphone}</TableCell>
                <TableCell>{supplier.email}</TableCell>
                <TableCell className="">
                  <div className="flex gap-2 justify-center items-center">
                    <Button className="bg-yellow hover:bg-yellow-hover" size="sm">
                      Voir détails
                    </Button>
                    <Button className="bg-orange hover:bg-orange-hover"  size="sm">
                      Modifier
                    </Button>
                    <Button className="bg-burgundy hover:bg-burgundy-hover"  size="sm">
                      Supprimer
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

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
    </>
  )
}

export default SuppliersList